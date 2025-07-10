import UploadPost from "../components/Profile/UploadPost";
import React, { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { createBlog } from "../lib/api";
import { useAuthStore } from "../store/auth";

const CreatePost = () => {
  const defaultImage =
    "https://www.eligocs.com/_next/static/media/empty.828db9a9.jpg";
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const { user } = useAuthStore();

  const fileToBase64 = async (file: File): Promise<string> => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    });
    return await imageCompression.getDataUrlFromFile(compressedFile);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImagePreview(base64);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imagePreview === defaultImage) return alert("Please Choose an image.");

    const postData = {
      title,
      content,
      featuredImg: imageBase64,
      isPublished: isChecked,
    };

    try {
      const res = await createBlog(postData);

      // const result = ;

      navigate(`/profile/${user?.username}`);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <UploadPost
        content={content}
        fileInputRef={fileInputRef}
        handleChangePhotoClick={handleChangePhotoClick}
        handleCheckboxChange={handleCheckboxChange}
        handleFileSelect={handleFileSelect}
        imagePreview={imagePreview}
        isChecked={isChecked}
        onSubmit={onSubmit}
        setContent={setContent}
        setTitle={setTitle}
        title={title}
      />
    </>
  );
};

export default CreatePost;
