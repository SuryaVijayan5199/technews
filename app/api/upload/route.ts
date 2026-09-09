import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/permissions";
import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit for input files

const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "984383337327624").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "xN3fNkM01NYiUZ2q8t1J7HAohjE").trim();

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function POST(req: Request) {
  // Auth check — require staff session
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isStaff(session.user.role)) {
    return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 10 MB size limit check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum allowed size is 10 MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Attempt Cloudinary CDN Upload if cloudName is set
    if (cloudName) {
      try {
        const fileBase64 = `data:${file.type};base64,${buffer.toString("base64")}`;
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
      } catch (cloudinaryErr: any) {
        console.warn("Cloudinary upload failed, falling back to sharp WebP optimization:", cloudinaryErr?.message || cloudinaryErr);
      }
    }

    // 2. High-Performance WebP Compression Fallback (sharp)
    // Compresses any uploaded photo into a tiny ~80-120 KB WebP data string so the EXACT user photo is preserved!
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1200, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const optimizedDataUrl = `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;

    return NextResponse.json({
      url: optimizedDataUrl,
      publicId: `optimized-webp-${Date.now()}`,
      width: 1200,
      height: 800,
      format: "webp",
      provider: "sharp-webp",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process uploaded image. Please try another image file." },
      { status: 500 }
    );
  }
}
