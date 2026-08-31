import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const isCloudinaryConfigured =
  Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET) &&
  process.env.CLOUDINARY_API_KEY !== "placeholder";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: Request) {
  // Auth check — require user session
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2 MB size limit check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum allowed size is 2 MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
        },
        { status: 400 }
      );
    }

    // Must be image mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed." },
        { status: 400 }
      );
    }

    // Convert file to Buffer & base64 Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Try Cloudinary upload if configured
    if (isCloudinaryConfigured) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
          folder: "technews_articles",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        });

        return NextResponse.json({
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          width: uploadResponse.width,
          height: uploadResponse.height,
          format: uploadResponse.format,
          provider: "cloudinary",
        });
      } catch (cloudinaryErr) {
        console.warn("Cloudinary upload failed, falling back to data URL:", cloudinaryErr);
      }
    }

    // Fallback: Return Data URI directly so image upload NEVER breaks
    return NextResponse.json({
      url: fileBase64,
      publicId: `local-${Date.now()}`,
      width: 800,
      height: 600,
      format: file.type.split("/")[1] || "png",
      provider: "data-uri",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
