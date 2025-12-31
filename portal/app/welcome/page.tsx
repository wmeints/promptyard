import { WelcomeForm } from "@/components/welcome/welcome-form";

export default function WelcomePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Welcome to Promptyard
                    </h1>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Let&apos;s get you set up with your personal repository
                    </p>
                </div>

                <WelcomeForm />
            </div>
        </div>
    );
}
