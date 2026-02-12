"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    const { error } = await supabase.from("bookmarks").insert({
        title,
        url,
        user_id: user.id,
    });

    if (error) {
        console.error("Error adding bookmark:", error);
        return { error: "Failed to add bookmark" };
    }

    revalidatePath("/");
    return { success: true };
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
        console.error("Error deleting bookmark:", error);
        return { error: "Failed to delete bookmark" };
    }

    revalidatePath("/");
    return { success: true };
}
