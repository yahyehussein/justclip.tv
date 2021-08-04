import React from "react";

const ClipSkeleton = (): JSX.Element => {
  return (
    <div className="bg-dark w-full h-auto mb-3 lg:border lg:rounded-md flex">
      <div className="w-10 lg:flex flex-col items-center pt-2 bg-codgray rounded-tl-md rounded-bl-md hidden">
        <button className="hover:bg-gray px-2 py-1">
          <i className="fas fa-arrow-up"></i>
        </button>
        <span>&bull;</span>
        <button className="hover:bg-gray px-2 py-1">
          <i className="fas fa-arrow-down"></i>
        </button>
      </div>
      <div className="animate-pulse flex-1 pt-2 ">
        <div className="ml-2 w-64 h-3 bg-gray rounded-md mb-2"></div>
        <div className="flex mb-2">
          <div className="ml-2 w-16 h-5 bg-gray rounded-md lg:block hidden"></div>
          <div className="ml-2 w-72 h-5 bg-gray rounded-md"></div>
        </div>
        <div className="aspect-w-16 aspect-h-9 bg-gray"></div>
        <div className="flex justify-between p-2">
          <div className="flex">
            <div className="w-24 h-10 bg-gray border-r border-black"></div>
            <div className="w-24 h-10 bg-gray border-r border-black"></div>
            <div className="w-5 h-10 bg-gray"></div>
          </div>
          <div className="w-28 h-10 bg-gray lg:block hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default ClipSkeleton;
