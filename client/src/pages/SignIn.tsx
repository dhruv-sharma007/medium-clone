import AppBar from "../components/AppBar";
import Auth from "../components/Auth";
import Quote from "../components/Quote";

const SignIn = () => {
  return (
    <>
      <div className=" fixed w-full z-50">
        <AppBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Auth type="signin" />
        </div>
        <div className=" invisible md:visible">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default SignIn;
