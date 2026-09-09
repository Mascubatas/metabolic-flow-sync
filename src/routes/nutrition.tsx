import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ChefHat, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FOODS, FOOD_CATEGORIES, RECIPES, type Food } from "@/data/foods";
import { mitigationsFor, todayKey } from "@/lib/calc";
import { useStore, useTotals } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Fuel — Meals, Food Log & Smart Mitigation | Metabolix" },
      {
        name: "description",
        content:
          "Log meals from a searchable low-glycemic food database and get instant mitigation steps for off-plan food and drinks.",
      },
      { property: "og:title", content: "Fuel — Meals, Food Log & Smart Mitigation" },
      {
        property: "og:description",
        content:
          "Curated metabolic-friendly recipes, macro tracking and real-time counter-measures for off-plan eating.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionPage,
});

function NutritionPage() {
  const { hydrated, state, addFood, removeFood } = useStore();
  const totals = useTotals();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [recipe, setRecipe] = useState<(typeof RECIPES)[number] | null>(null);
  const [mitigation, setMitigation] = useState<{ name: string; steps: string[] } | null>(null);

  const plan = state.plan;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOODS.filter(
      (f) =>
        (category === "All" || f.category === category) &&
        (q === "" || f.name.toLowerCase().includes(q)),
    ).slice(0, 40);
  }, [query, category]);

  const todayEntries = state.food.filter((f) => f.date === todayKey());

  if (!hydrated) return null;
  if (!plan) {
    return (
      <div className="panel p-6 text-center">
        <p className="text-sm text-muted-foreground">Create your plan first.</p>
        <Button asChild className="mt-4">
          <Link to="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    );
  }

  function log(f: Food) {
    if (!plan) return;
    const steps = f.offPlan || f.sugary || f.alcohol
      ? mitigationsFor({
          calories: f.calories,
          carbs: f.carbs,
          gi: f.gi,
          alcohol: f.alcohol,
          sugary: f.sugary,
          planCalories: plan.calories,
          planCarbs: plan.carbs,
          lowGlycemic: plan.lowGlycemic,
        })
      : [];
    addFood({
      id: `${Date.now()}-${f.id}`,
      date: todayKey(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      name: `${f.name} (${f.serving})`,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      gi: f.gi,
      offPlan: Boolean(f.offPlan || f.sugary || f.alcohol),
      mitigations: steps,
    });
    if (steps.length) setMitigation({ name: f.name, steps });
    else toast.success(`${f.name} logged`);
  }

  const remaining = Math.max(0, plan.calories - totals.calories);

  return (
    <div className="space-y-6 pb-24">
      <section className="panel p-5">
        <h1 className="font-display text-2xl font-bold">Fuel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {Math.round(totals.calories)} / {plan.calories} kcal · {remaining} kcal left ·{" "}
          {Math.round(totals.carbs)}/{plan.carbs} g carbs
        </p>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Meal proposals</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RECIPES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRecipe(r)}
              className="rounded-xl border border-border bg-secondary/40 p-4 text-left transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ChefHat className="h-3.5 w-3.5" /> {r.tag} · {r.gi} GI · {r.minutes} min
              </div>
              <p className="mt-1 font-semibold">{r.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {r.calories} kcal · P {r.protein} · C {r.carbs} · F {r.fat}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Food &amp; drink database</h2>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods, snacks, drinks…"
            className="pl-9"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["All", ...FOOD_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {results.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {f.name}{" "}
                  {(f.offPlan || f.sugary || f.alcohol) && (
                    <span className="ml-1 rounded bg-destructive/20 px-1.5 py-0.5 text-[10px] uppercase text-destructive">
                      off plan
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {f.serving} · {f.calories} kcal · C {f.carbs} g · GI {f.gi}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => log(f)}>
                <Plus className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">No matches.</li>
          )}
        </ul>
      </section>

      <section className="panel p-5">
        <h2 className="font-display text-lg font-bold">Today&apos;s log</h2>
        <ul className="mt-3 space-y-2">
          {todayEntries.map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {e.time} · {e.calories} kcal · P {e.protein} · C {e.carbs} · F {e.fat}
                </p>
                {e.mitigations.length > 0 && (
                  <p className="mt-1 flex items-start gap-1 text-xs text-primary">
                    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    {e.mitigations[0]}
                  </p>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => removeFood(e.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {todayEntries.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">
              Nothing logged yet today.
            </li>
          )}
        </ul>
      </section>

      <Dialog open={!!recipe} onOpenChange={(o) => !o && setRecipe(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{recipe?.name}</DialogTitle>
          </DialogHeader>
          {recipe && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                {recipe.calories} kcal · P {recipe.protein} g · C {recipe.carbs} g · F {recipe.fat} g
                · {recipe.gi} GI
              </p>
              <div>
                <p className="font-semibold">Ingredients</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {recipe.ingredients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Preparation</p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted-foreground">
                  {recipe.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  addFood({
                    id: `${Date.now()}-${recipe.id}`,
                    date: todayKey(),
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    name: recipe.name,
                    calories: recipe.calories,
                    protein: recipe.protein,
                    carbs: recipe.carbs,
                    fat: recipe.fat,
                    gi: recipe.gi === "Low" ? 30 : 55,
                    offPlan: false,
                    mitigations: [],
                  });
                  setRecipe(null);
                  toast.success("Meal logged");
                }}
              >
                Log this meal
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!mitigation} onOpenChange={(o) => !o && setMitigation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitigation plan</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {mitigation?.name} is off plan. Do this to blunt the impact:
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            {mitigation?.steps.map((s) => (
              <li key={s} className="rounded-lg border border-border bg-secondary/40 p-3">
                {s}
              </li>
            ))}
          </ul>
          <Button className="mt-2 w-full" onClick={() => setMitigation(null)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
