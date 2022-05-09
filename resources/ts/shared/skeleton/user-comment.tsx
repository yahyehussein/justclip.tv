import React from "react";

const CommentSkeleton = (): JSX.Element => {
  return (
    <div className="bg-dark w-full h-auto lg:mb-3">
      <div className="animate-pulse">
        <div className="border-t lg:border-b lg:border-r lg:border-l px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="w-24 h-2 bg-gray rounded-md mb-1"></div>
            <div className="w-64 h-5 bg-gray rounded-md"></div>
          </div>
          <div className="w-24 h-14 bg-gray rounded-md"></div>
        </div>
        <div className="flex lg:border-l border-b lg:border-r py-2 px-4">
          <div className="w-12 h-12 bg-gray mt-2 mr-5 flex-shrink-0"></div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-10 h-3 bg-gray rounded-md"></div>
                <span className="text-muted">&#8226;</span>
                <div className="w-10 h-3 bg-gray rounded-md"></div>
              </div>
              <i className="far fa-minus-square"></i>
            </div>
            <div className="w-full h-5 bg-gray rounded-md my-1"></div>
            <div className="flex items-center">
              <button className="px-2 focus:outline-none">
                <i className="fas fa-arrow-up"></i>
              </button>
              <span className="text-muted">&#8226;</span>
              <button className="px-2 focus:outline-none">
                <i className="fas fa-arrow-down"></i>
              </button>
              <span className="ml-1 mr-2">|</span>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="flex lg:border-l border-b lg:border-r py-2 px-4">
          <div className="w-12 h-12 bg-gray mt-2 mr-5 flex-shrink-0"></div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-10 h-3 bg-gray rounded-md"></div>
                <span className="text-muted">&#8226;</span>
                <div className="w-10 h-3 bg-gray rounded-md"></div>
              </div>
              <i className="far fa-minus-square"></i>
            </div>
            <div className="w-full h-5 bg-gray rounded-md my-1"></div>
            <div className="flex items-center">
              <button className="px-2 focus:outline-none">
                <i className="fas fa-arrow-up"></i>
              </button>
              <span className="text-muted">&#8226;</span>
              <button className="px-2 focus:outline-none">
                <i className="fas fa-arrow-down"></i>
              </button>
              <span className="ml-1 mr-2">|</span>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
              <div className="w-14 h-5 bg-gray self-end mr-2 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
