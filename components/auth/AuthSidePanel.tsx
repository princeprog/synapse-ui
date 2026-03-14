import Image from "next/image";

export default function AuthSidePanel() {
  return (
    <div className="relative hidden md:flex flex-1 items-center justify-center overflow-hidden bg-[#EBF1FB]">
      <div className="relative w-[min(78%,680px)] aspect-square">
        <Image
          src="/synapse-logo.png"
          alt="Synapse illustration"
          fill
          className="object-contain will-change-transform logo-float-animation"
          sizes="(min-width: 1280px) 38vw, (min-width: 768px) 44vw, 0vw"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-[#EBF1FB]/20" />
    </div>
  );
}