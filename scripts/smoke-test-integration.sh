#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Integration smoke test — Admin → EMR → CRM cross-service flow
#
# Usage:
#   bash scripts/smoke-test-integration.sh
#
# Prerequisites: all services running via docker compose
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}  ✓ $1${NC}"; }
fail() { echo -e "${RED}  ✗ $1${NC}"; FAILURES=$((FAILURES + 1)); }
info() { echo -e "${YELLOW}  → $1${NC}"; }

FAILURES=0
AUTH_URL="http://localhost:3001"
EMR_URL="http://localhost:3002"
CRM_URL="http://localhost:3003"
ADMIN_URL="http://localhost:3004"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Patient Health — Integration Smoke Test"
echo "═══════════════════════════════════════════════════════════"

# ── 1. Health checks ─────────────────────────────────────────────────────────
echo ""
echo "1. Health checks"

for svc in "auth:$AUTH_URL" "emr:$EMR_URL" "crm:$CRM_URL" "admin:$ADMIN_URL"; do
  name="${svc%%:*}"
  url="${svc#*:}"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url/health")
  if [ "$status" = "200" ]; then
    pass "$name-service is healthy"
  else
    fail "$name-service health check failed (HTTP $status)"
  fi
done

# ── 2. Auth ───────────────────────────────────────────────────────────────────
echo ""
echo "2. Authentication"

AUTH_RESPONSE=$(docker exec docker-auth-service-1 node -e "
const http = require('http');
const body = JSON.stringify({email:'admin@demo.com',password:'Demo1234!'});
const req = http.request({hostname:'0.0.0.0',port:3001,path:'/auth/login',method:'POST',
  headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}}, res => {
  let d='';res.on('data',c=>d+=c).on('end',()=>console.log(d));
});
req.write(body);req.end();
")

TOKEN=$(echo "$AUTH_RESPONSE" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ const r=JSON.parse(d); console.log(r.accessToken||''); })")

if [ -n "$TOKEN" ]; then
  pass "Login successful (admin@demo.com)"
else
  fail "Login failed — cannot continue"
  exit 1
fi

# ── 3. Create member in Admin ─────────────────────────────────────────────────
echo ""
echo "3. Admin — Create member"

TS=$(date +%s)
MEMBER_RESPONSE=$(curl -s -X POST "$ADMIN_URL/api/members" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Smoke\",\"lastName\":\"Test$TS\",\"dateOfBirth\":\"1975-08-22\",\"sex\":\"male\",\"email\":\"smoke.$TS@example.com\",\"organisationId\":\"org-springfield-medical\",\"riskLevel\":\"low\"}")

MEMBER_ID=$(echo "$MEMBER_RESPONSE" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ const r=JSON.parse(d); console.log(r.data?.id||''); })")
MEMBER_NUM=$(echo "$MEMBER_RESPONSE" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ const r=JSON.parse(d); console.log(r.data?.memberNumber||''); })")

if [ -n "$MEMBER_ID" ]; then
  pass "Member created: $MEMBER_NUM (id: $MEMBER_ID)"
else
  fail "Member creation failed: $MEMBER_RESPONSE"
  exit 1
fi

# ── 4. Wait for async fan-out ─────────────────────────────────────────────────
info "Waiting 3s for async fan-out to EMR + CRM..."
sleep 3

# ── 5. Verify EMR + CRM IDs written back ─────────────────────────────────────
echo ""
echo "4. Fan-out — EMR + CRM IDs written back to Admin member"

MEMBER2=$(curl -s "$ADMIN_URL/api/members/$MEMBER_ID" -H "Authorization: Bearer $TOKEN")
EMR_ID=$(echo "$MEMBER2" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ console.log(JSON.parse(d).data?.emrPatientId||''); })")
CRM_ID=$(echo "$MEMBER2" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ console.log(JSON.parse(d).data?.crmContactId||''); })")

if [ -n "$EMR_ID" ] && [ "$EMR_ID" != "null" ]; then
  pass "emrPatientId written back: $EMR_ID"
else
  fail "emrPatientId not set on Admin member"
fi

if [ -n "$CRM_ID" ] && [ "$CRM_ID" != "null" ]; then
  pass "crmContactId written back: $CRM_ID"
else
  fail "crmContactId not set on Admin member"
fi

# ── 6. Verify EMR patient exists ──────────────────────────────────────────────
echo ""
echo "5. EMR — Patient record created"

EMR_PATIENT=$(curl -s "$EMR_URL/api/patients/$EMR_ID" -H "Authorization: Bearer $TOKEN")
EMR_MRN=$(echo "$EMR_PATIENT" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ console.log(JSON.parse(d).data?.mrn||''); })")

if [ -n "$EMR_MRN" ] && [ "$EMR_MRN" != "null" ]; then
  pass "EMR patient exists: MRN $EMR_MRN"
else
  fail "EMR patient not found (id: $EMR_ID)"
fi

# ── 7. Verify CRM contact has emrPatientId linked ─────────────────────────────
echo ""
echo "6. CRM — Contact created and EMR patient ID linked"

CRM_CONTACT=$(curl -s "$CRM_URL/api/contacts/$CRM_ID" -H "Authorization: Bearer $TOKEN")
CRM_EMR_LINK=$(echo "$CRM_CONTACT" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ console.log(JSON.parse(d).data?.emrPatientId||''); })")

if [ "$CRM_EMR_LINK" = "$EMR_ID" ]; then
  pass "CRM contact has emrPatientId linked correctly"
else
  fail "CRM contact emrPatientId mismatch (got: $CRM_EMR_LINK, expected: $EMR_ID)"
fi

# ── 8. Add clinical data in EMR — verify CRM syncs ───────────────────────────
echo ""
echo "7. EMR → CRM clinical sync"

info "Adding 3 conditions in EMR..."
curl -s -X POST "$EMR_URL/api/patients/$EMR_ID/conditions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"display":"Type 2 Diabetes Mellitus","icd10Code":"E11","clinicalStatus":"active"}' > /dev/null

curl -s -X POST "$EMR_URL/api/patients/$EMR_ID/conditions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"display":"Essential Hypertension","icd10Code":"I10","clinicalStatus":"active"}' > /dev/null

curl -s -X POST "$EMR_URL/api/patients/$EMR_ID/conditions" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"display":"Chronic Kidney Disease Stage 2","icd10Code":"N18.2","clinicalStatus":"active"}' > /dev/null

info "Waiting 3s for clinical sync..."
sleep 3

CRM_AFTER=$(curl -s "$CRM_URL/api/contacts/$CRM_ID" -H "Authorization: Bearer $TOKEN")
CRM_RISK=$(echo "$CRM_AFTER" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ console.log(JSON.parse(d).data?.riskLevel||''); })")

if [ "$CRM_RISK" = "high" ]; then
  pass "CRM risk level auto-elevated to 'high' after 3 active conditions"
else
  fail "CRM risk level not updated (got: $CRM_RISK, expected: high)"
fi

TIMELINE=$(curl -s "$CRM_URL/api/contacts/$CRM_ID/timeline" -H "Authorization: Bearer $TOKEN")
SYNC_EVENTS=$(echo "$TIMELINE" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{ const items=JSON.parse(d).data||[]; console.log(items.filter(i=>i.type==='system_event').length); })")

if [ "$SYNC_EVENTS" -gt 0 ] 2>/dev/null; then
  pass "CRM timeline has $SYNC_EVENTS clinical sync event(s)"
else
  fail "No clinical sync events on CRM timeline"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
if [ "$FAILURES" -eq 0 ]; then
  echo -e "${GREEN}  All tests passed ✓${NC}"
else
  echo -e "${RED}  $FAILURES test(s) failed ✗${NC}"
fi
echo "═══════════════════════════════════════════════════════════"
echo ""

exit $FAILURES
