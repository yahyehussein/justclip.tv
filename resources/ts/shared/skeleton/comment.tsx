import React from "react";

const CommentSkeleton = ({
  minimized = true,
}: {
  minimized?: boolean;
}): JSX.Element => {
  return (
    <div className="bg-dark w-full h-auto mb-3 border-t border-b lg:border-r lg:border-l lg:rounded-md py-2 px-4 overflow-hidden">
      <div className="animate-pulse">
        <div className="flex py-2">
          <div className="w-12 h-12 bg-gray mt-2 mr-5 flex-shrink-0"></div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-10 h-3 bg-gray rounded-md"></div>
                <span className="text-muted">&#8226;</span>
                <div className="w-10 h-3 bg-gray rounded-md"></div>
              </div>
              {minimized && <i className="far fa-minus-square"></i>}
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
