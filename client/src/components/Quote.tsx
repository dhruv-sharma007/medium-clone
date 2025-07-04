const Quote = () => {
  return (
    <div className="quote bg-slate-200 h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <p className="text-3xl font-semibold mb-4 leading-relaxed">
          “Computers are incredibly fast, accurate, and stupid. Human beings are
          incredibly slow, inaccurate, and brilliant. Together they are powerful
          beyond imagination.”
        </p>
        <p className="text-gray-600">~ Elon Doe </p>
      </div>
    </div>
  );
};

export default Quote;
