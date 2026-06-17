"use client";

import { UploadCloud } from "lucide-react";
import { useActionState, useRef, useState, type ChangeEvent, type DragEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { uploadSkill, type UploadState } from "./actions";

const initialState: UploadState = {};

export function UploadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [state, formAction, isPending] = useActionState(uploadSkill, initialState);

  function selectFiles(files: FileList | null) {
    setFileName(files && files.length > 0 ? files[0].name : null);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    selectFiles(event.target.files);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (inputRef.current && event.dataTransfer.files.length > 0) {
      // Mirror the dropped file into the input so it posts with the form.
      inputRef.current.files = event.dataTransfer.files;
      selectFiles(event.dataTransfer.files);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-muted/40 p-6 text-center transition-colors focus-within:border-primary hover:bg-muted/60",
          isDragging && "border-primary bg-primary/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept=".zip,application/zip"
          className="sr-only"
          onChange={handleChange}
        />
        <UploadCloud className="size-8 text-muted-foreground" aria-hidden />
        <span className="font-medium">{fileName ?? "Drag a .zip here, or click to choose"}</span>
        <span className="text-sm text-muted-foreground">
          A zip containing one or more <code>skills/&lt;name&gt;/SKILL.md</code> folders, up to 10
          MB.
        </span>
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={!fileName || isPending}>
          {isPending ? "Uploading…" : "Upload skill"}
        </Button>
      </div>
    </form>
  );
}
