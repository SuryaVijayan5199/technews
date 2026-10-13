"use server";

import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/permissions";

export interface ContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Dynamic server action to submit a contact/feedback message.
 * Validates inputs, saves to Neon DB, and marks status as unread for the editorial team.
 */
export async function submitContactFormAction(data: ContactSubmissionData) {
  try {
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const subject = data.subject?.trim() || "general";
    const message = data.message?.trim();

    if (!name || name.length < 2) {
      return { success: false, error: "Please provide a valid name (at least 2 characters)." };
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    if (!message || message.length < 5) {
      return { success: false, error: "Please enter a message (at least 5 characters)." };
    }

    // Insert into contact_submissions table
    await db.insert(contactSubmissions).values({
      name,
      email,
      subject,
      message,
      status: "unread",
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Thank you for reaching out to TechCrest. Our editorial desk has received your note and will review it promptly.",
    };
  } catch (error: any) {
    console.error("submitContactFormAction error:", error);
    return {
      success: false,
      error: error?.message || "An unexpected error occurred while sending your message. Please try again or email editor@techcrest.news directly.",
    };
  }
}

/**
 * Fetch contact submissions for CMS Dashboard (staff/admin only)
 */
export async function getContactSubmissionsAction(limit = 50) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      return { success: false, error: "Unauthorized access.", submissions: [] };
    }

    const list = await db
      .select()
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(limit);

    return { success: true, submissions: list };
  } catch (error: any) {
    console.error("getContactSubmissionsAction error:", error);
    return { success: false, error: error?.message, submissions: [] };
  }
}
