// // Library
import express from "express";
//import AWS from 'aws-sdk';
import multer from "multer";


// // Database modal
import { ImageModel } from "../../database/allModels";

const Router = express.Router();

// // multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// aws s3 bucket
// const s3Bucket = new AWS.S3({
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_S3_SECRET_KEY,
//     region: "ap-south-1"
// });

// // utility function
import { s3Upload } from "../../utils/s3";

// /**
//  * Route        /
//  * Des          Uploads given image to s3 bucket and saves file link to mongodb
//  * Params       none
//  * Access       Public
//  * Method       POST
//  */
Router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // s3 bucket options
    const bucketOptions = {
      Bucket: "zomato-master-akshat",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // Access Controll List
    };

    // const s3Upload = (options) => {
    //     return new Promise((resolve,reject) => s3Bucket.upload(options, (error, data) => {
    //         if(error) return reject(error);

    //         return resolve(data);
    //     })
    //     );
    // };

    const uploadImage = await s3Upload(bucketOptions);

    // const saveImageToDatabase = await ImageModel.create({
    //   images: [{ location: uploadImage.Location }],
    // });

    return res.status(200).json({ uploadImage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Router.get("/:_id", async (req, res) => {
//   try {
//     const { _id } = req.params;
//     const image = await ImageModel.findById(_id);

//     return res.status(200).json(image);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// });

export default Router;