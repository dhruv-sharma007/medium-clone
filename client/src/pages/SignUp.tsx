import Quote from "../components/Quote";
import Auth from "../components/Auth";
import AppBar from "../components/AppBar";

const SignUp = () => {
  return (
    <>
      <div className=" fixed w-full z-50">
        <AppBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 ">
        <div>
          <Auth type="signup" />
        </div>
        <div className=" invisible md:visible">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default SignUp;
