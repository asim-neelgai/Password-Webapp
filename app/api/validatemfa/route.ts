import { NextResponse } from 'next/server'
import cognitoHelpers from '@/lib/cognitoHelpers'

export async function POST (req: Request): Promise<NextResponse> {
  try {
    const { accessToken, userCode } = (await req.json()) as {
      accessToken: string
      userCode: string
    }
    const response = await cognitoHelpers.vallidateMFA(userCode, accessToken)
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
