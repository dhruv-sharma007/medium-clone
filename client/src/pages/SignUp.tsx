import React, { useState } from "react";
import Quote from "../components/Quote";
import Auth from "../components/Auth";

const SignUp = () => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <Auth type="signup" />
        </div>
        <div className=" invisible lg:visible">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default SignUp;
