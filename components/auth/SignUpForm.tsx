import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm() {
  return (
    <div className="flex-1 bg-white flex items-center justify-center px-8 py-14 md:px-14 lg:px-20">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Start organizing your work with your details.</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full-name">
              Full Name
            </Label>
            <Input
              id="full-name"
              type="text"
              placeholder="Enter your full name"
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              className="h-11 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-100"
            />
          </div>

          <Label htmlFor="terms" className="cursor-pointer select-none text-sm text-slate-500 font-normal pt-1 leading-normal items-start">
            <Checkbox
              id="terms"
              className="mt-0.5 border-slate-300 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Privacy Policy
              </Link>
              .
            </span>
          </Label>

          <Button
            id="signup-btn"
            type="submit"
            variant="auth"
            size="auth"
            className="w-full h-11 bg-blue-700 hover:bg-blue-600 text-white text-base font-semibold"
          >
            Sign up
          </Button>

          <Button
            id="google-signup"
            type="button"
            variant="authOutline"
            size="auth"
            className="w-full font-medium gap-2"
          >
            <span aria-hidden="true" className="text-base leading-none font-semibold text-slate-900">
              G
            </span>
            Sign up with Google
          </Button>
        </form>

        <p className="mt-8 text-sm text-slate-500 text-center">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
