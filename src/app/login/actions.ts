"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const signInWithGoogle = async () => {
    const supabase = await createClient();
    // Get origin from headers, but prefer the Vercel URL if available in env or passed explicitly
    // For this specific issue, we'll use a robust fallback logic
    const origin = (await headers()).get("origin") || "https://smart-bookmark-app-ashen.vercel.app";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error);
        return redirect("/login?message=Could not authenticate user");
    }

    return redirect(data.url);
};
