"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, X, AlertCircle, Check, Play } from "lucide-react";

interface VideoUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function VideoUploader({
  label = "URL de video",
  value,
  onChange,
  placeholder = "https://...",
}: VideoUploaderProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateVideoUrl = async (url: string) => {
    if (!url) {
      setIsValid(null);
      setError(null);
      return;
    }

    try {
      new URL(url);
    } catch {
      setIsValid(false);
      setError("URL inválida");
      return;
    }

    setIsValidating(true);
    setError(null);

    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      setIsValid(true);
      setIsValidating(false);
    };
    video.onerror = () => {
      setIsValid(false);
      setError("No se pudo cargar el video");
      setIsValidating(false);
    };
    video.src = url;
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    validateVideoUrl(newValue);
  };

  const handleClear = () => {
    onChange("");
    setIsValid(null);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 bg-gradient-to-b from-purple to-magent rounded-full" />
        <span className="text-sm font-bold text-black-400 uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div className="relative">
        <Input
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          placeholder={placeholder}
          className="pr-20 border-2 border-purple/15 focus:border-purple rounded-xl"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isValidating && (
            <div className="w-4 h-4 border-2 border-purple border-t-transparent rounded-full animate-spin" />
          )}
          {!isValidating && isValid === true && (
            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-500" />
            </div>
          )}
          {!isValidating && isValid === false && (
            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-red-500" />
            </div>
          )}
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClear}
              className="h-7 w-7 hover:bg-red-500/10"
            >
              <X className="w-3 h-3 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-500 font-medium px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      <div className="relative group">
        {value && isValid ? (
          <div className="relative border-2 border-purple/15 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple/5 to-magent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />
            <video
              src={value}
              controls
              className="w-full h-56 object-cover relative z-10"
              onError={() => {
                setIsValid(false);
                setError("Error al cargar el video");
              }}
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-2 z-30">
              <Play className="w-3 h-3 text-white" />
              <span className="text-xs text-white font-medium">
                Video cargado
              </span>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-purple/20 rounded-2xl h-56 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple/3 to-magent/5 transition-all duration-300 hover:border-purple/40 hover:bg-purple/5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-magent/20 blur-xl rounded-full" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple/10 to-magent/10 border-2 border-purple/20 flex items-center justify-center">
                <Video className="w-8 h-8 text-purple/60" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-black-400">Sin video</p>
              <p className="text-xs text-black-200 font-medium max-w-xs">
                Ingresa una URL válida para ver la vista previa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
