import cognitoHelpers from '@/lib/cognitoHelpers'
import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const { username, confirmationCode } = (await req.json()) as {
      username: string
      confirmationCode: string
    }

    const signUpConfirmResponse = await cognitoHelpers.initiateConfirmation(username, confirmationCode)

    return NextResponse.json({ signUpConfirmResponse })
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
