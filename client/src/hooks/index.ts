import { useState, useEffect, useRef } from "react";
import {
  changePublish,
  checkUsername,
  createBlog,
  createLike,
  deleteBlog,
  deleteFollow,
  getAuthor,
  getBlog,
  getBlogs,
  getFollowersAndFollowingApi,
  getMeProfile,
  searchPostApi,
} from "../lib/api";
import type {
  apiResponse,
  CreateBlogInput,
  // IGetProfileResponse,
} from "@medium-clone/common";
import { createFollow, searchUsers } from "../lib/api";
import type { IGetProfileResp, IPost, ITopUser, POST } from "../vite-env";
import { usePostStore } from "../store/post";
import { useAuthorProfileStore } from "../store/author";
import toast from "react-hot-toast";
import { useProfileStatStore } from "../store/ProfileState";

// --------- useBlogs ---------

export const useGetPosts = () => {
  // const [blogs, setBlogs] = useState<POST[]>([]);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  const { addPosts, posts: blogs, page, setPage, hasMore, setHasMore } = usePostStore();

  const fetchPost = async () => {
    try {
      const res = await getBlogs(page);
      const newPosts = res.data.data.posts;
      const total = res.data.data.totalPosts;
      setPage(page + 1);

      addPosts(newPosts);
      setHasMore(page * 12 < total);
      // console.log(page) 

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    if (blogs.length == 0) {
      fetchPost();
    }

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

    const hasInvalidChars = /[^a-z0-9_]/.test(username.trim());
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
  const [error, setError] = useState<Error | null>(null);
  const { setProfile, authorProfile } = useAuthorProfileStore();

  useEffect(() => {
    setLoading(true);
    getAuthor(username || "")
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  }, [setProfile, username]);
  return { loading, author: authorProfile, error };
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
  const [response, setResponse] = useState<apiResponse>();

  const changePublishHook = async () => {
    try {
      setLoading(true);
      const res = await changePublish(postId, v);
      console.log(res);

      setResponse(res.data);
    } catch (err) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { changePublishHook, error, loading, response };
};

const useLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<apiResponse>();

  const createLikeHook = async (postId: string, userId: string) => {
    try {
      setLoading(true);
      const res = await createLike({ postId, userId });
      console.log(res);
      setResponse(res.data);
      toast.success(response?.message || "Post liked");
    } catch (err) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteLikeHook = async (postId: string, userId: string) => {
    try {
      setLoading(true);
      const res = await createLike({ postId, userId });
      setResponse(res.data);
    } catch (err) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { createLikeHook, deleteLikeHook, error, loading, response };
};

// still have to understand debouncing
const useSearchUser = (minLength = 3, debounceMs = 400) => {
  const [users, setUsers] = useState<ITopUser[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (searchTerm.length < minLength) {
      setUsers(null); // clear result if too short
      return;
    }

    setLoading(true);
    setError(null);

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // Debounce the request
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    debounceRef.current = window.setTimeout(() => {
      searchUsers(searchTerm, { signal: controller.signal })
        .then((res) => {
          setUsers(res.data.data);
          // console.log(users);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError(err);
          }
        })
        .finally(() => setLoading(false));
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [searchTerm, debounceMs, minLength]);

  return { users, setSearchTerm, searchTerm, loading, error };
};

const useSearchPost = (searchTerm: string, minLength = 3, debounceMs = 400) => {
  const [posts, setPosts] = useState<POST[]>();
  // const [s, s] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debounceRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (searchTerm.length < minLength) {
      return;
    }

    setLoading(true);
    setError(null);

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    // Debounce the request
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    debounceRef.current = window.setTimeout(() => {
      searchPostApi(searchTerm, { signal: controller.signal })
        .then((res) => {
          setPosts(res.data.data);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError(err);
          }
        })
        .finally(() => setLoading(false));
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [searchTerm, debounceMs, minLength]);

  return { posts, loading, error };
};


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
  useLike,
  useSearchUser,
  useSearchPost,
}
