"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Network } from "@capacitor/network";
import { App } from "@capacitor/app";
import { WifiOff } from "lucide-react";

export function MobileAppProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const initStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0f172a" });
      } catch (err) {
        console.warn("[MobileAppProvider] StatusBar error:", err);
      }
    };
    initStatusBar();

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
          if (canGoBack) {
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

  return (
    <>
      {children}
      {isOffline && (
        <div className="tc-app-toast">
          <WifiOff className="tc-app-toast__icon" />
          <span>Offline - Showing cached content</span>
        </div>
      )}
    </>
  );
}
