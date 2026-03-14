import type { Metadata } from "next";
import Link from "next/link";

import AuthSidePanel from "@/components/auth/AuthSidePanel";
import { Button } from "@/components/common/button";

export const metadata: Metadata = {
  title: "Synapse | Landing",
  description: "Temporary landing page for Synapse",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#EBF1FB]" suppressHydrationWarning>
      <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden shadow-none">
        <section className="flex-1 bg-white flex items-center justify-center px-8 py-14 md:px-14 lg:px-20">
          <div className="w-full max-w-sm">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Temporary Landing
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-800 tracking-tight">
              Welcome to Synapse
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              We’re preparing the full product experience. Join now to get early access.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                Clean onboarding flow
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                Fast, focused workspace
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                Ready for upcoming features
              </li>
            </ul>

            <div className="mt-8">
              <Button
                asChild
                variant="auth"
                size="auth"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
              >
                <Link href="/sign-up">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </section>

        <AuthSidePanel />
      </div>
    </div>
  );
}
