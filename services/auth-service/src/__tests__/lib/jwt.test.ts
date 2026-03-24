import jwt from 'jsonwebtoken'
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getAccessTokenTtlSeconds,
} from '../../lib/jwt'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-in-prod'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-in-prod'

describe('JWT utilities', () => {
  describe('signAccessToken / verifyAccessToken', () => {
    it('issues a token with the correct payload', () => {
      const token = signAccessToken('user-123', 'physician')
      const payload = verifyAccessToken(token)

      expect(payload.sub).toBe('user-123')
      expect(payload.role).toBe('physician')
      expect(payload.type).toBe('access')
    })

    it('rejects a refresh token passed to verifyAccessToken', () => {
      // Refresh token is signed with REFRESH_SECRET so ACCESS_SECRET verification
      // fails with "invalid signature" before the type check — either way it throws.
      const refresh = signRefreshToken('user-123')
      expect(() => verifyAccessToken(refresh)).toThrow()
    })

    it('rejects a token with the correct secret but wrong type field', () => {
      // Craft a token with ACCESS_SECRET but type='refresh' to exercise the type guard
      const wrongType = jwt.sign(
        { sub: 'user-123', role: 'physician', type: 'refresh' },
        ACCESS_SECRET,
        { expiresIn: '1h' }
      )
      expect(() => verifyAccessToken(wrongType)).toThrow('Invalid token type')
    })

    it('rejects an expired access token', () => {
      const expired = jwt.sign(
        { sub: 'user-123', role: 'physician', type: 'access' },
        ACCESS_SECRET,
        { expiresIn: -1 }
      )
      expect(() => verifyAccessToken(expired)).toThrow()
    })

    it('rejects a tampered token', () => {
      const token = signAccessToken('user-123', 'admin')
      const tampered = token.slice(0, -10) + 'tampered00'
      expect(() => verifyAccessToken(tampered)).toThrow()
    })

    it('supports every valid user role', () => {
      const roles = [
        'physician',
        'app',
        'nurse',
        'front_desk',
        'billing',
        'admin',
        'patient',
      ] as const
      for (const role of roles) {
        const token = signAccessToken('user-x', role)
        const payload = verifyAccessToken(token)
        expect(payload.role).toBe(role)
      }
    })
  })

  describe('signRefreshToken / verifyRefreshToken', () => {
    it('issues a refresh token with the correct payload', () => {
      const token = signRefreshToken('user-456')
      const payload = verifyRefreshToken(token)

      expect(payload.sub).toBe('user-456')
      expect(payload.type).toBe('refresh')
    })

    it('rejects an access token passed to verifyRefreshToken', () => {
      // Access token signed with ACCESS_SECRET — REFRESH_SECRET verification throws.
      const access = signAccessToken('user-456', 'nurse')
      expect(() => verifyRefreshToken(access)).toThrow()
    })

    it('rejects a token with the correct secret but wrong type field', () => {
      const wrongType = jwt.sign(
        { sub: 'user-456', type: 'access' },
        REFRESH_SECRET,
        { expiresIn: '1h' }
      )
      expect(() => verifyRefreshToken(wrongType)).toThrow('Invalid token type')
    })

    it('rejects an expired refresh token', () => {
      const expired = jwt.sign(
        { sub: 'user-456', type: 'refresh' },
        REFRESH_SECRET,
        { expiresIn: -1 }
      )
      expect(() => verifyRefreshToken(expired)).toThrow()
    })

    it('rejects a tampered refresh token', () => {
      const token = signRefreshToken('user-456')
      const tampered = token.slice(0, -5) + 'xxxxx'
      expect(() => verifyRefreshToken(tampered)).toThrow()
    })
  })

  describe('getAccessTokenTtlSeconds', () => {
    it('returns 900 for the default 15m expiry', () => {
      // JWT_ACCESS_EXPIRES_IN defaults to '15m' → 15 * 60 = 900
      const ttl = getAccessTokenTtlSeconds()
      expect(ttl).toBe(900)
    })

    it('returns a positive integer', () => {
      const ttl = getAccessTokenTtlSeconds()
      expect(ttl).toBeGreaterThan(0)
      expect(Number.isInteger(ttl)).toBe(true)
    })
  })
})
