import Image from "next/image";
import Link from "next/link";
import { PawPrint, ShieldCheck, ArrowRight, Heart } from "@phosphor-icons/react/dist/ssr";

const ILLUSTRATIONS = {
  hero: "/brand/nlGbVEoz4CYU2xQ4RM2oHMY4A.webp",
  catCone: "/brand/K8Xjjocbhdx89JZKaTU1q0M7G8s.webp",
  dogA: "/brand/WqgZrxu7A1wNG9SIK16aSEvgLw.webp",
  dogB: "/brand/TJwPGRRNJo4diVY5WsBwCSOXM8.webp",
  small: "/brand/IpRvqQr1eYNkO6RvjmFE3UoTarQ.webp",
};

export default function Home() {
  return (
    <main className="paper min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <PawPrint weight="fill" size={28} className="text-pink-500" />
          fetch
        </Link>
        <div className="hidden gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#how">How it works</a>
          <a href="#cover">What&apos;s covered</a>
          <a href="#trust">Why Fetch</a>
        </div>
        <Link href="/quote" className="btn-primary text-sm">Get a quote</Link>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-24 md:grid-cols-[1.05fr_1fr] md:pt-20">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide">
            <Heart weight="fill" size={14} /> Choice 2026 — #1 rated pet insurance
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            Pet insurance<br />
            <span className="squiggle">that actually</span><br />
            <span className="text-pink-500" style={{ fontFamily: "var(--font-patrick)" }}>shows up.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Two minutes for a quote. Zero waiting period if your pet checks out healthy.
            Claims paid straight to the vet — no spreadsheets, no chasing.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/quote" className="btn-primary inline-flex items-center gap-2 text-base">
              Check my price <ArrowRight weight="bold" size={18} />
            </Link>
            <span className="text-sm text-ink-soft">Takes about 2 minutes · no card needed</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck weight="fill" size={16} className="text-pink-500"/> All conditions covered</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck weight="fill" size={16} className="text-pink-500"/> Hereditary &amp; congenital</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck weight="fill" size={16} className="text-pink-500"/> Cancel anytime</span>
          </div>
        </div>

        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 rotate-3 rounded-[36px] bg-pink-100" />
          <div className="absolute inset-2 -rotate-2 overflow-hidden rounded-[32px] border-2 border-ink bg-white">
            <Image src={ILLUSTRATIONS.hero} alt="" fill className="object-cover" priority />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border-2 border-ink bg-green px-4 py-3 text-sm font-bold shadow-[6px_6px_0_var(--ink)] md:block">
            &ldquo;Game changer.&rdquo; <span className="font-normal text-ink-soft">— Charlotte &amp; Charlie</span>
          </div>
          <div className="absolute -right-3 top-6 hidden rotate-6 rounded-xl border-2 border-ink bg-lav px-3 py-2 text-lg shadow-[4px_4px_0_var(--ink)] md:block" style={{ fontFamily: "var(--font-patrick)" }}>
            from $1.40 / day
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-12 text-3xl font-extrabold tracking-tight md:text-5xl">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Tell us about your pet", b: "Two minutes, seven questions. We won't ask you to upload anything.", img: ILLUSTRATIONS.small },
            { n: "02", t: "Pick a plan that fits", b: "Live pricing as you go. Pause, change, cancel — never penalised.", img: ILLUSTRATIONS.dogB },
            { n: "03", t: "We pay your vet directly", b: "FetchPay™ at participating clinics. No upfront, no admin.", img: ILLUSTRATIONS.catCone },
          ].map((c) => (
            <div key={c.n} className="card relative p-6">
              <div className="text-2xl text-pink-500" style={{ fontFamily: "var(--font-patrick)" }}>{c.n}</div>
              <div className="relative mt-2 aspect-[4/3] overflow-hidden rounded-xl bg-pink-50">
                <Image src={c.img} alt="" fill className="object-contain p-3" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{c.t}</h3>
              <p className="mt-2 text-ink-soft">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cover" className="paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border-2 border-ink bg-pink-100">
            <Image src={ILLUSTRATIONS.dogA} alt="" fill className="object-contain p-8" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Cover we think you&apos;ll both <span className="text-pink-500" style={{ fontFamily: "var(--font-patrick)" }}>love</span>.
            </h2>
            <ul className="mt-8 space-y-4 text-lg">
              {[
                "Up to 90% back on accidents & illness",
                "Hereditary & congenital conditions",
                "Dental disease, behaviour, alternative therapies",
                "No sub-limits buried in the fine print",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-pink-500" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-6xl px-6 py-20">
        <div className="card flex flex-col items-center gap-6 p-10 text-center md:p-16">
          <p className="text-2xl text-pink-500" style={{ fontFamily: "var(--font-patrick)" }}>Backed by humans (and animals).</p>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            Give them the kind of cover you&apos;d want yourself.
          </h2>
          <Link href="/quote" className="btn-primary inline-flex items-center gap-2 text-base">
            Get my quote <ArrowRight weight="bold" size={18} />
          </Link>
          <p className="text-xs text-ink-soft">AFSL 540762 · No payment until you&apos;re happy</p>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-ink-soft md:flex-row">
          <p>© Fetch Pet Insurance — concept redesign by Gautham Srinivas.</p>
          <p>Not affiliated with Fetch Pet. Built as a portfolio piece.</p>
        </div>
      </footer>
    </main>
  );
}
