import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event) => {
  const s3Client = new S3Client();
  const bucketName = process.env.target_bucket || "uuid-storage";

  const uuids = Array.from({ length: 10 }, () => uuidv4());

  const fileName = new Date().toISOString();
  const fileContent = JSON.stringify({ ids: uuids }, null, 2);
  //   const executionTime = new Date().toISOString();
  //   const microseconds = now.getUTCMilliseconds().toString().padStart(3, '0') + '000';
  //   const formattedTime = executionTime.replace('Z', '') + microseconds;
  //   const fileName = `${executionTime}|${formattedTime}`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: "application/json",
    });

    await s3Client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `File uploaded successfully to ${bucketName}/${fileName}`
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error uploading file"),
    };
  }
};
