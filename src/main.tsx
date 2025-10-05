import { createRoot } from "react-dom/client";
import { App } from "@app/App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root container with id 'root' not found");
}

const root = createRoot(rootElement);
root.render(<App />);
