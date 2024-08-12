import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const handler = async (event) => {
  const s3Client = new S3Client();
  const bucketName = process.env.target_bucket || "uuid-storage";
  console.log("~~~bucketName~~~", bucketName);

  // Generate 10 random UUIDs
  const uuids = Array.from({ length: 10 }, () => uuidv4());
  console.log("~~~uuids(10)~~~", uuids);

  // Get current ISO time
  //   const executionTime = new Date().toISOString();
  //   const microseconds = now.getUTCMilliseconds().toString().padStart(3, '0') + '000';
  //   const formattedTime = executionTime.replace('Z', '') + microseconds;
  //   const fileName = `${executionTime}|${formattedTime}`;
  const fileName = new Date().toISOString();
  console.log("~~~fileName~~~", fileName);

  // Prepare the file content
  const fileContent = JSON.stringify({ ids: uuids }, null, 2);
  console.log("~~~fileContent~~~", fileContent);

  // Upload the file to S3
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: "application/json",
    });
    console.log("~~~Put Object Command~~~", command);

    await s3Client.send(command);

    console.log(`File uploaded successfully to ${bucketName}/${fileName}`);
    return {
      statusCode: 200,
      body: JSON.stringify(
        `File uploaded successfully to ${bucketName}/${fileName}`
      ),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Error uploading file"),
    };
  }
};
