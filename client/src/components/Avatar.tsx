import React from "react";

const Avatar = ({ name, size = 40 }: { name: string; size?: number }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full"
    >
      <span className="text-xs font-extralight text-gray-600 dark:text-gray-300">
        {name[0].toUpperCase()}
      </span>
    </div>
  );
};

export default Avatar;
