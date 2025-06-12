import type { SignupInput } from "@medium-clone/common";
import React, { useId, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Input from "./Input";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInput, setPostInput] = useState<SignupInput>({
    name: "",
    password: "",
    username: "",
  });

  return (
    <div className="h-screen flex justify-center flex-col">      
      <div className="flex justify-center">
        <div>
          <div className="text-3xl font-extrabold">Create an account</div>

          <Input
            label="Name"
            placeholder="Enter Your name"
            key={useId()}
            onChange={(e) => {
              setPostInput((c) => ({ ...c, name: e.target.value }));
            }}
          />
          <div className="text-slate-400">
            Already have an account?
            <Link to={"/signin"} className="ml-3 text-blue-500 underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
