"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { axiosClient } from "@/app/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (imageData: {
    url: string;
    thumbnailUrl: string;
    responsiveUrls: { [key: string]: string };
  }) => void;
  existingImage?: string;
}

export function ImageUpload({
  onImageUploaded,
  existingImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      const file = acceptedFiles[0];

      // Basic validation
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      // Create a local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Prepare form data
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axiosClient.post("/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(progress);
            }
          },
        });

        if (response.data && response.data.success) {
          const imageData = response.data.data;
          onImageUploaded({
            url: imageData.url,
            thumbnailUrl: imageData.thumbnailUrl,
            responsiveUrls: imageData.responsiveUrls,
          });
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image. Please try again.");
        setPreview(existingImage || null);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [onImageUploaded, existingImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const removeImage = useCallback(() => {
    setPreview(null);
    onImageUploaded({ url: "", thumbnailUrl: "", responsiveUrls: {} });
  }, [onImageUploaded]);

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-md overflow-hidden">
          <div className="aspect-video relative">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              style={{ aspectRatio: "16/9" }}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={removeImage}
              disabled={uploading}
              className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
              Remove
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              {...getRootProps()}
              disabled={uploading}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Change
              <input {...getInputProps()} />
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center hover:bg-accent transition-colors cursor-pointer `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <div>
                <p>Drag & drop an image here, or click to select</p>
                <p className="text-sm mt-1">
                  (Supported formats: JPG, PNG, WebP. Max size: 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
