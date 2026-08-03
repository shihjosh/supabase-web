"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ImageUploaderProps = {
  onUploaded: (markdownSnippet: string) => void;
};

const ACCEPTED_TYPES = ["image/webp", "image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_SIZE_MB = 8;

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("僅支援 webp / jpg / png / gif 圖片格式");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`檔案過大，請小於 ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "webp";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      const altText = file.name.replace(/\.[^/.]+$/, "");
      onUploaded(`![${altText}](${data.publicUrl})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/webp,image/jpeg,image/jpg,image/png,image/gif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="image-upload-input"
        />
        <label
          htmlFor="image-upload-input"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/30"
        >
          {uploading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              上傳中...
            </>
          ) : (
            <>🖼 上傳圖片</>
          )}
        </label>
        <span className="text-xs text-slate-500">
          支援 webp / jpg / png / gif，上傳後自動插入內容
        </span>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
