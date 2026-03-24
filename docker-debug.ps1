$env:PATH = "C:\Program Files\Docker\Docker\resources\bin;C:\Program Files\nodejs;" + $env:PATH
Write-Host "=== Test from inside container ==="
docker exec docker-emr-service-1 node -e "require('http').get('http://127.0.0.1:3002/health', (r) => { let d=''; r.on('data',c=>d+=c); r.on('end',()=>{console.log(d); process.exit(0)}); }).on('error', (e)=>{ console.error(e.message); process.exit(1) })"
Write-Host ""
Write-Host "=== netstat inside container ==="
docker exec docker-emr-service-1 sh -c "netstat -tlnp 2>/dev/null || ss -tlnp 2>/dev/null || echo 'no netstat/ss'"
