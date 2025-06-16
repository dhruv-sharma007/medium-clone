import React, { useState } from "react";
import { useblog } from "../hooks";
import { useParams } from "react-router-dom";
import { RotateLoading } from "../components/Loading";

const Blog = () => {
  const { id } = useParams<{ id: string }>()
  const { blog, loading } = useblog(parseInt(id))


  console.log(blog)
  if (loading) return <RotateLoading />
  return <div>Blog</div>;
};

export default Blog;
