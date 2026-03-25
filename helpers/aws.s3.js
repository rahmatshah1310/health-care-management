const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { ALLOWED_FILE_TYPES, ALLOWED_AVATAR_TYPES } = require("../constants");
const {
  uploadFileWithErrorHandler,
  uploadAvatarWithErrorHandler,
} = require("./multer");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  },
});

exports.uploadFile = [
  uploadFileWithErrorHandler,
  async (req, res, next) => {
    if (!req.file) return res.fail("Please upload a file ");
    try {
      const originalName = req.file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      const fileName = `files/${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}`;
      const putCommond = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ServerSideEncryption: "AES256",
        Metadata: {
          originalName: originalName,
          uploadBy: req.user.id,
        },
      });

      await s3.send(putCommond);

      const getCommond = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        ResponseContentDisposition: `attachement; filename=${originalName}`,
        ResponseCacheControl: "no-cached, no-store must-revalidate",
      });

      await getSignedUrl(s3, getCommond, {
        expiresIn: 300,
      });

      req.uploadedFile = {
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        fileName: fileName,
        originalName: originalName,
        fileType: ALLOWED_FILE_TYPES[req.file.mimetype],
      };
      next();
    } catch (error) {
      console.error("S3 upload error:", error);
      return res.serverError("Failed to upload file. Please try again.");
    }
  },
];

exports.uploadAvatar = [
  uploadAvatarWithErrorHandler,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.fail("Please upload an avatar file");
      }

      const originalName = req.file.originalname
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9._-]/g, "");
      const fileName = `avatars/${Date.now()}-${Math.round(Math.random() * 1e9)}-${originalName}`;

      const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        Metadata: {
          originalName: originalName,
          uploadedBy: req.user.id,
          fileType: ALLOWED_AVATAR_TYPES[req.file.mimetype],
        },
      });

      await s3.send(putCommand);

      req.uploadedAvatar = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      next();
    } catch (error) {
      console.error("S3 avatar upload error:", error);
      return res.serverError("Failed to upload avatar. Please try again.");
    }
  },
];
