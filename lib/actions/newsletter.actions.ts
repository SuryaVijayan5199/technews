"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq, desc, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/permissions";

/** Subscribe a new email to the database */
export async function subscribeToNewsletterAction(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, cleanEmail))
      .limit(1);

    if (existing.length > 0) {
      // Re-activate if previously unsubscribed
      if (existing[0].unsubscribedAt) {
        await db.update(newsletterSubscribers)
          .set({ unsubscribedAt: null } as any)
          .where(eq(newsletterSubscribers.email, email));
        return { success: true, alreadySubscribed: false };
      }
      return {
        success: true,
        alreadySubscribed: true,
        message: "You're already subscribed to TechCrest Daily! Thank you for staying connected.",
      };
    }

    // Insert new subscriber
    await db.insert(newsletterSubscribers).values({
      email: cleanEmail,
      isConfirmed: true,
      confirmedAt: new Date(),
      createdAt: new Date(),
    });

    revalidatePath("/dashboard/subscribers");
    return {
      success: true,
      message: "Thank you for subscribing! Check your inbox for your first TechCrest briefing.",
    };
  } catch (error: any) {
    console.error("subscribeToNewsletterAction error:", error);
    return { success: false, error: error.message || "Failed to subscribe. Please try again." };
  }
}

/** Get all newsletter subscribers for CMS Dashboard */
export async function getNewsletterSubscribersAction(search = "") {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      throw new Error("Forbidden");
    }
    if (search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      return await db
        .select()
        .from(newsletterSubscribers)
        .where(ilike(newsletterSubscribers.email, q))
        .orderBy(desc(newsletterSubscribers.createdAt));
    }

    return await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(desc(newsletterSubscribers.createdAt));
  } catch (error: any) {
    console.error("getNewsletterSubscribersAction error:", error);
    return [];
  }
}

/** Delete a subscriber from CMS Dashboard */
export async function deleteSubscriberAction(id: number) {
  try {
    const session = await auth();
    if (!session?.user || !isStaff(session.user.role)) {
      throw new Error("Forbidden");
    }
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    revalidatePath("/dashboard/subscribers");
    return { success: true };
  } catch (error: any) {
    console.error("deleteSubscriberAction error:", error);
    return { success: false, error: error.message };
  }
}
