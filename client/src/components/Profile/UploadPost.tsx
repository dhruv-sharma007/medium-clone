import ToggleButton from "../ui/ToggleButton";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, FormEvent, MutableRefObject } from "react";

type UploadPostProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  imagePreview: string;
  handleChangePhotoClick: () => void;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  setTitle: (title: string) => void;
  isChecked: boolean;
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  content: string;
  setContent: (content: string) => void;
};

const UploadPost = ({
  onSubmit,
  imagePreview,
  handleChangePhotoClick,
  fileInputRef,
  handleFileSelect,
  title,
  setTitle,
  isChecked,
  handleCheckboxChange,
  content,
  setContent,
}: UploadPostProps) => {
  const navigate = useNavigate();

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 h-[92vh] flex justify-center items-center bg-gray-50"
    >
      <section className="w-full max-w-xl rounded-2xl shadow-2xl bg-white p-6 space-y-6">
        <div className="flex gap-6">
          <img
            src={imagePreview}
            onClick={handleChangePhotoClick}
            className="w-40 h-40 rounded-xl object-cover shadow cursor-pointer"
            alt="Post Thumbnail"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col justify-between w-full">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-b-2 text-xl font-semibold px-2 py-1 outline-none focus:border-blue-500 transition-all"
              placeholder="Enter Your Title"
              type="text"
              required
            />
            <div className="flex items-center justify-between mt-4 bg-gray-100 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700">Publish</p>
              <ToggleButton
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>

        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write your post content here..."
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:text-white transition-all"
          >
            Upload
          </button>
        </div>
      </section>
    </form>
  );
};

export default UploadPost;
