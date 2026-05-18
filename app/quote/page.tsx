"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft, ArrowRight, PawPrint, Dog, Cat,
  Confetti, Check, MapPin, User as UserIcon, Calendar,
  Sparkle, GenderMale, GenderFemale, HouseLine, HandHeart,
} from "@phosphor-icons/react";

type Species = "dog" | "cat";
type Sex = "male" | "female";
type Source = "breeder" | "rescue" | "found" | "born";

type State = {
  step: number;
  petName: string;
  species: Species | null;
  sex: Sex | null;
  breed: string;
  dob: string;
  source: Source | null;
  postcode: string;
  humanName: string;
  humanDob: string;
  startDate: string;
  consent: boolean;
  plan: "essentials" | "balanced" | "ultimate" | null;
};

const initial: State = {
  step: 0,
  petName: "",
  species: null,
  sex: null,
  breed: "",
  dob: "",
  source: null,
  postcode: "",
  humanName: "",
  humanDob: "",
  startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  consent: false,
  plan: "balanced",
};

const STEPS = [
  "About them",
  "A little more",
  "Where you live",
  "About you",
  "Confirm",
  "Pick a plan",
  "Done",
];

export default function QuotePage() {
  const [s, setS] = useState<State>(initial);

  const setField = <K extends keyof State>(k: K, v: State[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  const next = () => setS((p) => ({ ...p, step: Math.min(p.step + 1, STEPS.length - 1) }));
  const back = () => setS((p) => ({ ...p, step: Math.max(p.step - 1, 0) }));

  const canAdvance = useMemo(() => {
    switch (s.step) {
      case 0: return !!s.petName.trim() && !!s.species && !!s.sex;
      case 1: return !!s.breed.trim() && !!s.dob && !!s.source;
      case 2: return /^\d{4}$/.test(s.postcode);
      case 3: return !!s.humanName.trim() && !!s.humanDob && !!s.startDate;
      case 4: return s.consent;
      case 5: return !!s.plan;
      default: return true;
    }
  }, [s]);

  const price = useMemo(() => quotePrice(s), [s]);
  const progressPct = ((s.step) / (STEPS.length - 1)) * 100;

  return (
    <main className="paper relative min-h-screen">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <PawPrint weight="fill" size={24} className="text-pink-500" />
          fetch
        </Link>
        <div className="text-sm font-medium text-ink-soft">
          Step <span className="text-ink">{Math.min(s.step + 1, STEPS.length)}</span> of {STEPS.length}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-pink-50">
          <motion.div
            className="h-full rounded-full bg-pink-500"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-3 text-sm text-ink-soft" style={{ fontFamily: "var(--font-patrick)" }}>
          {STEPS[s.step]}
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-40 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {s.step === 0 && <StepPet s={s} setField={setField} />}
            {s.step === 1 && <StepDetails s={s} setField={setField} />}
            {s.step === 2 && <StepLocation s={s} setField={setField} />}
            {s.step === 3 && <StepHuman s={s} setField={setField} />}
            {s.step === 4 && <StepConfirm s={s} setField={setField} />}
            {s.step === 5 && <StepPlan s={s} setField={setField} price={price} />}
            {s.step === 6 && <StepDone s={s} price={price} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {s.step < STEPS.length - 1 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-ink/10 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            {s.step > 0 ? (
              <button onClick={back} className="btn-ghost inline-flex items-center gap-1.5 text-sm">
                <ArrowLeft weight="bold" size={16} /> Back
              </button>
            ) : <span />}
            <div className="flex items-center gap-4">
              {s.step >= 1 && (
                <div className="hidden text-right md:block">
                  <p className="text-xs uppercase tracking-wide text-ink-soft">Estimated</p>
                  <p className="text-lg font-bold leading-tight">${price.monthly.toFixed(0)}<span className="text-sm font-medium text-ink-soft">/mo</span></p>
                </div>
              )}
              <button
                disabled={!canAdvance}
                onClick={next}
                className="btn-primary inline-flex items-center gap-1.5 text-sm"
              >
                {s.step === 4 ? "See my plans" : s.step === 5 ? "Looks good" : "Next"} <ArrowRight weight="bold" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- Steps ---------------- */

function StepPet({ s, setField }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; }) {
  return (
    <div>
      <Hi line="Hi there 👋" />
      <Title>Let&apos;s start with the <Hand>main character</Hand>.</Title>

      <Label>What&apos;s their name?</Label>
      <input
        autoFocus
        className="field"
        placeholder="e.g. Charlie"
        value={s.petName}
        onChange={(e) => setField("petName", e.target.value)}
      />

      <Label className="mt-8">Cat or dog?</Label>
      <div className="grid grid-cols-2 gap-3">
        <ChipBtn on={s.species === "dog"} onClick={() => setField("species", "dog")}>
          <Dog weight="fill" size={22} /> Dog
        </ChipBtn>
        <ChipBtn on={s.species === "cat"} onClick={() => setField("species", "cat")}>
          <Cat weight="fill" size={22} /> Cat
        </ChipBtn>
      </div>

      <Label className="mt-8">{s.petName ? `Is ${s.petName} a…` : "Boy or girl?"}</Label>
      <div className="grid grid-cols-2 gap-3">
        <ChipBtn on={s.sex === "male"} onClick={() => setField("sex", "male")}>
          <GenderMale weight="bold" size={20} /> Boy
        </ChipBtn>
        <ChipBtn on={s.sex === "female"} onClick={() => setField("sex", "female")}>
          <GenderFemale weight="bold" size={20} /> Girl
        </ChipBtn>
      </div>

      <PetCard s={s} />
    </div>
  );
}

function StepDetails({ s, setField }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; }) {
  const breeds = s.species === "cat"
    ? ["Domestic Shorthair", "Ragdoll", "British Shorthair", "Maine Coon", "Burmese", "Other"]
    : ["Mixed breed", "Cavoodle", "Golden Retriever", "Labrador", "French Bulldog", "Border Collie", "Other"];
  return (
    <div>
      <Title><Hand>{s.petName || "They"}&apos;re</Hand> one of a kind.</Title>
      <p className="mb-8 text-ink-soft">A few quick details so we know who we&apos;re covering.</p>

      <Label>Breed</Label>
      <input
        className="field"
        list="breeds"
        placeholder="Start typing…"
        value={s.breed}
        onChange={(e) => setField("breed", e.target.value)}
      />
      <datalist id="breeds">{breeds.map((b) => <option key={b} value={b} />)}</datalist>
      <div className="mt-2 flex flex-wrap gap-2">
        {breeds.slice(0, 5).map((b) => (
          <button key={b} onClick={() => setField("breed", b)} className="rounded-full border border-ink/30 px-3 py-1 text-xs font-medium hover:bg-pink-50">
            {b}
          </button>
        ))}
      </div>

      <Label className="mt-8">Date of birth (or your best guess)</Label>
      <input type="date" className="field" value={s.dob} onChange={(e) => setField("dob", e.target.value)} />

      <Label className="mt-8">How did you find each other?</Label>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(["breeder","rescue","found","born"] as Source[]).map((src) => (
          <ChipBtn key={src} on={s.source === src} onClick={() => setField("source", src)}>
            {src === "breeder" && <Sparkle weight="fill" size={18}/>}
            {src === "rescue" && <HandHeart weight="fill" size={18}/>}
            {src === "found" && <PawPrint weight="fill" size={18}/>}
            {src === "born" && <HouseLine weight="fill" size={18}/>}
            <span className="capitalize">{src === "born" ? "Born at home" : src === "found" ? "Found them" : src}</span>
          </ChipBtn>
        ))}
      </div>
    </div>
  );
}

function StepLocation({ s, setField }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; }) {
  return (
    <div>
      <Title>And <Hand>where</Hand> do you two live?</Title>
      <p className="mb-8 text-ink-soft">Just your postcode for now. We use it to find local vets on FetchPay™.</p>

      <Label>Postcode</Label>
      <div className="relative">
        <MapPin weight="fill" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
        <input
          inputMode="numeric"
          maxLength={4}
          className="field pl-12"
          placeholder="2000"
          value={s.postcode}
          onChange={(e) => setField("postcode", e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <p className="mt-3 text-sm text-ink-soft">Australian residents only. Sorry, future-FetchUS friends.</p>
    </div>
  );
}

function StepHuman({ s, setField }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; }) {
  return (
    <div>
      <Title>Quick — <Hand>your turn</Hand>.</Title>
      <p className="mb-8 text-ink-soft">Promise this is the last bit of typing.</p>

      <Label>Your name</Label>
      <div className="relative">
        <UserIcon weight="fill" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
        <input className="field pl-12" placeholder="e.g. Charlotte" value={s.humanName} onChange={(e) => setField("humanName", e.target.value)} />
      </div>

      <Label className="mt-6">Your date of birth</Label>
      <input type="date" className="field" value={s.humanDob} onChange={(e) => setField("humanDob", e.target.value)} />

      <Label className="mt-6">When should cover start?</Label>
      <div className="relative">
        <Calendar weight="fill" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
        <input type="date" min={new Date().toISOString().slice(0,10)} className="field pl-12" value={s.startDate} onChange={(e) => setField("startDate", e.target.value)} />
      </div>
    </div>
  );
}

function StepConfirm({ s, setField }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; }) {
  return (
    <div>
      <Title>One last <Hand>nod</Hand> from you.</Title>
      <p className="mb-8 text-ink-soft">Quick sanity check before we crunch numbers.</p>

      <div className="card divide-y divide-ink/10 p-6">
        <Row k="Pet" v={`${s.petName} · ${s.species} · ${s.sex}`} />
        <Row k="Breed" v={s.breed} />
        <Row k="Born" v={s.dob || "—"} />
        <Row k="Found via" v={s.source ?? "—"} />
        <Row k="You" v={`${s.humanName} · ${s.postcode}`} />
        <Row k="Cover starts" v={s.startDate} />
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-ink bg-pink-50 p-4 text-sm">
        <input
          type="checkbox"
          checked={s.consent}
          onChange={(e) => setField("consent", e.target.checked)}
          className="mt-1 h-5 w-5 accent-pink-500"
        />
        <span>
          I agree to the <a className="underline">Product Disclosure Statement</a> and the
          {" "}<a className="underline">Privacy Policy</a>. I&apos;m an Aussie resident and at least 18.
        </span>
      </label>
    </div>
  );
}

function StepPlan({ s, setField, price }: { s: State; setField: <K extends keyof State>(k: K, v: State[K]) => void; price: ReturnType<typeof quotePrice>; }) {
  const plans = [
    { id: "essentials" as const, title: "Essentials", tag: "Accident-only", reimburse: 80, excess: 200, monthly: price.tiers.essentials, blurb: "For peace of mind on the unexpected." },
    { id: "balanced" as const, title: "Balanced", tag: "Most popular", reimburse: 85, excess: 100, monthly: price.tiers.balanced, blurb: "Accidents, illness, hereditary — the works." },
    { id: "ultimate" as const, title: "Ultimate", tag: "All the things", reimburse: 90, excess: 0, monthly: price.tiers.ultimate, blurb: "Dental, behaviour, alternative — no excess." },
  ];
  return (
    <div>
      <Title>Three plans. <Hand>One winner</Hand>.</Title>
      <p className="mb-8 text-ink-soft">Live pricing based on {s.petName || "your pet"}&apos;s breed and age. Change anytime.</p>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setField("plan", p.id)}
            className={`card relative p-6 text-left transition ${s.plan === p.id ? "ring-4 ring-pink-200" : ""}`}
          >
            {p.tag === "Most popular" && (
              <span className="absolute -top-3 left-6 rounded-full border-2 border-ink bg-yellow px-3 py-0.5 text-xs font-bold">
                {p.tag}
              </span>
            )}
            <p className="text-xs uppercase tracking-wide text-ink-soft">{p.tag}</p>
            <h3 className="mt-1 text-2xl font-extrabold">{p.title}</h3>
            <p className="mt-2 text-3xl font-extrabold">
              ${p.monthly.toFixed(0)}<span className="text-base font-medium text-ink-soft">/mo</span>
            </p>
            <p className="mt-3 text-sm text-ink-soft">{p.blurb}</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check weight="bold" size={14} className="text-pink-500"/>{p.reimburse}% reimbursement</li>
              <li className="flex items-center gap-2"><Check weight="bold" size={14} className="text-pink-500"/>${p.excess} excess per condition</li>
              <li className="flex items-center gap-2"><Check weight="bold" size={14} className="text-pink-500"/>FetchPay™ at the vet</li>
              {p.id !== "essentials" && <li className="flex items-center gap-2"><Check weight="bold" size={14} className="text-pink-500"/>All conditions covered</li>}
              {p.id === "ultimate" && <li className="flex items-center gap-2"><Check weight="bold" size={14} className="text-pink-500"/>Dental + behaviour</li>}
            </ul>
            <div className={`mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-xs font-bold ${s.plan === p.id ? "bg-pink-100" : ""}`}>
              {s.plan === p.id ? <><Check weight="bold" size={12}/> Selected</> : "Choose"}
            </div>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        Prices are indicative. Final cover subject to Product Disclosure Statement.
      </p>
    </div>
  );
}

function StepDone({ s, price }: { s: State; price: ReturnType<typeof quotePrice>; }) {
  const plan = s.plan ?? "balanced";
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.05 }}
        className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-ink bg-yellow shadow-[6px_6px_0_var(--ink)]"
      >
        <Confetti weight="fill" size={40} />
      </motion.div>
      <Title center>
        {s.petName || "Your pet"} is <Hand>covered</Hand>.
      </Title>
      <p className="mx-auto mt-4 max-w-lg text-ink-soft">
        Cover kicks off {s.startDate}. We&apos;ve sent the details to {s.humanName || "you"}.
        Open the app to add a photo and meet your concierge.
      </p>

      <div className="card mx-auto mt-8 max-w-md p-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">Your plan</p>
            <p className="text-xl font-extrabold capitalize">{plan}</p>
          </div>
          <p className="text-2xl font-extrabold">${price.tiers[plan].toFixed(0)}<span className="text-base font-medium text-ink-soft">/mo</span></p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { k: "Open app", v: "Concierge" },
            { k: "Pre-existing", v: "Skip wait" },
            { k: "FetchPay™", v: "1,200+ vets" },
          ].map((x) => (
            <div key={x.k} className="rounded-xl bg-pink-50 p-3">
              <p className="text-xs text-ink-soft">{x.k}</p>
              <p className="text-sm font-bold">{x.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
        <a href="#" className="btn-primary inline-flex items-center gap-2">Text me the app</a>
        <Link href="/" className="btn-ghost">Back to home</Link>
      </div>
      <p className="mt-6 text-xs text-ink-soft">A concept redesign by Gautham Srinivas.</p>
    </div>
  );
}

/* ---------------- Primitives ---------------- */

function Title({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h1 className={`text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl ${center ? "text-center" : ""}`}>
      {children}
    </h1>
  );
}
function Hand({ children }: { children: React.ReactNode }) {
  return <span className="text-pink-500" style={{ fontFamily: "var(--font-patrick)" }}>{children}</span>;
}
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`mb-2 mt-6 block text-sm font-semibold ${className}`}>{children}</label>;
}
function ChipBtn({ children, on, onClick }: { children: React.ReactNode; on: boolean; onClick: () => void }) {
  return (
    <button data-on={on} onClick={onClick} className="chip inline-flex items-center gap-2">
      {children}
    </button>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="text-ink-soft">{k}</span>
      <span className="font-semibold capitalize">{v}</span>
    </div>
  );
}
function Hi({ line }: { line: string }) {
  return (
    <p className="mb-3 text-2xl" style={{ fontFamily: "var(--font-patrick)", color: "var(--pink-500)" }}>{line}</p>
  );
}
function PetCard({ s }: { s: State }) {
  if (!s.species && !s.petName) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-4"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-pink-50">
        <Image
          src={s.species === "cat" ? "/brand/K8Xjjocbhdx89JZKaTU1q0M7G8s.webp" : "/brand/WqgZrxu7A1wNG9SIK16aSEvgLw.webp"}
          alt=""
          fill
          className="object-contain p-1"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-soft">Meeting</p>
        <p className="text-lg font-bold">
          {s.petName || "Your pet"}{s.species ? ` the ${s.species}` : ""}
        </p>
      </div>
    </motion.div>
  );
}

/* ---------------- Pricing ---------------- */

function quotePrice(s: State) {
  const baseDog = 58;
  const baseCat = 38;
  let base = s.species === "cat" ? baseCat : baseDog;

  if (s.dob) {
    const age = (Date.now() - new Date(s.dob).getTime()) / (365.25 * 86400000);
    if (age > 1) base += Math.max(0, (age - 1) * 3);
  }
  const expensiveBreeds = /french bulldog|bulldog|german shepherd|maine coon|ragdoll/i;
  if (expensiveBreeds.test(s.breed)) base *= 1.18;

  const pc = parseInt(s.postcode || "0", 10);
  if (pc >= 2000 && pc < 2300) base *= 1.06; // metro Sydney bump
  if (pc >= 3000 && pc < 3200) base *= 1.04; // metro Melb

  const balanced = Math.round(base);
  return {
    monthly: balanced,
    tiers: {
      essentials: Math.round(balanced * 0.62),
      balanced,
      ultimate: Math.round(balanced * 1.35),
    },
  };
}
