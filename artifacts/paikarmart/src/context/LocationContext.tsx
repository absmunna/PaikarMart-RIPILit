import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface UserLocation {
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  source: "auto" | "manual" | "none";
  updatedAt: string;
}

interface LocationCtx {
  location: UserLocation;
  detect: () => Promise<void>;
  setManual: (city: string, country?: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "pm.location.v1";
const LocationContext = createContext<LocationCtx | null>(null);

const NONE: UserLocation = { source: "none", updatedAt: new Date(0).toISOString() };

function readStored(): UserLocation {
  if (typeof window === "undefined") return NONE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserLocation) : NONE;
  } catch {
    return NONE;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(() => readStored());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (location.source === "none") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch {}
  }, [location]);

  const detect = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            source: "auto",
            updatedAt: new Date().toISOString(),
          });
          resolve();
        },
        () => resolve(),
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60_000 },
      );
    });
  }, []);

  const setManual = useCallback((city: string, country?: string) => {
    setLocation({ city, country, source: "manual", updatedAt: new Date().toISOString() });
  }, []);

  const clear = useCallback(() => setLocation(NONE), []);

  const value = useMemo<LocationCtx>(() => ({
    location, detect, setManual, clear,
  }), [location, detect, setManual, clear]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useUserLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useUserLocation must be used inside <LocationProvider>");
  return ctx;
}
