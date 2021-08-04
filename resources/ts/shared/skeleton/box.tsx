import React from "react";

const BoxSkeleton = (): JSX.Element => {
  return (
    <div className="w-full h-auto">
      <div className="animate-pulse">
        <div
          className="w-full bg-gray mb-1"
          style={{ height: "202.67px" }}
        ></div>
        <div className="w-28 h-5 bg-gray rounded-md"></div>
      </div>
    </div>
  );
};

export default BoxSkeleton;
