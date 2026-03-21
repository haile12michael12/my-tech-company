import { useState, useRef, useCallback } from "react";
import { Image, Upload, X, Crop } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/ui/image-crop-dialog";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
  aspectRatio?: "video" | "square" | "portrait";
  recommendedSize?: string;
  enableCrop?: boolean;
}

const aspectRatioValues = {
  video: 16 / 9,
  square: 1,
  portrait: 3 / 4,
};

const ImageUpload = ({
  value,
  onChange,
  className,
  aspectRatio = "video",
  recommendedSize = "1200x630px",
  enableCrop = true,
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (enableCrop) {
          setPendingImage(imageUrl);
          setShowCropDialog(true);
        } else {
          onChange(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange, enableCrop]
  );

  const handleCropComplete = useCallback(
    (croppedImageUrl: string) => {
      onChange(croppedImageUrl);
      setPendingImage(null);
    },
    [onChange]
  );

  const handleCropCancel = useCallback(() => {
    setShowCropDialog(false);
    setPendingImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  const handleEditCrop = useCallback(() => {
    if (value) {
      setPendingImage(value);
      setShowCropDialog(true);
    }
  }, [value]);

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  return (
    <>
      {value ? (
        <div className={cn("relative group", className)}>
          <div className={cn("relative overflow-hidden rounded-lg", aspectRatioClass)}>
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {enableCrop && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleEditCrop}
                >
                  <Crop className="w-4 h-4 mr-1" />
                  Crop
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      ) : (
        <div className={className}>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              aspectRatioClass,
              "flex flex-col items-center justify-center",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
          >
            <Image className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {isDragging ? "Drop image here" : "Drop an image here or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: {recommendedSize}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      <ImageCropDialog
        isOpen={showCropDialog}
        onClose={handleCropCancel}
        imageSrc={pendingImage || ""}
        onCropComplete={handleCropComplete}
        aspectRatio={enableCrop ? aspectRatioValues[aspectRatio] : undefined}
      />
    </>
  );
};

export { ImageUpload };
