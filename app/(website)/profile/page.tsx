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
    <div className="tc-profile-page">
      <div className="tc-profile-page__inner">
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
