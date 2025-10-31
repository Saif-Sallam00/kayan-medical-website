// Simple file uploader for object storage
import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{ method: "PUT"; url: string }>;
  onComplete: (result: { successful: Array<{ uploadURL: string }> }) => void | Promise<void>;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  children?: ReactNode;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  buttonVariant = "outline",
  children,
}: ObjectUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxFileSize && file.size > maxFileSize) {
      alert(`الملف كبير جداً. الحد الأقصى هو ${(maxFileSize / 1024 / 1024).toFixed(1)} ميجابايت`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("يجب اختيار صورة فقط");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { method, url } = await onGetUploadParameters();
      
      const response = await fetch(url, {
        method,
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error("فشل رفع الصورة");
      }

      await onComplete({ successful: [{ uploadURL: url }] });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("حدث خطأ أثناء رفع الصورة");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload-input"
      />
      
      {!selectedFile ? (
        <Button
          type="button"
          variant={buttonVariant}
          onClick={() => fileInputRef.current?.click()}
          className={buttonClassName}
          data-testid="button-upload-image"
        >
          {children || (
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>رفع صورة</span>
            </div>
          )}
        </Button>
      ) : (
        <Card className="p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 truncate text-sm">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-muted-foreground text-xs">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "جاري الرفع..." : "رفع"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
