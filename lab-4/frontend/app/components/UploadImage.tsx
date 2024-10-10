"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { Image } from "@nextui-org/image";
import { useMutation } from "@tanstack/react-query";
import { useAxiosAuth } from "@/libs/axios";
import { BiUpload } from "react-icons/bi";
import { Spinner } from "@nextui-org/spinner";

type ImageUploaderProps = {
  getListImage: () => void;
};

const ImageUploader = (props: ImageUploaderProps) => {
  const { getListImage } = props;
  const axiosAuth = useAxiosAuth();

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif"],
    },
    multiple: false,
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
  };

  const uploadImage = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("No file selected");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    uploadBackground(formData);
  };

  const { mutate: uploadBackground, isPending: isUpload } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = axiosAuth.post("/image-backgrounds", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return (await result).data;
    },
    onSuccess: (data) => {
      getListImage();
      setPreview(null);
      setError(null);
      console.log("🚀 ~ ImageUploader ~ data:", data);
    },
  });

  return (
    <div className="max-w-md mx-auto mb-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${preview ? "bg-gray-100" : ""}`}
      >
        <input {...getInputProps()} ref={fileInputRef} className="hidden" />
        <AnimatePresence>
          {!preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag & Drop your image here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to select a file
              </p>
              <button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Choose Image
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              <Image
                src={typeof preview === "string" ? preview : undefined}
                alt="Preview"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute z-10 top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition duration-300 ease-in-out"
                aria-label="Remove image"
              >
                <FiX className="text-gray-600" />
              </button>
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-2 "
                  onClick={uploadImage}
                  disabled={isUpload}
                >
                  {isUpload ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    <div className="flex justify-center items-center">
                      <BiUpload className="mr-2" />
                      Upload Image
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            role="alert"
          >
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
