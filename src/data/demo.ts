export const sampleRepo = "https://github.com/facebook/react";

export const ingestStages = [
  { label: "Cloning repository", detail: "git clone --depth 1 facebook/react", ms: 1100 },
  { label: "Filtering files", detail: "2,418 source files kept · node_modules ignored", ms: 900 },
  { label: "Parsing with Tree-sitter", detail: "Building AST for 5 languages", ms: 1400 },
  { label: "Language-aware chunking", detail: "9,146 function / class chunks", ms: 1000 },
  { label: "Generating embeddings", detail: "all-MiniLM-L6-v2 · 384 dimensions", ms: 1500 },
  { label: "Indexing in vector store", detail: "Qdrant collection `react@main` ready", ms: 900 },
];

export type Citation = { path: string; lines: string };

export type DemoQA = {
  question: string;
  answer: string;
  citations: Citation[];
  chunks: { path: string; lines: string; vector: number; bm25: number; preview: string }[];
};

export const demoQA: DemoQA[] = [
  {
    question: "How do hooks work internally?",
    answer:
      "Hooks are stored as a linked list on the fiber node, not in the component itself. On the first render React runs `mountWorkInProgressHook`, which appends a new hook object to `workInProgressHook.next`. On updates `updateWorkInProgressHook` walks that same list in order, which is exactly why hooks cannot be called conditionally — the position in the list is the identity of the hook.\n\nEach hook object holds `memoizedState`, a `queue` of pending updates and the `next` pointer. `useState` is a thin wrapper over `useReducer` with a basic state reducer, and dispatching an update schedules work on the fiber rather than mutating state directly.",
    citations: [
      { path: "packages/react-reconciler/src/ReactFiberHooks.js", lines: "742–798" },
      { path: "packages/react-reconciler/src/ReactFiberHooks.js", lines: "1103–1160" },
      { path: "packages/react/src/ReactHooks.js", lines: "84–112" },
    ],
    chunks: [
      {
        path: "packages/react-reconciler/src/ReactFiberHooks.js",
        lines: "742–798",
        vector: 0.91,
        bm25: 0.74,
        preview: "function mountWorkInProgressHook(): Hook {\n  const hook: Hook = { memoizedState: null, baseState: null, queue: null, next: null };",
      },
      {
        path: "packages/react-reconciler/src/ReactFiberHooks.js",
        lines: "1103–1160",
        vector: 0.87,
        bm25: 0.69,
        preview: "function updateReducer(reducer, initialArg, init) {\n  const hook = updateWorkInProgressHook();",
      },
      {
        path: "packages/react/src/ReactHooks.js",
        lines: "84–112",
        vector: 0.79,
        bm25: 0.81,
        preview: "export function useState(initialState) {\n  const dispatcher = resolveDispatcher();",
      },
    ],
  },
  {
    question: "Where does reconciliation start for an update?",
    answer:
      "An update enters through `scheduleUpdateOnFiber`, which marks the root as having pending work and asks the Scheduler for a callback at the right lane priority. The actual tree walk begins in `performConcurrentWorkOnRoot`, which drives `workLoopConcurrent` → `beginWork` down the tree and `completeWork` back up.\n\nBecause the work loop yields between units of work, a high-priority update such as a keypress can interrupt an in-progress render.",
    citations: [
      { path: "packages/react-reconciler/src/ReactFiberWorkLoop.js", lines: "612–668" },
      { path: "packages/react-reconciler/src/ReactFiberBeginWork.js", lines: "3891–3940" },
    ],
    chunks: [
      {
        path: "packages/react-reconciler/src/ReactFiberWorkLoop.js",
        lines: "612–668",
        vector: 0.93,
        bm25: 0.7,
        preview: "export function scheduleUpdateOnFiber(root, fiber, lane) {\n  markRootUpdated(root, lane);",
      },
      {
        path: "packages/react-reconciler/src/ReactFiberBeginWork.js",
        lines: "3891–3940",
        vector: 0.84,
        bm25: 0.66,
        preview: "function beginWork(current, workInProgress, renderLanes) {\n  switch (workInProgress.tag) {",
      },
    ],
  },
  {
    question: "How is the event system wired up?",
    answer:
      "React does not attach listeners to individual DOM nodes. `listenToAllSupportedEvents` attaches one delegated listener per event type at the root container during `createRoot`. When a native event fires, `dispatchEventForPluginEventSystem` collects the fiber path, builds a synthetic event and replays it through the capture and bubble phases of the fiber tree.\n\nThis is why portals still bubble to their React parent rather than their DOM parent — the path comes from the fiber tree, not the DOM.",
    citations: [
      { path: "packages/react-dom-bindings/src/events/DOMPluginEventSystem.js", lines: "402–471" },
      { path: "packages/react-dom-bindings/src/client/ReactDOMRoot.js", lines: "160–188" },
    ],
    chunks: [
      {
        path: "packages/react-dom-bindings/src/events/DOMPluginEventSystem.js",
        lines: "402–471",
        vector: 0.89,
        bm25: 0.77,
        preview: "export function listenToAllSupportedEvents(rootContainerElement) {\n  allNativeEvents.forEach(domEventName => {",
      },
      {
        path: "packages/react-dom-bindings/src/client/ReactDOMRoot.js",
        lines: "160–188",
        vector: 0.75,
        bm25: 0.62,
        preview: "export function createRoot(container, options) {\n  listenToAllSupportedEvents(rootContainerElement);",
      },
    ],
  },
];

export const architectureDiagram = `flowchart TD
  U["Developer"] -->|GitHub URL| FE["Next.js Frontend"]
  FE -->|POST /ingest| ING["Ingestion Service<br/>GitPython + Tree-sitter"]
  ING --> CH["Language-Aware Chunker<br/>function / class boundaries"]
  CH --> EMB["Embedding Service<br/>all-MiniLM-L6-v2"]
  EMB --> VDB[("Vector Store<br/>Qdrant / FAISS")]
  FE -->|question| RET["Hybrid Retriever<br/>cosine + BM25"]
  VDB --> RET
  RET --> PB["Prompt Builder"]
  PB --> LLM["LLM<br/>Groq LLaMA 3.1 / Gemini"]
  LLM -->|streamed answer + citations| FE
  LLM --> VIZ["Mermaid Generator"]
  VIZ --> FE
  FE --> INT["AI Interviewer"]
  INT --> SBX["Docker Sandbox<br/>test execution"]
  SBX --> JUDGE["LLM Evaluator<br/>correctness / efficiency / style"]
  JUDGE --> FE
  RD[("Redis cache")] --- RET`;

export const dependencyDiagram = `flowchart LR
  app["app/"] --> comps["components/"]
  app --> hooks["hooks/"]
  comps --> ui["components/ui/"]
  comps --> hooks
  hooks --> api["lib/api-client"]
  api --> types["lib/types"]
  app --> api
  server["server/routers"] --> services["services/"]
  services --> parser["services/parser"]
  services --> store["services/vector_store"]
  parser --> types
  store --> types`;

export const interviewQuestion = {
  prompt:
    "In this repository, `useState` is implemented on top of `useReducer` with a basic state reducer. Implement a simplified `createHookList` that stores hooks in order on a fiber and returns the hook for the current index, throwing if the order changes between renders.",
  source: { path: "packages/react-reconciler/src/ReactFiberHooks.js", lines: "742–798" },
  starter: `function createHookList() {
  // hooks are stored in call order
  // return { next(initialState), reset() }
}
`,
  tests: [
    { name: "returns hooks in stable order", passed: true, ms: 12 },
    { name: "reset() rewinds the cursor", passed: true, ms: 8 },
    { name: "throws when hook count shrinks", passed: true, ms: 15 },
    { name: "handles nested component renders", passed: false, ms: 21 },
  ],
  scores: [
    { label: "Correctness", value: 78, note: "3 of 4 test cases pass; nested render cursor is not isolated." },
    { label: "Efficiency", value: 88, note: "O(1) lookup per hook, no reallocation between renders." },
    { label: "Style", value: 82, note: "Clear naming; missing guard clauses and JSDoc." },
  ],
  verdict:
    "Strong grasp of the linked-list hook model and why call order matters. To reach a hire signal, isolate the cursor per fiber so nested renders do not share state, and add an explicit error for conditional hook calls.",
};
