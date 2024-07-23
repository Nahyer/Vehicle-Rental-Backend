import { v2 as cloudinary } from "cloudinary";
import { Context } from "hono";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const generateSignature = async (c: Context) => {
  const folder = await c.req.json();
  console.log("🚀 ~ generateSignature ~ folder:", folder)
  

  if (!folder) {
    return c.json({ message: "Folder name is required" }, 400);
  }

  try {
    const timestamp = Math.round((new Date).getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request({
      timestamp,
      folder
    }, process.env.CLOUDINARY_API_SECRET!);

    return c.json({ timestamp, signature });
  } catch (error:any) {
    console.log(error);
    return c.json({ message: error.message }, 500);
  }
}

