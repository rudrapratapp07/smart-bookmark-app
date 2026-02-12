import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userEmail={user.email!} />

      <main className="py-10">
        <div className="px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Bookmarks
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal links securely and in real-time.
          </p>

          <AddBookmarkForm />

          <BookmarkList
            initialBookmarks={bookmarks || []}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}
