
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex bg-[#EBF1FB]" suppressHydrationWarning>
      <div
        className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden shadow-none"
      >
        {/* ── LEFT PANEL ── */}
        <div className="relative flex-1 bg-[#F5F8FF] flex flex-col items-center justify-center p-10 overflow-hidden">
          {/* Subtle background blobs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />

          {/* Logo / Brand */}
          <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 4a2 2 0 110 4 2 2 0 010-4zm-4 9.5c0-1.77 3.58-2.75 4-2.75s4 .98 4 2.75v.5H8v-.5z" fill="currentColor" />
              </svg>
            </div>
            <span className="font-semibold text-slate-700 text-base tracking-tight">Synapse</span>
          </div>

          {/* Illustration */}
          <div className="relative z-10 w-full max-w-xs flex items-center justify-center mt-8">
            <Image
              src="/synapse-logo.png"
              alt="Login illustration"
              width={380}
              height={380}
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Tagline */}
          <div className="relative z-10 text-center mt-6 space-y-1">
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Your intelligent workspace for <span className="font-medium text-indigo-600">clarity</span>,{" "}
              <span className="font-medium text-blue-600">focus</span>, and seamless collaboration.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center px-10 py-14 md:px-16">
          {/* Header */}
          <div className="w-full max-w-sm text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back!</h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to your Synapse workspace.
            </p>
          </div>

          {/* Form */}
          <form className="w-full max-w-sm space-y-4">
            {/* Username */}
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full pl-9 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full pl-9 pr-10 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {/* Toggle eye icon placeholder */}
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Toggle password visibility"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 accent-indigo-500 cursor-pointer"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              id="login-btn"
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-[.98] shadow-md shadow-indigo-200 transition-all"
            >
              Log In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex-1 h-px bg-slate-200" />
              or continue with
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3">
              {/* Google */}
              <button
                id="google-login"
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              {/* Microsoft */}
              <button
                id="microsoft-login"
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
                  <path fill="#00A4EF" d="M12.5 1H23v10.5H12.5z" />
                  <path fill="#7FBA00" d="M1 12.5h10.5V23H1z" />
                  <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
                </svg>
                Microsoft
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-sm text-slate-500">
            Not a member?{" "}
            <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
