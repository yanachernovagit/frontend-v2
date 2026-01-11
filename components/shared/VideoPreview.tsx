"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  videoUrl?: string | null;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  posterUrl?: string;
  showPosterUntilReady?: boolean;
  loadingBackgroundClassName?: string;
  allowFullscreen?: boolean;
  isActive?: boolean;
  onReady?: () => void;
  onUnmount?: () => void;
};

export function VideoPreview({
  videoUrl,
  autoPlay = true,
  loop = true,
  muted = false,
  className = "",
  posterUrl,
  showPosterUntilReady = true,
  loadingBackgroundClassName = "bg-gray-100",
  allowFullscreen = false,
  isActive = true,
  onReady,
  onUnmount,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsReady(true);
      if (autoPlay && isActive) {
        video.play().catch(() => {});
      }
      onReady?.();
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [autoPlay, isActive, onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = loop;
    video.muted = muted;

    if (autoPlay && isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [autoPlay, isActive, loop, muted]);

  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        try {
          video.pause();
        } catch {}
      }
      onUnmount?.();
    };
  }, [onUnmount]);

  if (!videoUrl) return null;

  const showPoster = showPosterUntilReady && posterUrl && !isReady;

  return (
    <div
      className={`
        relative w-full h-full overflow-hidden
        ${!isReady ? loadingBackgroundClassName : ""}
        ${className}
      `}
    >
      {showPoster && (
        <Image
          src={posterUrl}
          alt="Video poster"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
        playsInline
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        preload="metadata"
        controlsList={allowFullscreen ? undefined : "nofullscreen"}
      />
    </div>
  );
}
