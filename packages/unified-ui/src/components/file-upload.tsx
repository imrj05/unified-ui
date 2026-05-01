"use client";

import { slideUpSm, staggerContainerFast } from "@unified-ui/motion";
import { cn } from "@unified-ui/utils/cn";
import { focusRingClasses } from "@unified-ui/utils/focus-ring";
import { cva } from "class-variance-authority";
// ============================================================================
// Unified UI — FileUpload Component
// ============================================================================
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  type ChangeEvent,
  type DragEvent,
  forwardRef,
  type ReactNode,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

export const fileUploadZoneVariants = cva(
  [
    "relative flex flex-col items-center justify-center gap-3",
    "w-full rounded-lg border-2 border-dashed",
    "text-center",
    "transition-colors duration-fast",
    "cursor-pointer select-none outline-none",
    focusRingClasses,
  ],
  {
    variants: {
      size: {
        sm: "p-6 min-h-[120px]",
        md: "p-8 min-h-[160px]",
        lg: "p-10 min-h-[200px]",
      },
      state: {
        idle: "border-border hover:border-primary/50 hover:bg-accent/40",
        dragOver: "border-primary bg-primary/8",
        error: "border-danger bg-danger-muted",
        disabled:
          "border-border opacity-50 cursor-not-allowed pointer-events-none",
      },
    },
    defaultVariants: { size: "md", state: "idle" },
  },
);

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function ImageFileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export type FileUploadSize = "sm" | "md" | "lg";

export interface FileUploadItem {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
  status: "idle" | "uploading" | "success" | "error";
}

export interface FileUploadProps {
  onFilesChange?: (files: FileUploadItem[]) => void;
  onFileAdd?: (file: File) => void;
  onFileRemove?: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  size?: FileUploadSize;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload(
    {
      onFilesChange,
      onFileAdd,
      onFileRemove,
      accept,
      multiple = true,
      maxFiles = 10,
      maxSize,
      size = "md",
      disabled = false,
      label,
      description,
      className,
      "aria-label": ariaLabel = "File upload",
    },
    ref,
  ) {
    const shouldReduce = useReducedMotion();
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState<FileUploadItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback(
      (newFiles: File[]) => {
        setError(null);
        const allowed = newFiles.slice(0, maxFiles - files.length);
        const rejected: string[] = [];

        const items: FileUploadItem[] = [];
        for (const file of allowed) {
          if (maxSize && file.size > maxSize) {
            rejected.push(`"${file.name}" exceeds ${formatFileSize(maxSize)}`);
            continue;
          }
          const isImage = file.type.startsWith("image/");
          const preview = isImage ? URL.createObjectURL(file) : undefined;
          items.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            preview,
            progress: 0,
            status: "idle",
          });
          onFileAdd?.(file);
        }

        if (rejected.length > 0) {
          setError(rejected.join(", "));
        }

        const next = [...files, ...items];
        setFiles(next);
        onFilesChange?.(next);
      },
      [files, maxFiles, maxSize, onFileAdd, onFilesChange],
    );

    const removeFile = useCallback(
      (itemId: string) => {
        const item = files.find((f) => f.id === itemId);
        if (item?.preview) URL.revokeObjectURL(item.preview);
        const next = files.filter((f) => f.id !== itemId);
        setFiles(next);
        onFileRemove?.(itemId);
        onFilesChange?.(next);
      },
      [files, onFileRemove, onFilesChange],
    );

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
        e.target.value = "";
      }
    };

    const handleZoneClick = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleZoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleZoneClick();
      }
    };

    const zoneState = disabled
      ? "disabled"
      : isDragOver
        ? "dragOver"
        : error
          ? "error"
          : "idle";

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3 w-full", className)}
        data-ds=""
        data-ds-component="file-upload"
        data-ds-size={size}
      >
        {/* Drop zone */}
        <div
          role="region"
          aria-label={ariaLabel}
          tabIndex={disabled ? -1 : 0}
          className={cn(fileUploadZoneVariants({ size, state: zoneState }))}
          onClick={handleZoneClick}
          onKeyDown={handleZoneKeyDown}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-ds-drag-over={isDragOver ? "" : undefined}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
            className="sr-only"
            aria-hidden="true"
            id={`${id}-input`}
            tabIndex={-1}
          />

          <motion.div
            animate={
              isDragOver && !shouldReduce ? { scale: 1.1 } : { scale: 1 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            data-ds-animated=""
          >
            <UploadIcon
              className={cn(
                "text-muted-foreground",
                size === "sm"
                  ? "size-8"
                  : size === "md"
                    ? "size-10"
                    : "size-12",
                isDragOver && "text-primary",
              )}
            />
          </motion.div>

          <div className="flex flex-col gap-1 text-center">
            <p
              className={cn(
                "font-medium text-foreground",
                size === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {label ?? (
                <>
                  <span className="text-primary underline-offset-2 hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </>
              )}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {accept && !description && (
              <p className="text-xs text-muted-foreground">
                {accept}
                {maxSize ? ` · max ${formatFileSize(maxSize)}` : ""}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-danger">
              <AlertCircleIcon className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* File list */}
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.div
              className="flex flex-col gap-2"
              variants={
                shouldReduce ? undefined : staggerContainerFast.variants
              }
              initial={shouldReduce ? undefined : "initial"}
              animate={shouldReduce ? undefined : "animate"}
              data-ds-animated=""
            >
              {files.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={shouldReduce ? undefined : slideUpSm.variants}
                  initial={shouldReduce ? { opacity: 0 } : "initial"}
                  animate={shouldReduce ? { opacity: 1 } : "animate"}
                  exit={
                    shouldReduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.95,
                          transition: { duration: 0.15 },
                        }
                  }
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border border-border bg-background",
                    item.status === "error" &&
                      "border-danger/40 bg-danger-muted",
                    item.status === "success" && "border-success/40",
                  )}
                  data-ds-animated=""
                >
                  {/* Thumbnail / icon */}
                  <div className="shrink-0 size-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : item.file.type.startsWith("image/") ? (
                      <ImageFileIcon className="size-5 text-muted-foreground" />
                    ) : (
                      <FileIcon className="size-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(item.file.size)}
                      {item.status === "error" && item.error && (
                        <span className="text-danger ml-1">— {item.error}</span>
                      )}
                    </p>

                    {/* Progress bar */}
                    {item.status === "uploading" &&
                      item.progress !== undefined && (
                        <div
                          className="mt-1.5 w-full h-1 bg-muted rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={item.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Upload progress: ${item.progress}%`}
                        >
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            data-ds-animated=""
                          />
                        </div>
                      )}
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className={cn(
                      "shrink-0 inline-flex items-center justify-center size-7 rounded-md",
                      "text-muted-foreground hover:text-foreground hover:bg-accent",
                      "transition-colors duration-fast",
                      focusRingClasses,
                    )}
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <XIcon className="size-4" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";
