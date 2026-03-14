import Image from "next/image";

export default function AuthSidePanel() {
  return (
    <div className="relative hidden md:flex flex-1 items-center justify-center overflow-hidden bg-[#EBF1FB]">
      <div className="auth-bubbles-area" aria-hidden>
        <ul className="auth-bubbles">
          <li className="auth-bubble auth-bubble-1" />
          <li className="auth-bubble auth-bubble-2" />
          <li className="auth-bubble auth-bubble-3" />
          <li className="auth-bubble auth-bubble-4" />
          <li className="auth-bubble auth-bubble-5" />
          <li className="auth-bubble auth-bubble-6" />
          <li className="auth-bubble auth-bubble-7" />
          <li className="auth-bubble auth-bubble-8" />
          <li className="auth-bubble auth-bubble-9" />
          <li className="auth-bubble auth-bubble-10" />
        </ul>
      </div>

      <div className="relative z-10 w-[min(78%,680px)] aspect-square">
        <Image
          src="/synapse-logo-no-bg.png"
          alt="Synapse illustration"
          fill
          className="object-contain will-change-transform logo-float-animation"
          sizes="(min-width: 1280px) 38vw, (min-width: 768px) 44vw, 0vw"
          priority
        />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none bg-[#EBF1FB]/20" />
    </div>
  );
}