import { useState, useEffect, useRef } from "react";
import {
  changePublish,
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
  // IGetProfileResponse,
} from "@medium-clone/common";
import { createFollow } from "../lib/api";
import type { IGetProfileResp, IPost, POST } from "../vite-env";

// --------- useBlogs ---------

export const useGetPosts = () => {
  const [blogs, setBlogs] = useState<POST[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPost = async () => {
    const res = await getBlogs(page);
    const newPosts = res.data.data.posts;
    const total = res.data.data.totalPosts;

    setBlogs((prev) => [...prev, ...newPosts]);
    setHasMore(page * 12 < total);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchPost();
  });

  return { blogs, fetchPost, hasMore };
};

// --------- useBlog ---------
const useBlog = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState<IPost>();
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

const useGetAuthor = (username: string | undefined) => {
  const [loading, setLoading] = useState<boolean>();
  const [author, setAuthor] = useState<IGetProfileResp>();
  const [error, setError] = useState<Error | null>(null);
  // const [type, setType] = useState<"signing" | "signup" >(null)

  useEffect(() => {
    setLoading(true);
    getAuthor(username || "")
      .then((res) => {
        console.log(res.data);

        setAuthor(res.data.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [username]);
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

const usePublishChange = (postId: string, v: boolean) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<apiResponse | any>();


  const changePublishHook = async () => {
    try {
      setLoading(true)
      const res = await changePublish(postId, v)
      console.log(res);
      
      setResponse(res.data)
    } catch (err) {
      const error = err as Error
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  return { changePublishHook, error, loading, response }
}

export {
  // useBlogs,
  usePublishChange,
  useBlog,
  usePostBlog,
  useDeleteBlog,
  useGetProfile,
  useCheckUsername,
  useGetAuthor,
  useFollow,
};
