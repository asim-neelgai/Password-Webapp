import { AssociateSoftwareTokenCommand, CognitoIdentityProviderClient, ConfirmSignUpCommand, ConfirmSignUpCommandOutput, GetUserCommand, GetUserCommandOutput, InitiateAuthCommand, RespondToAuthChallengeCommand, RespondToAuthChallengeResponse, SetUserMFAPreferenceCommand, SignUpCommand, SignUpCommandOutput, SoftwareTokenMfaSettingsType, VerifySoftwareTokenCommand, VerifySoftwareTokenCommandOutput } from '@aws-sdk/client-cognito-identity-provider'
import { createHmac } from 'crypto'
import { getSession } from 'next-auth/react'
import QR from 'qrcode'

const generateSecretHash = (data: string): string => {
  if (process.env.COGNITO_CLIENT_SECRET == null) {
    throw new Error('COGNITO_CLIENT_SECRET is not set in env')
  }

  return createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET)
    .update(data)
    .digest('base64')
}

type InitiateLoginResponse = {
  success: true
  accessToken?: string
  refreshToken?: string
  cognitoSession?: string
} | {
  success: false
  error: string
}

const initiateLogin = async (username: string, password: string, mfacode?: string): Promise<InitiateLoginResponse> => {
  const response = await (new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  })).send(new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
      // SECRET_HASH: generateSecretHash(`${username}${process.env.COGNITO_CLIENT_ID as string}`)
    }
  }))
  if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
    if (mfacode == null) {
      return {
        success: true,
        cognitoSession: response.Session
      }
    } else {
      if (response.Session == null) {
        return {
          success: false,
          error: 'Session is null'
        }
      }
      const finalResponse = await respondToAuthChallenge(username, mfacode, response.Session)
      if (finalResponse.AuthenticationResult != null) {
        return {
          success: true,
          accessToken: finalResponse.AuthenticationResult.AccessToken,
          refreshToken: finalResponse.AuthenticationResult.RefreshToken
        }
      }
    }
  }
  if ((response.AuthenticationResult?.AccessToken == null) || (response.AuthenticationResult?.RefreshToken == null)) {
    return {
      success: false,
      error: 'Invalid access token or refresh token'
    }
  }
  return {
    success: true,
    accessToken: response.AuthenticationResult.AccessToken,
    refreshToken: response.AuthenticationResult.RefreshToken,
    cognitoSession: response.Session
  }
}

const respondToAuthChallenge = async (username: string, totpCode: string, session: string): Promise<RespondToAuthChallengeResponse> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(new RespondToAuthChallengeCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    ChallengeName: 'SOFTWARE_TOKEN_MFA',
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: totpCode
    }
  }))
  return response
}

const initiateRegister = async (
  email: string,
  password: string,
  passwordHint: string,
  name: string
): Promise<SignUpCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(
    new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      // SecretHash: generateSecretHash(
      //   `${email}${process.env.COGNITO_CLIENT_ID as string}`
      // ),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'custom:passwordHint',
          Value: passwordHint
        }, {
          Name: 'name',
          Value: name
        }
      ]
    })
  )

  return response
}

const initiateConfirmation = async (
  username: string,
  confirmationCode: string
): Promise<ConfirmSignUpCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(
    new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      // SecretHash: generateSecretHash(
      //   `${username}${process.env.COGNITO_CLIENT_ID as string}`
      // ),
      Username: username,
      ConfirmationCode: confirmationCode
    })
  )

  return response
}

const confirmMFA = async (
  username: string,
  confirmationCode: string
): Promise<ConfirmSignUpCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(
    new RespondToAuthChallengeCommand({
      ChallengeName: 'SOFTWARE_TOKEN_MFA',
      ClientId: process.env.COGNITO_CLIENT_ID,
      ChallengeResponses: {
        USERNAME: username,
        SOFTWARE_TOKEN_MFA_CODE: confirmationCode
        // SECRET_HASH: generateSecretHash(`${username}${process.env.COGNITO_CLIENT_ID as string}`)
      }
    })
  )
  return response
}

const getQrCode = async (accessToken: string): Promise<string> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(new AssociateSoftwareTokenCommand({
    AccessToken: accessToken
  }))

  const name = 'FortLock'
  if (response.SecretCode !== undefined) {
    const uri = `otpauth://totp/${decodeURI(name)}?secret=${response.SecretCode}`
    return await new Promise<string>((resolve, reject) => {
      QR.toDataURL(uri, (err, result) => {
        if (err != null) reject(err)
        else {
          return resolve(result)
        }
      })
    })
  }
  return ''
}

const vallidateMFA = async (userCode: string, accessToken: string): Promise<VerifySoftwareTokenCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(new VerifySoftwareTokenCommand({
    AccessToken: accessToken,
    UserCode: userCode
  }))

  return response
}

const setUserMfaPreference = async (softwareTokenMfaSettings: SoftwareTokenMfaSettingsType, accessToken?: string): Promise<VerifySoftwareTokenCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(new SetUserMFAPreferenceCommand({
    AccessToken: accessToken,
    SoftwareTokenMfaSettings: softwareTokenMfaSettings
  }))
  return response
}

const mfaEnabled = async (accessToken: string): Promise<boolean> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(
    new GetUserCommand({
      AccessToken: accessToken
    })
  )
  const hasSoftwareTokenMFA = response.UserMFASettingList?.includes('SOFTWARE_TOKEN_MFA') ?? false
  return hasSoftwareTokenMFA
}
const userDetails = async (accessToken?: string): Promise<GetUserCommandOutput> => {
  const response = await new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION
  }).send(
    new GetUserCommand({
      AccessToken: accessToken
    })
  )
  return response
}

const getToken = async (): Promise<string | undefined> => {
  const session = await getSession()
  return session?.user.accessToken
}
const getCognitoSession = async (): Promise<string | undefined> => {
  const session = await getSession()
  return session?.user?.cognitoSession
}

export default {
  generateSecretHash,
  initiateLogin,
  initiateRegister,
  initiateConfirmation,
  confirmMFA,
  getQrCode,
  vallidateMFA,
  getToken,
  setUserMfaPreference,
  mfaEnabled,
  getCognitoSession,
  userDetails
}
