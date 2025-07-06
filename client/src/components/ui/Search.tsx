const Search = () => {
  return (
    <div className="flex items-center gap-2 px-5 bg-gray-900 rounded-full shadow-x min-h-10 ring">
      <svg
        className="w-5 h-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="search"
        placeholder="Search"
        className="grow outline-none focus:ring-0 border-gray- text-sm text-white"
      />
    </div>
  );
};

export default Search;
