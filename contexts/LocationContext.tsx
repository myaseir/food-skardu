"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

type LocationContextValue = {
  location: UserLocation;
  status: LocationStatus;
  /** Call this again later if you ever need a fresher fix (e.g. right before submit). */
  refresh: () => void;
};

const LocationContext = createContext<LocationContextValue>({
  location: null,
  status: "idle",
  refresh: () => {},
});

const STORAGE_KEY = "mb_user_location";
const STORAGE_TTL_MS = 15 * 60 * 1000; // 15 min — re-ask silently after this so the fix doesn't go stale

function readCache(): UserLocation {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { latitude: number; longitude: number; ts: number };
    if (Date.now() - parsed.ts > STORAGE_TTL_MS) return null;
    return { latitude: parsed.latitude, longitude: parsed.longitude };
  } catch {
    return null;
  }
}

function writeCache(loc: { latitude: number; longitude: number }) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loc, ts: Date.now() }));
  } catch {
    // sessionStorage unavailable (private mode etc.) — silently skip caching
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  function requestLocation() {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    // Serve a cached fix instantly if we have one — avoids re-prompting the
    // GPS chip on every page and makes checkout feel instant.
    const cached = readCache();
    if (cached) {
      setLocation(cached);
      setStatus("granted");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setLocation(loc);
        setStatus("granted");
        writeCache(loc);
      },
      () => {
        // User denied, timed out, or GPS unavailable — fail silently.
        // The rest of the app just falls back to manual area selection.
        setStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000, // accept a position the OS already has from the last 5 min
      }
    );
  }

  // Fire once, as early as possible, the moment the app mounts.
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider value={{ location, status, refresh: requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useUserLocation() {
  return useContext(LocationContext);
}