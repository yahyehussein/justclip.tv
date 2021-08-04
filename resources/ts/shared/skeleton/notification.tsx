import React from "react";

const NotificationSkeleton = (): JSX.Element => {
  return (
    <div className="w-full h-auto p-4">
      <div className="animate-pulse">
        <div className="flex">
          <div className="w-6 h-6 bg-gray mr-3"></div>
          <div className="flex flex-col">
            <div className="w-10 h-10 bg-gray mb-2"></div>
            <div className="w-24 h-5 bg-gray rounded-md mb-2"></div>
            <div className="w-10 h-3 bg-gray rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
