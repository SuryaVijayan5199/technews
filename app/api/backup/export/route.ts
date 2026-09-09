import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

function safeCellString(val: unknown, maxLen = 30000): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  return str.length > maxLen ? str.slice(0, maxLen) + "... [Truncated]" : str;
}

export async function GET() {
  try {
    const allArticles = await db.query.articles.findMany({
      orderBy: [desc(articles.id)],
      with: {
        author: true,
        category: true,
      },
    });

    const excelRows = allArticles.map((art) => ({
      ID: art.id,
      Title: safeCellString(art.title),
      Slug: safeCellString(art.slug),
      Category: safeCellString(art.category?.name ?? "Unassigned"),
      "Category Slug": safeCellString(art.category?.slug ?? ""),
      Author: safeCellString(art.author?.displayName ?? "Editorial"),
      Status: safeCellString(art.status),
      "Published Date": art.publishedAt
        ? new Date(art.publishedAt).toISOString()
        : "",
      "Created Date": art.createdAt
        ? new Date(art.createdAt).toISOString()
        : "",
      "View Count": art.viewCount ?? 0,
      "Reading Time (min)": art.readingTimeMinutes ?? 5,
      "Is Featured": art.isFeatured ? "YES" : "NO",
      "Is Editor Pick": art.isEditorsPick ? "YES" : "NO",
      "Is Trending": art.isTrending ? "YES" : "NO",
      "Is Briefing": art.isBriefing ? "YES" : "NO",
      "Is Global Briefing": art.isGlobalBriefing ? "YES" : "NO",
      "Is Breaking": art.isBreaking ? "YES" : "NO",
      Excerpt: safeCellString(art.excerpt ?? ""),
      "Content Body": safeCellString(art.content ?? ""),
      "Hero Image URL": safeCellString(art.heroImage ?? ""),
      "SEO Title": safeCellString(art.seoTitle ?? ""),
      "SEO Description": safeCellString(art.seoDescription ?? ""),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Auto-fit column widths for cleaner viewing in Excel
    if (excelRows.length > 0) {
      const keys = Object.keys(excelRows[0]);
      worksheet["!cols"] = keys.map((key) => {
        let maxLen = key.length;
        for (const row of excelRows) {
          const val = String((row as Record<string, unknown>)[key] || "");
          if (val.length > maxLen) {
            maxLen = Math.min(val.length, 60);
          }
        }
        return { wch: maxLen + 2 };
      });
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articles_Backup");

    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `TechCrest_Articles_Backup_${dateStr}.xlsx`;

    return new Response(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating Excel backup:", error);
    return NextResponse.json(
      { error: "Failed to generate database backup" },
      { status: 500 }
    );
  }
}

