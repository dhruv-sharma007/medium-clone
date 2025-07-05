import { useState, useEffect, useRef } from "react";
import {
  checkUsername,
  createBlog,
  deleteBlog,
  deleteFollow,
  getAuthor,
  getBlog,
  getBlogs,
  getMeProfile,
} from "../lib/api";
import type {
  apiResponse,
  CreateBlogInput,
  IGetProfileResponse,
} from "@medium-clone/common";
import { createFollow } from "../lib/api";
import type { IGetProfileResp, POST } from "../vite-env";

// --------- useBlogs ---------
const useBlogs = (page: number | undefined) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<{ posts: POST[]; totalPosts: number }>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getBlogs(page)
      .then((res) => {
        // console.log(res);

        if (!cancelled) setBlogs(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

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
      .then((res) => {
        if (!cancelled) setBlog(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
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
  const [profile, setProfile] = useState<IGetProfileResp>();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMeProfile()
      .then((res) => {
        if (!cancelled) setProfile(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, error, profile };
};

// --------- useCheckUsername ---------
const useCheckUsername = (minLength = 4, debounceMs = 400) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null);

  const debounceRef = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSuccess(true);
    setMessage("");
    setError(null);
    window.clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (username.trim().length < minLength) {
      setLoading(false);
      setSuccess(false);
      setMessage(`Username must be at least ${minLength} characters`);
      return;
    }

    const hasInvalidChars = /[^a-z0-9_]/.test(username.trim()); // also ensures lowercase
    if (hasInvalidChars) {
      setSuccess(false);
      setMessage(
        "Username must only contain lowercase letters, numbers, or underscores",
      );
      return;
    }

    if (username.trim() !== username) {
      setSuccess(false);
      setMessage("Username cannot have leading or trailing spaces");
      return;
    }
    setMessage("");

    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const ac = new AbortController();
      abortRef.current = ac;

      checkUsername(username.trim(), { signal: ac.signal })
        .then((res) => {
          setSuccess(res.data.success);
          setMessage(res.data.message);
        })
        .catch((e) => {
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

const useGetAuthor = (id: string | undefined) => {
  const [loading, setLoading] = useState<boolean>();
  const [author, setAuthor] = useState<IGetProfileResp>();
  const [error, setError] = useState<Error | null>(null);
  // const [type, setType] = useState<"signing" | "signup" >(null)

  useEffect(() => {
    setLoading(true);
    getAuthor(id || "")
      .then((res) => {
        console.log(res.data);

        setAuthor(res.data.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [id]);
  return { loading, author, error };
};

const useFollow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<apiResponse | null>(null);

  const createFollowHook = async (authorId: string | undefined) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await createFollow(authorId || "");
      setResponse(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFollowHook = async (authorId: string | undefined) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await deleteFollow(authorId || "");
      setResponse(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, response, createFollowHook, deleteFollowHook };
};

export {
  useBlogs,
  useBlog,
  usePostBlog,
  useDeleteBlog,
  useGetProfile,
  useCheckUsername,
  useGetAuthor,
  useFollow,
};
