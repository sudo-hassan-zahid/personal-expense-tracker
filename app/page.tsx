import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, ShieldCheck, Sparkles } from "lucide-react";
import { TharvionMark } from "@/components/TharvionLogo";

const signals = [
  { value: "01", title: "See the whole month", copy: "Income, spending, budgets, and momentum in one calm view." },
  { value: "02", title: "Make money intentional", copy: "Turn everyday transactions into plans you can actually follow." },
  { value: "03", title: "Grow without the noise", copy: "Useful insights, clear trends, and no trading-floor complexity." },
];

export default function Home() {
  return (
    <div className="flex-1 overflow-hidden">
      <section className="relative mx-auto grid min-h-[calc(100vh-64px)] max-w-[1280px] items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-10">
        <div className="relative z-10 animate-slide-up">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-(--color-primary)/25 bg-(--color-primary)/8 px-4 py-2 text-caption uppercase tracking-[0.18em] text-(--color-primary)">
            <Sparkles size={14} /> Wealth, made legible
          </div>
          <h1 className="max-w-[760px] text-[48px] font-bold leading-[.98] tracking-[-.045em] text-(--color-on-dark) sm:text-[64px] lg:text-[82px]">
            Your money has a <span className="text-(--color-primary)">next move.</span>
          </h1>
          <p className="mt-7 max-w-[610px] text-[17px] leading-7 text-(--color-muted-strong) sm:text-[19px]">
            Tharvion turns daily spending into a clear path forward—so you can spend with intent, plan with confidence, and build lasting wealth.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="group inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-7 text-button text-(--color-on-primary) transition hover:bg-(--color-primary-active)">
              Start building <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/login" className="inline-flex h-13 items-center justify-center rounded-lg border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark)/70 px-7 text-button text-(--color-on-dark) transition hover:border-(--color-primary)/50">
              Explore the demo
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-body-sm text-(--color-muted)">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-(--color-trading-up)" /> Private by design</span>
            <span className="flex items-center gap-2"><ChartNoAxesCombined size={16} className="text-(--color-primary)" /> Clarity over clutter</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[470px] animate-slide-up stagger-2">
          <div className="absolute inset-[8%] rotate-12 rounded-[32%] border border-(--color-primary)/15 bg-(--color-primary)/3" />
          <div className="absolute inset-[18%] -rotate-6 rounded-[28%] border border-(--color-primary)/30 bg-(--color-surface-card-dark)/70 shadow-[0_0_100px_rgba(252,213,53,.10)] backdrop-blur-xl" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TharvionMark className="h-36 w-36 text-(--color-primary) sm:h-44 sm:w-44" />
            <p className="mt-3 text-caption uppercase tracking-[.35em] text-(--color-muted)">Clarity creates wealth</p>
          </div>
        </div>
      </section>

      <section className="border-y border-(--color-hairline-on-dark) bg-(--color-surface-card-dark)/45">
        <div className="mx-auto grid max-w-[1280px] gap-px md:grid-cols-3">
          {signals.map((item) => (
            <article key={item.value} className="group px-8 py-10 transition hover:bg-(--color-primary)/4 lg:px-10">
              <span className="font-mono text-caption text-(--color-primary)">{item.value}</span>
              <h2 className="mt-5 text-title-lg text-(--color-on-dark)">{item.title}</h2>
              <p className="mt-2 max-w-sm text-body-md leading-6 text-(--color-muted)">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
