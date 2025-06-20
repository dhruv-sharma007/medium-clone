import Auth from "../components/Auth";
import Quote from "../components/Quote";

const SignIn = () => {
  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <Auth type="signin" />
        </div>
        <div className=" invisible lg:visible">
          <Quote />
        </div>
      </div>
    </>
  );
};

export default SignIn;
