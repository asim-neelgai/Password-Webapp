import cognitoHelpers from '@/lib/cognitoHelpers'

describe('generateSecretHash', () => {
  it('should generate a Base64-encoded string using HMAC-SHA256', () => {
    process.env.COGNITO_CLIENT_SECRET = '1234'

    const encrypted = cognitoHelpers.generateSecretHash('abcd')
    expect(encrypted).toBe('MAAey0oac/xmocI9YqbKcQCePIefB82RREIF+Wii7GA=')
  })
})
