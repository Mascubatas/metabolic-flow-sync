import { Link } from "@tanstack/react-router";
import { Activity, Apple, BarChart3, Dumbbell, LayoutDashboard } from "lucide-react";

const items = [
  { to: "/", label: "Today", icon: LayoutDashboard },
  { to: "/training", label: "Train", icon: Dumbbell },
  { to: "/nutrition", label: "Fuel", icon: Apple },
  { to: "/analytics", label: "Trends", icon: BarChart3 },
] as const;

export function AppNav() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold leading-tight">Metabolix</p>
            <p className="truncate text-[11px] text-muted-foreground">
              Metabolic &amp; fitness optimization
            </p>
          </div>
          <nav className="ml-auto hidden gap-1 sm:flex">
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: i.to === "/" }}
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur sm:hidden">
        <div className="grid grid-cols-4">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: i.to === "/" }}
            >
              <i.icon className="h-5 w-5" />
              {i.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
