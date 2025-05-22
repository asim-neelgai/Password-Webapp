import { NextResponse } from 'next/server'
import cognitoHelpers from '@/lib/cognitoHelpers'
import { SoftwareTokenMfaSettingsType } from '@aws-sdk/client-cognito-identity-provider'

export async function POST (req: Request): Promise<NextResponse> {
  try {
    const { accessToken, softwareTokenMfaSettings } = (await req.json()) as {
      softwareTokenMfaSettings: SoftwareTokenMfaSettingsType
      accessToken: string
    }
    const response = await cognitoHelpers.setUserMfaPreference(softwareTokenMfaSettings, accessToken)
    return NextResponse.json({
      response
    })
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: error.message
      }),
      { status: 500 }
    )
  }
}
