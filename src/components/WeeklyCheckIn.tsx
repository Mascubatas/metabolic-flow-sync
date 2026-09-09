import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { daysBetween, todayKey } from "@/lib/calc";

export function WeeklyCheckIn() {
  const { state, addCheckIn, hydrated } = useStore();
  const [dismissed, setDismissed] = useState(false);
  const [tendon, setTendon] = useState([3]);
  const [stiff, setStiff] = useState([3]);
  const [energy, setEnergy] = useState([7]);
  const [sleep, setSleep] = useState([7]);
  const [notes, setNotes] = useState("");

  if (!hydrated || !state.profile) return null;
  const last = state.checkIns[0];
  const due = !last || daysBetween(last.date, todayKey()) >= 7;
  const open = due && !dismissed;

  const rows: [string, number[], (v: number[]) => void, string][] = [
    ["Tendon discomfort", tendon, setTendon, "0 = none, 10 = severe"],
    ["Joint stiffness", stiff, setStiff, "0 = none, 10 = severe"],
    ["Energy in fasted workouts", energy, setEnergy, "0 = flat, 10 = excellent"],
    ["Sleep quality", sleep, setSleep, "0 = poor, 10 = excellent"],
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setDismissed(true)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Weekly condition check-in</DialogTitle>
          <DialogDescription>
            Your answers adjust training volume and swap out aggravating movements.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {rows.map(([label, val, set, hint]) => (
            <div key={label}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium">{label}</p>
                <span className="font-display text-lg font-bold text-primary">{val[0]}</span>
              </div>
              <Slider value={val} onValueChange={set} min={0} max={10} step={1} className="mt-2" />
              <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
            </div>
          ))}
          <Textarea
            placeholder="Anything else worth noting?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            const prev = state.checkIns[0];
            addCheckIn({
              date: todayKey(),
              tendonPain: tendon[0]!,
              jointStiffness: stiff[0]!,
              energy: energy[0]!,
              sleep: sleep[0]!,
              notes,
            });
            setDismissed(true);
            if (prev && tendon[0]! > prev.tendonPain && tendon[0]! >= 5)
              toast.warning("Training volume reduced 15%", {
                description: "Aggravating movements swapped for joint-friendly alternatives.",
              });
            else toast.success("Check-in saved");
          }}
        >
          Save check-in
        </Button>
      </DialogContent>
    </Dialog>
  );
}
