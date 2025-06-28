import { useState, useEffect, useRef } from "react";
import {
  checkUsername,
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  getMeProfile,
} from "../lib/api";
import type { apiResponse, CreateBlogInput, IGetProfileResponse } from "@medium-clone/common";
import type { IUserProfile } from "../vite-env";

// --------- useBlogs ---------
const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<any>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBlogs()
      .then(res => {
        if (!cancelled) setBlogs(res.data.data);
      })
      .catch(err => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true };
  }, []);

  return { loading, blogs, error };
};

// --------- useBlog ---------
const useBlog = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBlog(id)
      .then(res => {
        if (!cancelled) setBlog(res.data.data);
      })
      .catch(err => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true };
  }, [id]);

  return { loading, blog, error };
};

// --------- usePostBlog ---------
const usePostBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<apiResponse | null>(null);

  const postBlog = async (data: CreateBlogInput) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await createBlog(data);
      setResponse(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, postBlog };
};

// --------- useDeleteBlog ---------
const useDeleteBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<apiResponse | null>(null);

  const deleteBlogHook = async (id: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await deleteBlog(id);
      setResponse(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, deleteBlogHook };
};

// --------- useGetProfile ---------
const useGetProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<IGetProfileResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMeProfile()
      .then(res => {
        if (!cancelled) setProfile(res.data.data);
      })
      .catch(err => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true };
  }, []);

  return { loading, error, profile };
};

// --------- useCheckUsername ---------
const useCheckUsername = (minLength = 3, debounceMs = 300) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const debounceRef = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSuccess(null);
    setMessage("");
    setError(null);

    window.clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (username.trim().length < minLength) {
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const ac = new AbortController();
      abortRef.current = ac;

      checkUsername(username, { signal: ac.signal })
        .then(res => {
          setSuccess(res.data.success);
          setMessage(res.data.message);
        })
        .catch(e => {
          if (e.name !== "AbortError") {
            setSuccess(false);
            setError(e);
            setMessage(e.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [username, minLength, debounceMs]);

  return { username, setUsername, loading, success, message, error };
};

// --------- Types ---------
export interface Author {
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

export {
  useBlogs,
  useBlog,
  usePostBlog,
  useDeleteBlog,
  useGetProfile,
  useCheckUsername,
}