import Avatar from "./Avatar";

const AppBar = () => {
  return (
    <>
      <div className="border-b flex justify-between px-10 py-3 items-center bg-white">
        <div className="font-bold text-3xl font-serif">Medium</div>
        <div>
          <Avatar name="Bablu" size={32} />
        </div>
      </div>
    </>
  );
};

export default AppBar;
