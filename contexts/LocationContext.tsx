"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  /** True once we've asked the browser whether permission is already
   *  granted/denied (via the Permissions API) — lets the gate decide
   *  whether it needs to show at all before flashing anything. */
  permissionChecked: boolean;
  /** Must be called from inside a user gesture (onClick/onTap) the FIRST
   *  time — mobile browsers (Safari/iOS especially) silently ignore
   *  geolocation requests fired from useEffect on page load. Once
   *  permission is already granted, this can be (and is) called
   *  automatically without a tap. */
  requestLocation: () => void;
};

const LocationContext = createContext<LocationContextValue>({
  location: null,
  status: "idle",
  permissionChecked: false,
  requestLocation: () => {},
});

// Persisted (not session-only) — once we have a fix we keep showing it
// immediately on future visits while watchPosition catches up with a
// fresh one in the background.
const STORAGE_KEY = "mb_user_location";

function readCache(): UserLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { latitude: number; longitude: number };
    return { latitude: parsed.latitude, longitude: parsed.longitude };
  } catch {
    return null;
  }
}

function writeCache(loc: { latitude: number; longitude: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // localStorage unavailable (private mode etc.) — silently skip caching
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [permissionChecked, setPermissionChecked] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  function startWatching() {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }

    // Only one active watch at a time.
    if (watchIdRef.current !== null) return;

    setStatus("loading");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setLocation(loc);
        setStatus("granted");
        writeCache(loc);
      },
      () => {
        // Denied, timed out, or GPS unavailable — fail silently.
        // The rest of the app just falls back to manual area selection.
        setStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // accept a position up to 1 min old between updates
      }
    );
  }

  function requestLocation() {
    startWatching();
  }

  useEffect(() => {
    // Show any previously-saved fix immediately, so forms have something
    // to work with even before a fresh GPS reading comes in.
    const cached = readCache();
    if (cached) setLocation(cached);

    // If the browser already knows permission was granted (or denied) in a
    // past visit, we can act on that without waiting for a tap — the "ask
    // via gesture" rule only applies to the actual *prompt*, not to reusing
    // a decision the user already made.
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "granted") {
            startWatching();
          } else if (result.state === "denied") {
            setStatus("denied");
          }
          setPermissionChecked(true);

          // React live if the person changes the permission in their
          // browser/OS settings while the tab is open.
          result.onchange = () => {
            if (result.state === "granted") {
              startWatching();
            } else if (result.state === "denied") {
              if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
              }
              setStatus("denied");
            }
          };
        })
        .catch(() => {
          // Permissions API present but geolocation query unsupported
          // (rare) — fall back to letting the gate ask normally.
          setPermissionChecked(true);
        });
    } else {
      // Safari and older browsers don't support navigator.permissions for
      // geolocation — we simply won't know in advance and the gate will ask.
      setPermissionChecked(true);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider
      value={{ location, status, permissionChecked, requestLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useUserLocation() {
  return useContext(LocationContext);
}