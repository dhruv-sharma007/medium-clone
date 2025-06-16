import type { SignupInput } from "@medium-clone/common";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { signinApi, signupApi } from "../lib/api";
import toast from "react-hot-toast";
import BarLoading from "./Loading";
import { useAuthStore } from "../store/auth";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const { login } = useAuthStore()

  const [postInput, setPostInput] = useState<SignupInput>({
    name: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (type === "signin") {
        const res = await signinApi(postInput);
        login({
          name: res.data.data.name,
          id: res.data.data.id,
          username: res.data.data.username
        })
        toast.success(res.data.message);

      } else {
        const res = await signupApi(postInput);
        toast.success(res.data.message);
      }

    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      console.log(err);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center ring ml-20 mr-20 p-8 rounded-2xl bg-slate-300">
        <div>
          <div className="text-3xl font-extrabold">
            {type === "signin" ? <p>Log in</p> : <p>Create Account</p>}
          </div>
          <div className="flex justify-center">{loading && <BarLoading />}</div>

          <form onSubmit={onSubmit}>
            {type === "signup" && (
              <Input
                type="text"
                label="Name"
                placeholder="Enter Your name"
                onChange={(e) => {
                  setPostInput((c) => ({ ...c, name: e.target.value }));
                }}
              />
            )}
            <Input
              type="text"
              label="Username"
              placeholder="Enter your username"
              onChange={(e) => {
                setPostInput((c) => ({ ...c, username: e.target.value }));
              }}
            />
            <Input
              label="Password"
              placeholder="Enter Your Password"
              type="password"
              onChange={(e) => {
                setPostInput((c) => ({ ...c, password: e.target.value }));
              }}
            />

            <button
              className="btn btn-neutral min-w-full mt-3 bg-[rgba(17,20,50,0.89)] text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
          {type === "signup" ? (
            <div className="text-slate-400">
              Already have an account?
              <Link to={"/signin"} className="ml-3 text-blue-500 underline">
                Login
              </Link>
            </div>
          ) : (
            <div className="text-slate-400">
              Don't have and account
              <Link to={"/signup"} className="ml-3 text-blue-500 underline">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
