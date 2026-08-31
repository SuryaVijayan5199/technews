import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/profile-view";
import {
  getUserProfile,
  getUserBookmarks,
  getUserReadingHistory,
} from "@/lib/actions/user.actions";

export const metadata: Metadata = {
  title: "My Profile & Account — TechCrest",
  description:
    "Manage your TechCrest subscriber profile, saved bookmarks, reading history, and account settings.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch real data from DB in parallel
  const [dbUser, userBookmarks, readingHistoryItems] = await Promise.all([
    getUserProfile(session.user.id),
    getUserBookmarks(session.user.id),
    getUserReadingHistory(session.user.id),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ProfileView
          user={{
            id: session.user.id,
            name: dbUser?.name ?? session.user.name,
            email: session.user.email,
            image: dbUser?.image ?? session.user.image,
            role: session.user.role,
            bio: dbUser?.bio ?? null,
            website: dbUser?.website ?? null,
            twitterHandle: dbUser?.twitterHandle ?? null,
          }}
          bookmarks={userBookmarks}
          readingHistory={readingHistoryItems}
        />
      </div>
    </div>
  );
}
