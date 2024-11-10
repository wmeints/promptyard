import BrowseRecentPrompts from "@/components/prompts/BrowseRecentPrompts";
import PageContent from "@/components/shared/PageContent";
import { authOptions } from "@/lib/authentication";
import { getServerSession } from "next-auth";
import Link from "next/link";

function CallToAction() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Unlock the Power of Generative AI with Organized Prompts
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-300">
            Manage, optimize, and elevate your AI prompts in one place. Join Promptyard today to streamline your workflow, enhance your AI interactions, and make prompt management effortless.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/api/auth/signin"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          >
            <circle r={512} cx={512} cy={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <>
      <PageContent title="Your recent prompts">
        <BrowseRecentPrompts />
      </PageContent>
    </>
  )
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session ? <Dashboard /> : <CallToAction />}
    </>
  );
}
