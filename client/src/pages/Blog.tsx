import React, { useEffect, useState } from "react";
import { type IBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { RotateLoading } from "../components/Loading";
import { getBlog } from "../lib/api";
import AppBar from "../components/AppBar";

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false); // start with loading true
  const [blog, setBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getBlog(parseInt(id))
      .then((res) => {
        setBlog(res.data.data);
        console.log(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // if (loading) return <RotateLoading />;
  // if (!blog) return <div>Blog not found</div>;

  return (
    <>
      <AppBar />
      {loading ? (
        <RotateLoading />
      ) : (
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">{blog?.title}</h1>
          <p className="text-gray-400 mb-2">By ~{blog?.author.name}</p>
          <p className="text-lg">{blog?.content}</p>
        </div>
      )}
    </>
  );
};
export default Blog;
