"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { onboardUser } from "@/lib/api";

const welcomeFormSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .max(200, "Full name must be at most 200 characters"),
    introduction: z
        .string()
        .max(500, "Introduction must be at most 500 characters")
        .optional(),
});

type WelcomeFormValues = z.infer<typeof welcomeFormSchema>;

export function WelcomeForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<WelcomeFormValues>({
        resolver: zodResolver(welcomeFormSchema),
        defaultValues: {
            fullName: "",
            introduction: "",
        },
    });

    async function onSubmit(data: WelcomeFormValues) {
        setError(null);

        try {
            const result = await onboardUser({
                fullName: data.fullName,
                introduction: data.introduction || undefined,
            });

            router.push(`/${result.slug}`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unexpected error occurred"
            );
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="introduction"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Personal Introduction{" "}
                                <span className="text-muted-foreground font-normal">
                                    (optional)
                                </span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a bit about yourself..."
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A brief introduction that will appear on your profile.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}
