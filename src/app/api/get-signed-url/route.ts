export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3client } from "@/utils/aws"
import { ImagePreSignedURLExpiryInterval } from "@/constants"

export async function GET(request: NextRequest) {
  try {
    const filekey = request.nextUrl.searchParams.get('filekey')

    if (!filekey) {
      return NextResponse.json({ ok: false, message: 'File name not provided.' }, { status: 400 })
    }

    const command = new GetObjectCommand({
      Bucket: 'superkart',
      Key: filekey,
    })

    const signedURL = await getSignedUrl(s3client, command, { expiresIn: ImagePreSignedURLExpiryInterval })

    if (!signedURL) {
      return NextResponse.json({ ok: false, message: 'Some error occured.' }, { status: 400 })
    }

    return NextResponse.json({ ok: true, message: 'Signed URL created.', url: signedURL }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: error?.toString() }, { status: 500 })
  }
}