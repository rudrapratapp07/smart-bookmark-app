"use client";

import { createClient } from "@/utils/supabase/client";
import { Bookmark } from "@/types";
import { useEffect, useState } from "react";
import { deleteBookmark } from "@/app/actions";

export default function BookmarkList({
    initialBookmarks,
    userId,
}: {
    initialBookmarks: Bookmark[];
    userId: string;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const supabase = createClient();

    useEffect(() => {
        // Update local state when initialBookmarks prop changes
        // This handles the server-side revalidation updates
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        const channel = supabase
            .channel("realtime bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setBookmarks((current) => [...current, payload.new as Bookmark]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setBookmarks((current) =>
                        current.filter((bookmark) => bookmark.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, userId]);

    const handleDelete = async (id: string) => {
        // Optimistic update
        setBookmarks((current) => current.filter((b) => b.id !== id));
        await deleteBookmark(id);
    };

    return (
        <ul className="mt-8 w-full max-w-md mx-auto space-y-4">
            {bookmarks.map((bookmark) => (
                <li
                    key={bookmark.id}
                    className="bg-white px-4 py-4 shadow sm:rounded-lg flex justify-between items-center"
                >
                    <div className="flex flex-col overflow-hidden">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-indigo-600 truncate hover:text-indigo-800"
                        >
                            {bookmark.title}
                        </a>
                        <span className="text-sm text-gray-500 truncate">{bookmark.url}</span>
                    </div>
                    <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Delete
                    </button>
                </li>
            ))}
            {bookmarks.length === 0 && (
                <li className="text-gray-500 text-center py-4">
                    No bookmarks yet. Add one above!
                </li>
            )}
        </ul>
    );
}
