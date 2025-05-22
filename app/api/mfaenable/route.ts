import { NextResponse } from 'next/server'
import cognitoHelpers from '@/lib/cognitoHelpers'

export async function POST (req: Request): Promise<NextResponse> {
  try {
    const { accessToken } = (await req.json()) as {
      accessToken: string
    }
    const mfaEnabled = await cognitoHelpers.mfaEnabled(accessToken)
    return NextResponse.json({
      mfaEnabled
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
