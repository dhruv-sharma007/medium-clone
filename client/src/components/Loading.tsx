import { BarLoader, RotateLoader } from "react-spinners";

const BarLoading = ({ height = 4, width = 400 }) => {
  return (
    <>
      <BarLoader height={height} width={width} />
    </>
  );
};
export const RotateLoading = ({ size = 15 }) => {
  return (
    <>
      <RotateLoader size={size} />
    </>
  );
};

export default BarLoading;
