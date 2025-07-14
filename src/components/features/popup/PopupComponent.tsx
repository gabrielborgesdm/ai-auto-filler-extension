import { useState } from "react";
import SettingsComponent from "@/components/features/settings/SettingsComponents";
import AutoFillComponent from "../autofill/AutoFillComponent";

export const ROUTES = {
  SETTINGS: "settings",
  MAIN: "main",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export default function PopupComponent() {
  const [view, setView] = useState<Route>(ROUTES.MAIN);

  return (
    <>
      <button
        onClick={() =>
          setView(view === ROUTES.MAIN ? ROUTES.SETTINGS : ROUTES.MAIN)
        }
        type="button"
        className="absolute top-2 right-2"
      >
        {view === ROUTES.MAIN ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        )}
      </button>
      <h1>AI Input Auto-Filler</h1>

      <img
        src="/logo.png"
        width={64}
        height={64}
        alt="AI Input Auto-Filler logo"
      />

      {view === ROUTES.MAIN && <AutoFillComponent />}
      {view === ROUTES.SETTINGS && (
        <SettingsComponent onSave={() => setView(ROUTES.MAIN)} />
      )}
    </>
  );
}
