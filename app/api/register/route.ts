import cognitoHelpers from '@/lib/cognitoHelpers'
import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const { email, password, passwordHint, name } = (await req.json()) as {
      email: string
      password: string
      passwordHint: string
      name: string
    }

    const signUpResponse = await cognitoHelpers.initiateRegister(email, password, passwordHint, name)

    return NextResponse.json({
      signUpResponse
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
