import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, PlayCircle, Repeat, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { daysBetween, todayKey } from "@/lib/calc";
import { REPLACEMENTS, WORKOUTS, type Exercise } from "@/data/exercises";

export const Route = createFileRoute("/training")({
  head: () => ({
    meta: [
      { title: "Training — joint-friendly workouts | Metabolix" },
      {
        name: "description",
        content:
          "Today's sets, reps and target muscles with form videos, plus one-tap swaps when you skip the gym or a movement hurts.",
      },
      { property: "og:title", content: "Training — joint-friendly workouts | Metabolix" },
      {
        property: "og:description",
        content: "Daily routine with form videos and adaptive exercise replacements.",
      },
    ],
  }),
  component: Training,
});

function Training() {
  const { hydrated, state, logWorkout } = useStore();
  const [video, setVideo] = useState<Exercise | null>(null);
  const [swapFor, setSwapFor] = useState<Exercise | null>(null);
  const [skipOpen, setSkipOpen] = useState(false);
  const [swaps, setSwaps] = useState<Record<string, string>>({});

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-muted/50" />;
  if (!state.profile || !state.plan)
    return <p className="text-sm text-muted-foreground">Complete the screening first.</p>;

  const date = todayKey();
  const dayIndex = Math.abs(daysBetween(state.profile.startDate, date)) % WORKOUTS.length;
  const workout = WORKOUTS[dayIndex]!;
  const log = state.workouts[date];
  const factor = state.trainingVolumeFactor;
  const jointAreas = state.profile.joints;

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Day {dayIndex + 1} of your split
        </p>
        <h1 className="font-display text-2xl font-bold">{workout.title}</h1>
        <p className="text-sm text-muted-foreground">
          {workout.focus} · ~{workout.minutes} min
        </p>
      </header>

      {factor < 1 && (
        <div className="flex items-start gap-2 rounded-xl border border-warn/40 bg-warn/10 p-3 text-xs">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p className="text-muted-foreground">
            Volume reduced to {Math.round(factor * 100)}% after your last check-in. Aggravating
            movements are marked and swapped automatically.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {workout.exercises.map((ex) => {
          const aggravating = ex.jointLoad.some((j) => jointAreas.includes(j));
          const swapped = swaps[ex.id];
          const sets = Math.max(1, Math.round(ex.sets * factor));
          return (
            <article key={ex.id} className="panel p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">
                    {swapped ?? ex.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {sets} sets × {ex.reps} · {ex.target}
                  </p>
                  {aggravating && (
                    <p className="mt-1 text-[11px] text-warn">
                      Loads a flagged area — {ex.jointFriendlyAlt ?? "reduce range and tempo"}.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="icon" variant="secondary" aria-label="Watch form video" onClick={() => setVideo(ex)}>
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" aria-label="Replace exercise" onClick={() => setSwapFor(ex)}>
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          className="h-12"
          onClick={() => {
            logWorkout({ date, status: "done" });
            toast.success("Workout logged");
          }}
        >
          <CheckCircle2 className="mr-1 h-4 w-4" /> Mark complete
        </Button>
        <Button variant="secondary" className="h-12" onClick={() => setSkipOpen(true)}>
          <XCircle className="mr-1 h-4 w-4" /> Skipped the gym
        </Button>
      </div>

      {log && (
        <p className="text-center text-xs text-muted-foreground">
          Today logged as <span className="text-foreground">{log.status}</span>
          {log.replacement ? ` — ${log.replacement}` : ""}.
        </p>
      )}

      <Dialog open={!!video} onOpenChange={(o) => !o && setVideo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">{video?.name}</DialogTitle>
          </DialogHeader>
          {video && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.video}`}
                title={`${video.name} form demonstration`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!swapFor} onOpenChange={(o) => !o && setSwapFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Replace {swapFor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {[
              ...(swapFor?.jointFriendlyAlt
                ? [{ id: "jf", name: swapFor.jointFriendlyAlt, detail: "Joint-friendly alternative" }]
                : []),
              ...REPLACEMENTS,
            ].map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => {
                  setSwaps({ ...swaps, [swapFor!.id]: alt.name });
                  setSwapFor(null);
                  toast.success("Exercise replaced", { description: alt.name });
                }}
                className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-left"
              >
                <p className="text-sm font-medium">{alt.name}</p>
                <p className="text-[11px] text-muted-foreground">{alt.detail}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={skipOpen} onOpenChange={setSkipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Pick a replacement session</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {REPLACEMENTS.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => {
                  logWorkout({ date, status: "replaced", replacement: alt.name });
                  setSkipOpen(false);
                  toast.success("Session replaced", { description: alt.detail });
                }}
                className="w-full rounded-xl border border-border bg-secondary/40 p-3 text-left"
              >
                <p className="text-sm font-medium">{alt.name}</p>
                <p className="text-[11px] text-muted-foreground">{alt.detail}</p>
              </button>
            ))}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                logWorkout({ date, status: "skipped" });
                setSkipOpen(false);
                toast("Rest day logged");
              }}
            >
              Nothing today — log as rest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
