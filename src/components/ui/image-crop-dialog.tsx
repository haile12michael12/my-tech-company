import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ImageCropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale: number = 1
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();

  ctx.translate(-cropX, -cropY);

  ctx.translate(image.naturalWidth / 2, image.naturalHeight / 2);
  ctx.scale(scale, scale);
  ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return canvas.toDataURL("image/jpeg", 0.9);
}

const ImageCropDialog = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const initialCrop = aspectRatio
        ? centerAspectCrop(width, height, aspectRatio)
        : {
            unit: "%" as const,
            x: 5,
            y: 5,
            width: 90,
            height: 90,
          };
      setCrop(initialCrop);
    },
    [aspectRatio]
  );

  const handleApply = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        completedCrop,
        scale
      );
      onCropComplete(croppedImageUrl);
      onClose();
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  }, [completedCrop, scale, onCropComplete, onClose]);

  const handleCancel = useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop & Resize Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Crop Area */}
          <div className="flex justify-center bg-muted/30 rounded-lg p-4 max-h-[400px] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "center",
                  maxHeight: "350px",
                  width: "auto",
                }}
              />
            </ReactCrop>
          </div>

          {/* Scale Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Zoom: {Math.round(scale * 100)}%</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setScale(1)}
                className="text-xs"
              >
                Reset
              </Button>
            </div>
            <Slider
              value={[scale]}
              onValueChange={([value]) => setScale(value)}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!completedCrop}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ImageCropDialog };
