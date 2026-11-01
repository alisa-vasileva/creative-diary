# Creative Diary

A tactile creative diary that gives you one creative task a day. Built with SolidJS and Panda CSS, starting from a Figma Make prototype.

Everything currently lives in the browser's `localStorage`. The code is arranged so that accounts and a [Convex](https://convex.dev) backend can be added later as a sibling package.

## Getting started

Requires Node 22+ and pnpm (`corepack enable` picks up the pinned version).

```sh
pnpm install     # also runs Panda codegen
pnpm dev         # http://localhost:5173
pnpm test        # unit tests (domain logic)
pnpm typecheck
pnpm build       # apps/web/dist
```

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages at <https://alisa-vasileva.github.io/creative-diary/> (`.github/workflows/deploy.yml`). Pages serves the site from `/creative-diary/`, so the workflow builds with `BASE_PATH=/creative-diary/`. Local builds default to `/`.

## Layout

```
apps/
  web/                  SolidJS + Vite + Panda CSS front end (@creative-diary/web)
packages/
  core/                 Framework-free domain logic (@creative-diary/core)
  backend/              (future) Convex functions and schema
```

`@creative-diary/core` holds the vocabulary, types, generation, the day flow (`day.ts`), task rules (`task.ts`) and streak logic. The vocabulary (`vocabulary.ts`) takes context, material and process from the *Ideas Factory* brief, deduplicated edition. The brief has no colour section, so colour keeps the prototype's four groups. It has no UI or storage dependencies, so the web app and a future Convex backend can both import it (Convex functions can validate against the same vocabulary). Workspace packages export TypeScript source directly; there is no build step between them.

### `apps/web/src`

| Folder        | What lives there                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `theme/`      | Panda design tokens, keyframes, text styles, global CSS and recipes (`button`, `glass`)           |
| `ui/`         | Generic primitives with no diary knowledge: `Button`, `Eyebrow`, `PaintedImage`, `Toast`          |
| `components/` | Diary building blocks: `Calendar`, `Cauldron`, `CatStreak`, `IngredientCard`, `StatusPill`, …     |
| `layout/`     | The page frame: `AppShell` (painted background + grid areas), `Masthead`, `Footer`                |
| `views/`      | One component per screen: `StartView`, `ManualView`, `MixingView`, `ReviewView`, `task/`, `EmptyDayView` |
| `state/`      | `today.ts`: connects the pure day flow from `@creative-diary/core` to the store                            |
| `data/`       | The `DiaryStore` interface and its `localStorage` implementation                                  |
| `lib/`        | Small helpers: image compression, painting registry, formatting                                   |

`App.tsx` wires these together; `main.tsx` chooses which `DiaryStore` to provide.

## How the diary works

1. **Start.** On the first visit each day, choose **manual selection** or **random mode**.
2. **Manual selection.** Every category (context, material, process, colour) starts empty. Selecting one shows its ingredient groups, and you can pick a group for as many categories as you like. The cauldron draws the exact word from each picked group and fills empty categories from the whole vocabulary.
3. **Review.** The generated task appears with its four ingredients. Lock the ones you like and re-roll the rest, or re-roll everything if nothing is locked. The first generation is free, then you get **2 re-rolls** a day (`MAX_REROLLS`). A hand-picked category stays within its group when re-rolled.
4. **Accept.** The task is created for today with status *in progress*.
5. **Work.** "Continue working on this task" opens a pop-up for a photo and/or a comment. Submitting either one completes the task. Submissions can be edited for **24 hours** from when the task was created (`EDIT_WINDOW_MS`), then become read-only.
6. **Calendar.** Each day shows • for an in-progress task and ✓ for a completed one. Selecting a day shows its task and saved work, or "no task on this day". The streak counts consecutive days with a completed task.

Reloading at any point resumes where you were, including hand-picked groups, a pending task and re-rolls spent. That state lives in `DayState` (`packages/core/src/day.ts`). Every step is a pure function such as `brew`, `toggleLock`, `reroll` or `finishDay`, and these are unit-tested.

## Data and the path to a backend

Everything that reads or writes the diary goes through one interface, `DiaryStore` (`apps/web/src/data/diary-store.ts`):

```ts
interface DiaryStore {
  tasks: Accessor<Task[]>;
  createTask(input: NewTask): Promise<Task>;
  submitWork(id: string, submission: Submission): Promise<void>; // enforces the 24h window
  day: Accessor<DayState>;                                        // today's unfinished flow
  saveDay(state: DayState): Promise<void>;
}
```

Today `createLocalDiaryStore()` implements it with versioned `localStorage` records (`creative-diary:tasks`, `creative-diary:day`) and keeps tabs in sync. Uploaded photos are downscaled to 1280px JPEGs (typically 150–300 KB) before saving, because `localStorage` only allows about 5 MB per site.

To add Convex:

1. `mkdir packages/backend && cd packages/backend && pnpm init`, name it `@creative-diary/backend`, add `convex` and `@creative-diary/core` as dependencies, then run `npx convex dev` to create `convex/` and a deployment.
2. Define `tasks` and `days` tables in `convex/schema.ts` mirroring `Task` and `DayState`. Run the `@creative-diary/core` transitions (`reroll`, `canEditTask`, …) inside mutations so the server enforces the re-roll limit and the editing window. Store photos with Convex file storage rather than as data URLs.
3. In `apps/web`, write `createConvexDiaryStore(client)`. It should subscribe with `ConvexClient.onUpdate` (from `convex/browser`) to feed Solid signals, and call mutations for the methods.
4. Swap the store passed to `DiaryStoreProvider` in `main.tsx`. Views don't change.

## Styling conventions (Panda CSS v2)

- Styles are colocated with components via `css({...})`. Shared colours and shapes come from tokens in `theme/tokens.ts`: `ink`, `accent` and `category.*` for colour, and a single radius scale (`sm`, `md`, `lg`, `pill`). Don't hand-write asymmetric corners.
- **The Koza display font has no uppercase glyphs yet.** Always apply it with `textStyle: "hand"`, which also sets `text-transform: lowercase`. Never use `fontFamily: "hand"` directly.
- The layout is **mobile-first**, with custom breakpoints: `sm` 481px, `md` 781px (two columns) and `lg` 1121px (full desktop).
- **Overriding a component's styles:** components that are commonly repositioned (`Cauldron`, `PaintedImage`) take a `css` prop. Pass `css={css.raw({...})}` and the component merges it with `css(base, props.css)`. Don't combine two `css()` class strings with `cx` to override a property: with atomic CSS, the stylesheet order decides which one wins, not the class order. `cx` is fine for recipe + utilities, because recipes live in a lower cascade layer.
- **State styles:** use data or ARIA attributes (`data-locked`, `aria-checked`) with selectors like `"&[aria-checked=true]"` instead of toggling a second class. Panda v2 doesn't guarantee authored order between equal-specificity rules such as `:hover` and a state, so make them mutually exclusive (`"&:hover:not([aria-checked=true])"`).
- Only `@pandacss/preset-base` is loaded (utilities and conditions). The default Panda palette and scales are left out on purpose: they map keywords like `lineHeight: "normal"` to tokens.

## Assets

`apps/web/public/paintings/` holds the hand-painted cauldron, fire and streak cat, cropped to their painted area and converted to WebP. The original Figma Make export is git-ignored under `figma make prototype/` for reference.
