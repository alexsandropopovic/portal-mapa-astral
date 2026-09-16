import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadPdfToR2(pdfBuffer: Buffer, fileName: string): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/$/, "");

  if (!bucketName || !publicDomain) {
    throw new Error("Variáveis R2_BUCKET_NAME ou R2_PUBLIC_DOMAIN não configuradas.");
  }

  const key = `mapas/${Date.now()}-${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    })
  );

  return `${publicDomain}/${key}`;
}