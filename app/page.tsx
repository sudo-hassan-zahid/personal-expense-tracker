import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[1280px] mx-auto px-6 py-12 lg:py-0">
      <div className="w-full flex flex-col gap-12 lg:gap-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-6 stagger-1 animate-slide-up">
          <h1 className="text-display-lg lg:text-hero-display text-(--color-on-dark)">
            Take Control of Your <span className="text-(--color-primary)">Finances</span>
          </h1>
          <p className="text-title-md lg:text-title-lg text-(--color-body) max-w-[700px] opacity-90">
            Track your income, monitor your expenses, and grow your net worth with the most powerful
            personal expense tracker.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/signup"
              className="bg-(--color-primary) text-(--color-on-primary) text-button px-[32px] py-[14px] rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-(--color-primary)/20"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="bg-(--color-surface-card-dark) text-(--color-on-dark) text-button px-[32px] py-[14px] rounded-full border border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-2 animate-slide-up">
          <div className="glass-dark rounded-2xl p-8 flex flex-col items-center text-center gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-number-display text-(--color-primary)">256-bit</div>
            <div className="text-title-sm text-(--color-muted)">Bank-grade encryption</div>
          </div>
          <div className="glass-dark rounded-2xl p-8 flex flex-col items-center text-center gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-number-display text-(--color-primary)">100%</div>
            <div className="text-title-sm text-(--color-muted)">Data ownership & privacy</div>
          </div>
          <div className="glass-dark rounded-2xl p-8 flex flex-col items-center text-center gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-number-display text-(--color-primary)">24/7</div>
            <div className="text-title-sm text-(--color-muted)">Uptime & sync reliability</div>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="text-center stagger-3 animate-slide-up">
          <p className="text-body-md text-(--color-muted)">
            No credit card required. Free forever for individuals.
          </p>
        </footer>
      </div>
    </div>
  );
}
