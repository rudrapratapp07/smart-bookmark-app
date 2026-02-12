"use client";

import { addBookmark } from "@/app/actions";
import { useRef } from "react";

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        await addBookmark(formData);
        formRef.current?.reset();
    };

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="mt-8 space-y-4 w-full max-w-md mx-auto"
        >
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="My Cool Bookmark"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    URL
                </label>
                <div className="mt-1">
                    <input
                        type="url"
                        name="url"
                        id="url"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="https://example.com"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Add Bookmark
            </button>
        </form>
    );
}
