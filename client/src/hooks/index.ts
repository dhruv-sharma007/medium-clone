import { useEffect, useState } from "react";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  getMeProfile,
} from "../lib/api";
import type { apiResponse, CreateBlogInput } from "@medium-clone/common";
import type { IUserProfile } from "../vite-env";

interface Author {
  id: number;
  name: string;
  username: string;
}

export interface IBlog {
  id: number;
  title: string;
  content: string;
  user: Author;
}

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<IBlog[]>();

  useEffect(() => {
    getBlogs()
      .then((res) => {
        console.log(res.data);
        setBlogs(res.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return {
    loading,
    blogs,
  };
};

export const useBlog = (id: number) => {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<IBlog>();

  useEffect(() => {
    getBlog(id)
      .then((res) => {
        console.log(res.data);
        setBlog(res.data.data);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return {
    blog,
    loading,
  };
};

export const usePostBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>();
  const [response, setResponse] = useState<apiResponse>();

  const postBlog = async (data: CreateBlogInput) => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await createBlog(data);
      setResponse(res.data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    postBlog,
    response,
  };
};

export const useGetProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<IUserProfile>();

  useEffect(() => {
    try {
      setLoading(true);
      getMeProfile().then((res) => {
        setResponse(res.data);
      });
      setLoading(false);
    } catch (error) {
      setError(error as Error);
    }
  }, []);

  return {
    loading,
    error,
    response,
  };
};

export const useDeleteBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [response, setResponse] = useState<apiResponse>();

  const deleteBlogHook = async (id: number) => {
    try {
      setLoading(true);
      const res = await deleteBlog(id);
      setResponse(res.data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    response,
    deleteBlogHook,
  };
};

