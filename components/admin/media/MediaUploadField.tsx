"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { uploadAdminMedia } from "@/services/adminMediaService";

interface MediaUploadFieldProps {
  accept?: string;
  folder?: string;
  disabled?: boolean;
  onUploaded: (url: string) => void;
}

export function MediaUploadField({
  accept,
  folder,
  disabled,
  onUploaded,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const response = await uploadAdminMedia(file, { folder });
      onUploaded(response.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir el archivo",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        variant="outline_magent"
        onClick={handleSelectFile}
        disabled={disabled || uploading}
        className="h-10 px-4"
      >
        <UploadCloud className="w-4 h-4 mr-2" />
        {uploading ? "Subiendo..." : "Subir archivo"}
      </Button>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {!error && uploading && (
        <span className="text-xs text-gray-500">Procesando archivo...</span>
      )}
    </div>
  );
}
