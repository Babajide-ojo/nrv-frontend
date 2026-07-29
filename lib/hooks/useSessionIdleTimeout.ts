"use client";

import { useEffect } from "react";
import {
  expireIdleSession,
  isSessionIdleExpired,
  touchSessionActivity,
} from "@/lib/sessionIdle";

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];

/**
 * Tracks user activity and logs out after 30 minutes of inactivity.
 * Mount inside authenticated landlord/tenant layouts.
 */
export const useSessionIdleTimeout = (enabled = true) => {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    const userRaw = localStorage.getItem("nrv-user");
    if (!userRaw) {
      return;
    }

    touchSessionActivity();

    let throttleUntil = 0;
    const bumpActivity = () => {
      const now = Date.now();
      if (now < throttleUntil) {
        return;
      }
      throttleUntil = now + 1000;
      touchSessionActivity();
    };

    const checkIdle = () => {
      if (isSessionIdleExpired()) {
        expireIdleSession();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkIdle();
      }
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, bumpActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", handleVisibility);
    const intervalId = window.setInterval(checkIdle, 30000);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, bumpActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(intervalId);
    };
  }, [enabled]);
};
