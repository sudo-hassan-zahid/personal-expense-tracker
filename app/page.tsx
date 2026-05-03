/**
 * Page/Route: page.tsx
 */
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
          <h1 className="text-display-sm md:text-display-lg lg:text-hero-display text-(--color-on-dark)">
            Take Control of Your <span className="text-(--color-primary)">Finances</span>
          </h1>
          <p className="text-body-md md:text-title-md lg:text-title-lg text-(--color-body) max-w-[700px] opacity-90 px-4">
            Track your income, monitor your expenses, and grow your net worth with the most powerful
            personal expense tracker.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full sm:w-auto px-6 sm:px-0">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-(--color-primary) text-(--color-on-primary) text-button px-[32px] py-[14px] rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-(--color-primary)/20 text-center"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-(--color-surface-card-dark) text-(--color-on-dark) text-button px-[32px] py-[14px] rounded-full border border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-all text-center"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 stagger-2 animate-slide-up">
          <div className="glass-dark rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-2 md:gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-display-sm md:text-number-display text-(--color-primary)">
              256-bit
            </div>
            <div className="text-caption md:text-title-sm text-(--color-muted)">
              Bank-grade encryption
            </div>
          </div>
          <div className="glass-dark rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-2 md:gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-display-sm md:text-number-display text-(--color-primary)">
              100%
            </div>
            <div className="text-caption md:text-title-sm text-(--color-muted)">
              Data ownership & privacy
            </div>
          </div>
          <div className="glass-dark rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-2 md:gap-3 border border-(--color-hairline-on-dark)">
            <div className="text-display-sm md:text-number-display text-(--color-primary)">
              24/7
            </div>
            <div className="text-caption md:text-title-sm text-(--color-muted)">
              Uptime & sync reliability
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="text-center stagger-3 animate-slide-up">
          <p className="text-body-md text-(--color-muted)">
            No credit card required. Free forever for individuals.
          </p>
          <p className="mt-2 text-body-sm text-(--color-muted) opacity-70">
            Want to see it in action first?{" "}
            <Link href="/login" className="text-(--color-primary) hover:underline">
              Try the Demo Account
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

