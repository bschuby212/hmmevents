import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

try {
  createRoot(root).render(<App />);
  // Only dismiss the boot splash after a successful mount.
  requestAnimationFrame(() => {
    document.getElementById("boot")?.remove();
  });
} catch (error) {
  const boot = document.getElementById("boot");
  if (boot) {
    boot.textContent = "Failed to start — check console";
    boot.style.color = "#b91c1c";
  }
  console.error(error);
}
