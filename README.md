# Metabolic Flow

App Title: Metabolic & Fitness Optimization Tracker

Tech Stack: React, Tailwind CSS, Lucide Icons, Recharts, LocalStorage/Supabase

App Architecture & Core Flow

Build a modern, mobile-first web application designed for health tracking, metabolic optimization, and dynamic plan adjustment.

A. Comprehensive Onboarding & Health Screening

Step 1: Core Biometrics: Input fields for age, sex, height, current weight, target weight, and daily baseline activity level.

Step 2: Medical & Health Questionnaire:

Multi-select toggles for pre-existing conditions: Diabetes/Pre-diabetes, Thyroid Disorders, Cardiovascular Conditions, Kidney/Renal constraints.

Musculoskeletal & Joint Health: Selectable options for localized issues (e.g., tendon discomfort, joint stiffness, lower back issues). Automatically modifies exercise suggestions to favor joint-friendly protocols.

Medication & Schedule Tracking: Input current medications, dosage, and intake schedules (e.g., daily vs. alternate-day dosing schedules).

Step 3: Optional Clinical Biomarkers: Input fields for baseline lab markers: HbA1c (%), Fasting Glucose (mg/dL), Fasting Insulin (µIU/mL), Lipid Panel (LDL, HDL, Triglycerides), and Kidney Function (eGFR, Urea, Uric Acid).

Step 4: Automated Plan Generator: Generates a custom program with daily calorie/macro targets, hydration goals, joint-conscious training splits, and a 50-day countdown timer for follow-up blood work.

B. Daily Dashboard & Hydration Tracking

Daily Overview: Circular visual rings tracking calories, macros, hydration, and scheduled tasks.

Interactive Water Counter: Tap-to-add glass counter (250 mL increments) with visual fill effects, custom daily target calculation based on body weight, and automated drinking reminders.

Habit Reminders: Checklist for daily workouts, post-meal light movement/stair walks, and medication logs.

C. Training Module & Exercise Adaptations

Scheduled Workouts: Daily routine card detailing exercise names, sets, reps, and target muscles.

YouTube Video Embeds: Inline modal overlay or embedded video player for every exercise showing proper form and technique.

Workout Deviations: "Skipped Gym" or "Replaced Exercise" buttons. Prompts user to pick an alternative (e.g., home bodyweight routine, stair climbing, zone 2 cardio).

D. Nutrition & Mitigation Engine

Meal Proposals: Curated list of low-glycemic, metabolic-friendly recipes complete with ingredients, macro breakdowns, and preparation steps.

Extensive Food & Drink Database: Searchable database categorized into Whole Foods, Prepared Meals, Snacks, Cheat Foods, Sugary Beverages, and Alcohol.

Deviation & Smart Mitigation Logic:

When logging off-plan items, the app calculates glycemic and caloric impact.

Actionable Mitigation Output: Instantly suggests real-time counter-measures (e.g., "15-minute post-meal stair walk," "Adjust remaining daily carb allowance," or "Increase hydration by 500 mL").

E. Symptom Check-ins & Adaptive Feedback

Weekly Condition Check-in: Automated weekly popup evaluating logged conditions (e.g., rating tendon discomfort on a 1–10 scale, tracking daily energy levels during fasted workouts).

Adaptive Recommendations: If tendon pain scores increase, the app automatically lowers training volume or swaps out aggravating movements.

F. Analytics & Biomarker Tracking

Interactive Charts: Recharts-powered graphs showing weight trends, hydration consistency, workout adherence, and side-by-side blood marker comparisons over time.

Data Integration: Sync with wearable devices to import real-time sleep and HRV data.

This integration will enable personalized recovery scores based on daily physiological readiness.

Smart alerts will notify users when stress levels spike.

Notifications should be customizable based on individual user activity patterns.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6bd82254-b0e5-4880-bc9d-eb8938916249).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
