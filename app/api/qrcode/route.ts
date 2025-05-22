import { NextResponse } from 'next/server'
import cognitoHelpers from '@/lib/cognitoHelpers'

export async function POST (req: Request): Promise<NextResponse> {
  try {
    const { accessToken } = (await req.json()) as {
      accessToken: string
    }
    const qrcode = await cognitoHelpers.getQrCode(accessToken)
    return NextResponse.json({
      qrcode
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
