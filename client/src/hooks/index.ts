import { useEffect, useState } from "react";
import { getBlog, getBlogs } from "../lib/api";

interface Author {
  id: number;
  name: string;
  username: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  author: Author;
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>();

  useEffect(() => {
    getBlogs().then((res) => {
      console.log(res.data)
      setBlogs(res.data.data);
    }).finally(() => {
      setLoading(false)
    })
  }, []);
  return {
    loading,
    blogs,
  };
};

export const useblog = (id: number) => {
  const [loading, setLoading] = useState(false)
  const [blog, setBlog] = useState<Blog>()

  useEffect(() => {
    getBlog(id).then((res) => {
      console.log(res.data)
      setBlog(res.data.data);
      setLoading(false);
    }).finally(() => {
      setLoading(false)
    })
  }, [id]);

  return {
    blog,
    loading
  }
}