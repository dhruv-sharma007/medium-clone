import React from 'react'
import AppBar from '../components/AppBar';

const CreatePost = () => {
  return (
    <>
      <AppBar />
      <div className="flex justify-center items-center min-h-screen px-4">
        <form className="w-full max-w-xl space-y-4 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-center">Create Post</h2>

          <input
            type="text"
            name="title"
            placeholder="Enter your title"
            className="input input-bordered w-full"
          />

          <textarea
            name="content"
            placeholder="Enter your content"
            className="textarea textarea-bordered w-full min-h-[150px]"
          ></textarea>

          <button type="submit" className="btn btn-primary w-full">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost
