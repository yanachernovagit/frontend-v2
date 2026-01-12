"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
  videoUrl?: string | null;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
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

  return (
    <div
      className={`
        relative w-full h-full overflow-hidden
        ${!isReady ? loadingBackgroundClassName : ""}
        ${className}
      `}
    >
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
