export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3client } from "@/utils/aws"

export async function GET(request: NextRequest) {
  try {
    const fullFileName = request.url.split('?')[1].split('=')[1]

    if (!fullFileName) {
      return NextResponse.json({ ok: false, message: 'File name not provided.' }, { status: 400 })
    }

    const [filename, filetype] = fullFileName.split('.')
    const timestamp = Date.now().toString()

    const command = new PutObjectCommand({
      Bucket: 'superkart',
      Key: `products-images/${filename}-${timestamp}.${filetype}`,
    })

    const signedURL = await getSignedUrl(s3client, command, { expiresIn: 200 })

    if (!signedURL) {
      throw Error('Some issue occured while creating upload URL')
    }

    return NextResponse.json({ ok: true, message: 'Signed URL created successfully.', url: signedURL }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ ok: false, message: error?.toString() })
  }
}