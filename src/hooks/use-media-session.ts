import { useEffect } from "react";

interface AudioRefLike {
  play: () => void | Promise<void>;
  pause: () => void | Promise<void>;
  seek: (time: number) => void | Promise<void>;
  nextTrack?: () => void | Promise<void>;
  previousTrack?: () => void | Promise<void>;
}

interface UseMediaSessionProps {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
  artworkType?: string;
  artworkSizes?: string;
  audioRef: AudioRefLike;
  shouldBeNull?: boolean;
}

export function useMediaSession({
  title,
  artist,
  album,
  artwork,
  artworkType = "image/png",
  artworkSizes = "1024x1024",
  audioRef,
  shouldBeNull = false,
}: UseMediaSessionProps) {
  useEffect(() => {
    if ("mediaSession" in navigator && navigator.mediaSession) {
      if (shouldBeNull) {
        navigator.mediaSession.metadata = null;
        return;
      }

      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album,
          artwork: artwork
            ? [{ src: artwork, sizes: artworkSizes, type: artworkType }]
            : undefined,
        });

        navigator.mediaSession.setActionHandler("play", audioRef.play);
        navigator.mediaSession.setActionHandler("pause", audioRef.pause);
        navigator.mediaSession.setActionHandler("seekto", (details) => {
          if (details.seekTime) audioRef.seek(details.seekTime);
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          audioRef.nextTrack?.();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          audioRef.previousTrack?.();
        });
      } catch (e) {
        console.log("mediaSession Error: ", e);
      }

      // Clean up action handlers when component unmounts or dependencies change
      return () => {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekto", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      };
    }
  }, [
    title,
    artist,
    album,
    artwork,
    artworkType,
    artworkSizes,
    audioRef,
    shouldBeNull,
  ]);
}
