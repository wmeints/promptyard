import { SignedInHome } from "@/components/home/signed-in-home";
import { SignedOutHero } from "@/components/home/signed-out-hero";
import { getCurrentSession } from "@/lib/session";

export default async function Home() {
  const session = await getCurrentSession();

  if (session?.user) {
    return <SignedInHome />;
  }

  return <SignedOutHero />;
}
