import {
  calculateStreak,
  canEditTask,
  type DateKey,
  startOfMonth,
  type TaskStatus,
  taskStatus,
} from "@creative-diary/core";
import { ArrowLeft } from "lucide-solid";
import { createMemo, createSignal, Match, Show, Switch } from "solid-js";
import { css } from "styled-system/css";
import { Calendar } from "~/components/Calendar";
import { CatStreak } from "~/components/CatStreak";
import { useDiaryStore } from "~/data/diary-store";
import { AppShell } from "~/layout/AppShell";
import { Footer } from "~/layout/Footer";
import { Masthead } from "~/layout/Masthead";
import { createToday } from "~/state/today";
import { Button } from "~/ui/Button";
import { createToast, Toast } from "~/ui/Toast";
import { EmptyDayView } from "~/views/EmptyDayView";
import { ManualView } from "~/views/ManualView";
import { MixingView } from "~/views/MixingView";
import { ReviewView } from "~/views/ReviewView";
import { StartView } from "~/views/StartView";
import { TaskView } from "~/views/task/TaskView";

export function App() {
  const store = useDiaryStore();
  const toast = createToast();
  const today = createToday(store, toast.show);

  /** A day picked in the calendar; null follows today. */
  const [pickedDate, setPickedDate] = createSignal<DateKey | null>(null);
  const [calendarMonth, setCalendarMonth] = createSignal(startOfMonth(new Date()));
  const viewing = () => pickedDate() ?? today.date();
  const viewingToday = () => viewing() === today.date();

  const marks = createMemo(
    () => new Map<DateKey, TaskStatus>(store.tasks().map((task) => [task.date, taskStatus(task)])),
  );
  const streak = createMemo(() =>
    calculateStreak(
      store.tasks().filter((task) => taskStatus(task) === "completed").map((task) => task.date),
      today.date(),
    ),
  );
  const shownTask = createMemo(() =>
    viewingToday() ? today.task() : store.tasks().findLast((task) => task.date === viewing()),
  );

  const goToToday = () => {
    setPickedDate(null);
    setCalendarMonth(startOfMonth(new Date()));
  };
  const selectDate = (date: DateKey) => setPickedDate(date === today.date() ? null : date);

  const submitWork = async (id: string, submission: Parameters<typeof store.submitWork>[1]) => {
    await store.submitWork(id, submission);
    toast.show("Saved. The task is complete.");
  };

  const review = () => {
    const state = today.state();
    return state.step === "review" && state.generation ? { ...state, generation: state.generation } : undefined;
  };

  return (
    <>
      <AppShell
        masthead={<Masthead onHome={goToToday} aside={<CatStreak count={streak()} />} />}
        calendar={
          <Calendar
            month={calendarMonth()}
            onMonthChange={setCalendarMonth}
            selected={viewing()}
            onSelect={selectDate}
            marks={marks()}
          />
        }
        footer={<Footer taskCount={store.tasks().length} />}
      >
        <div class={css({ display: "flex", flexDirection: "column", justifyContent: { md: "center" }, gap: "14px", minHeight: { md: "100%" } })}>
          <Show when={!viewingToday()}>
            <Button variant="link" onClick={goToToday} class={css({ alignSelf: "flex-start" })}>
              <ArrowLeft size={14} /> back to today
            </Button>
          </Show>

          {/* Keyed on the id so switching days resets the view, while edits to the same task don't. */}
          <Show
            when={shownTask()?.id}
            keyed
            fallback={
              <Show when={viewingToday()} fallback={<EmptyDayView date={viewing()} future={viewing() > today.date()} />}>
                <Switch>
                  <Match when={today.mixing()}>
                    <MixingView onDone={today.finishMixing} />
                  </Match>
                  <Match when={review()}>
                    {(state) => (
                      <ReviewView
                        state={state()}
                        onToggleLock={today.toggleLock}
                        onReroll={today.reroll}
                        onAccept={today.accept}
                      />
                    )}
                  </Match>
                  <Match when={today.state().step === "manual"}>
                    <ManualView
                      picks={today.state().picks}
                      onPick={today.setPick}
                      onBack={today.backToStart}
                      onBrew={today.brew}
                    />
                  </Match>
                  <Match when={today.state().step === "start"}>
                    <StartView date={today.date()} onManual={today.beginManual} onRandom={today.rollRandom} />
                  </Match>
                </Switch>
              </Show>
            }
          >
            {(id) => (
              <TaskView
                task={shownTask()!}
                editable={canEditTask(shownTask()!)}
                onSubmit={(submission) => submitWork(id, submission)}
              />
            )}
          </Show>
        </div>
      </AppShell>
      <Toast message={toast.message()} />
    </>
  );
}
