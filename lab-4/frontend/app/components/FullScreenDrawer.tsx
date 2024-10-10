"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Image } from "@nextui-org/image";
import ImageUploader from "./UploadImage";
import { useAxiosAuth } from "@/libs/axios";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { cn } from "@nextui-org/theme";
import { BiSave } from "react-icons/bi";
import { toast } from "react-toastify";

type FullScreenDrawerProps = {
  setBackgroundImage: (url: string) => void;
  idBackground: string;
};

const FullScreenDrawer = (props: FullScreenDrawerProps) => {
  const { setBackgroundImage, idBackground } = props;
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [randomKey, setRandomKey] = useState(0);
  const axiosAuth = useAxiosAuth();
  const [chooseImage, setChooseImage] = useState(idBackground);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setRandomKey(Math.random());
  };

  const onSaveBackground = () => {
    saveBackground({ imageBackgroundId: chooseImage });
  };

  const {
    mutate: getListImage,
    isPending,
    data: listImage,
  } = useMutation({
    mutationFn: async () => {
      const result = axiosAuth.get("/image-backgrounds");

      return (await result).data;
    },
  });

  const { mutate: saveBackground, isPending: isPendingSave } = useMutation({
    mutationFn: async (data: { imageBackgroundId: string }) => {
      const result = axiosAuth.patch("/users/update-image-background", data);

      return (await result).data;
    },
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Save background success");
    },
  });

  useEffect(() => {
    if (isOpen) {
      getListImage();
    }
  }, [getListImage, isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleDrawer}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
        aria-label="Open drawer"
      >
        <FiMenu className="mr-2" />
        Edit Background
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pb-[60px] h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              List background
            </h2>
            <button
              onClick={toggleDrawer}
              className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-2 transition-colors duration-200"
              aria-label="Close drawer"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="animate-fade-in-up delay-200">
              <ImageUploader key={randomKey} getListImage={getListImage} />

              {isPending ? (
                <div className="w-full flex justify-center mt-6">
                  <Spinner />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                  {listImage?.map((image: { id: string; url: string }) => (
                    <div
                      key={image?.id}
                      className={cn("cursor-pointer")}
                      onClick={() => {
                        setChooseImage(image?.id);
                        setBackgroundImage(image?.url);
                      }}
                    >
                      <Image
                        key={image?.id}
                        width="100%"
                        height={108}
                        alt={image?.id}
                        src={image?.url}
                        className={cn(
                          chooseImage === image?.id &&
                            "border-3 border-blue-500 rounded-xl"
                        )}
                        classNames={{
                          img: "object-cover rounded-xl",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 z-30 bg-white w-full border-t border-gray-300 p-4 flex justify-end">
          <button
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 min-w-[182px] min-h-10"
            aria-label="Open drawer"
            disabled={isPendingSave}
            onClick={onSaveBackground}
          >
            {isPendingSave ? (
              <Spinner color="white" size="sm" />
            ) : (
              <div className="flex justify-center items-center">
                <BiSave className="mr-2" />
                Save background
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenDrawer;
