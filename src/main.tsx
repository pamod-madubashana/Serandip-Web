import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes?.();

  const theme = tg.themeParams ?? {};
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    root.style.setProperty(`--tg-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`, String(v));
  });
}

createRoot(document.getElementById("root")!).render(<App />);
