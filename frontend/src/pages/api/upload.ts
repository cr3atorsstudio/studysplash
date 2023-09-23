import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY1,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

export default async (req: any, res: any) => {
  if (req.method === "POST") {
    const { id, jsonContent } = req.body;

    const params: S3.Types.PutObjectRequest = {
      Bucket: "studysplash",
      Key: `metadata/user/${id + 1}.json`,
      Body: JSON.stringify(jsonContent),
      ACL: "public-read",
      ContentType: "application/json",
    };

    try {
      const response = await s3
        .upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Successfully uploaded file.", data);
          }
        })
        .promise();
      res.status(200).json({ url: response.Location });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "S3 Upload Failed" });
    }
  } else {
    res.status(405).json({ error: "Only POST method allowed" });
  }
};
