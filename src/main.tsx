import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { APP_NAME } from "./lib/app-config";

document.title = `${APP_NAME} Admin`;

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
