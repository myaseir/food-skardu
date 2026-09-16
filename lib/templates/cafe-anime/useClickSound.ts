"use client";

import { useCallback } from "react";

// Cache Audio elements per src so replaying the same clip doesn't
// re-fetch the file each time.
const audioCache = new Map<string, HTMLAudioElement>();

function getOrCreateAudio(src: string): HTMLAudioElement {
  let audio = audioCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audioCache.set(src, audio);
  }
  return audio;
}

/**
 * Plays short anime-style sound clips by file path.
 * - Call play() with no argument to use `defaultSrc`.
 * - Call play("/sounds/items/ca-1.mp3") to override with a specific clip.
 * - If the given src fails to load or play (e.g. file doesn't exist yet,
 *   or is a bad URL), it automatically falls back to `defaultSrc` instead
 *   of staying silent.
 */
export function useClickSound(defaultSrc?: string) {
  const play = useCallback(
    (src?: string) => {
      const soundSrc = src ?? defaultSrc;
      if (!soundSrc) return;

      const audio = getOrCreateAudio(soundSrc);
      audio.currentTime = 0;

      audio.play().catch(() => {
        if (defaultSrc && soundSrc !== defaultSrc) {
          const fallback = getOrCreateAudio(defaultSrc);
          fallback.currentTime = 0;
          fallback.play().catch(() => {});
        }
      });
    },
    [defaultSrc]
  );

  return play;
}