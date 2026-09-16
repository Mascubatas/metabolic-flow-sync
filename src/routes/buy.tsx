import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, CreditCard, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCheckoutSession, PRODUCT_PRICE_USD } from "@/lib/stripe";

const STORAGE_KEY = "metabolix-purchase-details";

type PurchaseDetails = {
  fullName: string;
  email: string;
  company?: string;
};

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy Metabolix — secure checkout" },
      {
        name: "description",
        content:
          "Secure checkout for Metabolix. Enter your details and complete payment with Stripe.",
      },
    ],
  }),
  component: PurchasePage,
});

export function PurchasePage() {
  const [step, setStep] = useState<"details" | "review">("details");
  const [details, setDetails] = useState<PurchaseDetails>({
    fullName: "",
    email: "",
    company: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paymentState = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("payment");
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as PurchaseDetails;
      if (saved) setDetails((current) => ({ ...current, ...saved }));
    } catch {
      // ignore local storage issues
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
    } catch {
      // ignore local storage issues
    }
  }, [details]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim());
  const canContinue = details.fullName.trim().length > 1 && isValidEmail;

  const handleStripeCheckout = async () => {
    if (!canContinue) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await createCheckoutSession({
        data: {
          email: details.email.trim(),
          name: details.fullName.trim(),
          company: details.company?.trim() ?? "",
          amount: PRODUCT_PRICE_USD,
          currency: "usd",
        },
      });

      if (!response?.url) {
        throw new Error("Stripe checkout session was not created successfully.");
      }

      window.location.href = response.url;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start Stripe checkout.";
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  if (paymentState === "success") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="panel space-y-5 p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Check className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Payment complete
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground">Welcome to Metabolix</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Thanks, {details.fullName || "there"}. Your Stripe checkout was successful and your access is ready.
          </p>
          <Button className="w-full" onClick={() => window.location.assign("/")}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (paymentState === "cancelled") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="panel space-y-5 p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <CreditCard className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
              Payment cancelled
            </p>
            <h1 className="font-display text-3xl font-bold text-foreground">No charge was made</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            You can retry the checkout whenever you are ready.
          </p>
          <Button className="w-full" onClick={() => setStep("details")}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Purchase</p>
        <h1 className="font-display text-3xl font-bold">Buy Metabolix</h1>
      </div>

      <div className="panel p-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <span>Metabolix Lifetime Access</span>
          <strong className="text-foreground">${(PRODUCT_PRICE_USD / 100).toFixed(2)}</strong>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className={`h-1.5 flex-1 rounded-full ${step === "review" ? "bg-primary" : "bg-muted"}`} />
      </div>

      {step === "details" ? (
        <section className="panel space-y-5 p-6">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Your details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="full-name"
                  value={details.fullName}
                  onChange={(e) =>
                    setDetails((current) => ({ ...current, fullName: e.target.value }))
                  }
                  className="pl-9"
                  placeholder="Alex Morgan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails((current) => ({ ...current, email: e.target.value }))}
                  className="pl-9"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (optional)</Label>
              <Input
                id="company"
                value={details.company ?? ""}
                onChange={(e) => setDetails((current) => ({ ...current, company: e.target.value }))}
                placeholder="Your studio or team"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Secure Stripe checkout will open next.
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!canContinue || isProcessing}
            onClick={() => setStep("review")}
          >
            Continue to review <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </section>
      ) : (
        <section className="panel space-y-5 p-6">
          <div className="flex items-center gap-2 text-primary">
            <Check className="h-4 w-4" />
            <h2 className="text-sm font-semibold uppercase tracking-wide">Review</h2>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Name</span>
              <strong className="text-right text-foreground">{details.fullName}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Email</span>
              <strong className="text-right text-foreground">{details.email}</strong>
            </div>
            {details.company ? (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Company</span>
                <strong className="text-right text-foreground">{details.company}</strong>
              </div>
            ) : null}
            <div className="flex justify-between gap-3 border-t border-border pt-3">
              <span className="text-muted-foreground">Total</span>
              <strong className="text-right text-foreground">${(PRODUCT_PRICE_USD / 100).toFixed(2)}</strong>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button className="flex-1" disabled={isProcessing} onClick={handleStripeCheckout}>
              {isProcessing ? "Opening Stripe..." : "Pay with Stripe"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
