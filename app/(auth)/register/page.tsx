import type { Metadata } from "next";

import AuthSidePanel from "@/components/auth/AuthSidePanel";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Synapse",
  description: "Create your Synapse account",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#EBF1FB]" suppressHydrationWarning>
      <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden shadow-none">
        <SignUpForm />
        <AuthSidePanel />
      </div>
    </div>
  );
}
