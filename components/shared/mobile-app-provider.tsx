"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Network } from "@capacitor/network";
import { App } from "@capacitor/app";
import { WifiOff, RefreshCw } from "lucide-react";
import { useTheme } from "next-themes";

export function MobileAppProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const { resolvedTheme } = useTheme();

  // Dynamic native Status Bar theme synchronization
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const syncStatusBarTheme = async () => {
      try {
        const isDark = resolvedTheme === "dark";
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        await StatusBar.setBackgroundColor({
          color: isDark ? "#0a0f1d" : "#ffffff",
        });
      } catch (err) {
        console.warn("[MobileAppProvider] StatusBar error:", err);
      }
    };

    syncStatusBarTheme();
  }, [resolvedTheme]);

  // Network & Back Button listeners
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listenNetwork = async () => {
      try {
        const status = await Network.getStatus();
        setIsOffline(!status.connected);

        Network.addListener("networkStatusChange", (s) => {
          setIsOffline(!s.connected);
        });
      } catch (err) {
        console.warn("[MobileAppProvider] Network error:", err);
      }
    };
    listenNetwork();

    const listenBackButton = async () => {
      try {
        App.addListener("backButton", ({ canGoBack }) => {
          // If any mobile drawer sheet is open, close it first
          const openSheets = document.querySelectorAll(".tc-mobile-sheet-overlay");
          if (openSheets.length > 0) {
            window.dispatchEvent(new CustomEvent("tc_close_mobile_sheets"));
            return;
          }

          // If inside a subpage and can go back, navigate back
          if (canGoBack && typeof window !== "undefined" && window.location.pathname !== "/") {
            window.history.back();
          } else {
            App.minimizeApp();
          }
        });
      } catch (err) {
        console.warn("[MobileAppProvider] App backButton error:", err);
      }
    };
    listenBackButton();
  }, []);

  const handleRetryConnection = async () => {
    if (!Capacitor.isNativePlatform()) {
      window.location.reload();
      return;
    }
    try {
      const status = await Network.getStatus();
      setIsOffline(!status.connected);
      if (status.connected) {
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  return (
    <>
      {children}
      {isOffline && (
        <div className="tc-app-toast" role="status" aria-live="polite">
          <WifiOff className="tc-app-toast__icon" />
          <span>Offline — Showing cached content</span>
          <button
            type="button"
            onClick={handleRetryConnection}
            className="tc-app-toast__retry"
            aria-label="Retry connection"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      )}
    </>
  );
}
