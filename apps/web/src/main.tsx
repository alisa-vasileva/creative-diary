import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/josefin-sans/300.css";
import "@fontsource/josefin-sans/400.css";
import "@fontsource/josefin-sans/600.css";
import "@fontsource/pangolin/400.css";
import "./index.css";

import { render } from "solid-js/web";
import { App } from "./App";
import { DiaryStoreProvider } from "./data/diary-store";
import { createLocalDiaryStore } from "./data/local-diary-store";

// Swap this for a backend-backed store (e.g. Convex) when accounts arrive.
const diaryStore = createLocalDiaryStore();

render(
  () => (
    <DiaryStoreProvider value={diaryStore}>
      <App />
    </DiaryStoreProvider>
  ),
  document.getElementById("root")!,
);
