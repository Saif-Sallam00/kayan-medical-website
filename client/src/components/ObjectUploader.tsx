// From blueprint: javascript_object_storage
import { useState } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  children?: ReactNode;
}

/**
 * File upload component for uploading images to object storage
 * 
 * Features:
 * - Opens modal interface for file selection and preview
 * - Upload progress tracking
 * - Supports drag-and-drop
 * 
 * @param props.maxNumberOfFiles - Maximum files allowed (default: 1)
 * @param props.maxFileSize - Maximum file size in bytes (default: 10MB)
 * @param props.onGetUploadParameters - Function to get presigned URL from backend
 * @param props.onComplete - Callback when upload completes
 * @param props.buttonClassName - Optional CSS class for button
 * @param props.buttonVariant - Button variant (default: "outline")
 * @param props.children - Custom button content (default: upload icon + text)
 */
export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  buttonVariant = "outline",
  children,
}: ObjectUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles,
        maxFileSize,
        allowedFileTypes: ['image/*'], // Only allow images
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: onGetUploadParameters,
      })
      .on("complete", (result) => {
        onComplete?.(result);
        setShowModal(false); // Close modal after successful upload
      })
  );

  return (
    <>
      <Button 
        type="button"
        variant={buttonVariant}
        onClick={() => setShowModal(true)} 
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl">
          <Dashboard
            uppy={uppy}
            proudlyDisplayPoweredByUppy={false}
            locale={{
              strings: {
                browse: 'تصفح',
                dropHereOr: 'اسحب الملفات هنا أو %{browse}',
                uploadXFiles: {
                  0: 'رفع %{smart_count} ملف',
                  1: 'رفع %{smart_count} ملف',
                  2: 'رفع %{smart_count} ملفات',
                },
                uploadXNewFiles: {
                  0: 'رفع +%{smart_count} ملف',
                  1: 'رفع +%{smart_count} ملف',
                  2: 'رفع +%{smart_count} ملفات',
                },
                uploading: 'جاري الرفع',
                complete: 'اكتمل',
                uploadFailed: 'فشل الرفع',
                paused: 'متوقف',
                retry: 'إعادة المحاولة',
                cancel: 'إلغاء',
                pauseUpload: 'إيقاف الرفع',
                resumeUpload: 'استئناف الرفع',
                cancelUpload: 'إلغاء الرفع',
                filesUploadedOfTotal: {
                  0: '%{complete} من %{smart_count} ملف تم رفعه',
                  1: '%{complete} من %{smart_count} ملف تم رفعه',
                  2: '%{complete} من %{smart_count} ملفات تم رفعها',
                },
                dataUploadedOfTotal: '%{complete} من %{total}',
                xTimeLeft: '%{time} متبقي',
                uploadComplete: 'اكتمل الرفع',
                selectFileNamed: 'اختر الملف %{name}',
                unselectFileNamed: 'إلغاء اختيار الملف %{name}',
                removeFile: 'إزالة الملف %{file}',
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
