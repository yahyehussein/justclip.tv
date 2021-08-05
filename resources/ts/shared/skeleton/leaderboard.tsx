import React from "react";

const LeaderboardSkeleton = ({
  index,
  mini = true,
  className,
}: {
  index?: number;
  mini?: boolean;
  className?: string;
}): JSX.Element => {
  if (mini) {
    return (
      <div
        className={`bg-dark w-full h-auto mb-3 border-t border-b lg:border-r lg:border-l lg:rounded-md pt-2 ${className}`}
      >
        <div className="animate-pulse">
          <div className="w-32 h-5 bg-gray rounded-md mb-2 ml-3"></div>
          <div className="relative mb-2">
            <div className="w-full h-56 bg-gray mb-1"></div>
            <div className="flex items-center mb-2 absolute bottom-0 ml-4">
              <p className="px-4 py-2 border border-gray-ligter text-gray-ligter rounded-md text-2xl mr-2 group-hover:text-muted transition">
                1
              </p>
              <div className="flex flex-col">
                <div className="w-20 h-4 bg-dark rounded-md mb-1"></div>
                <div className="w-10 h-3 bg-dark rounded-md mb-1"></div>
              </div>
            </div>
          </div>
          <div className="px-4">
            {[...Array(4)].map((value, index) => {
              return (
                <div key={index} className="flex items-center mb-2">
                  <p className="px-4 py-2 border border-gray-ligter text-gray-ligter rounded-md text-2xl mr-2 group-hover:text-muted transition">
                    {index + 2}
                  </p>
                  <div className="w-12 h-12 bg-gray mr-2"></div>
                  <div className="flex flex-col">
                    <div className="w-20 h-4 bg-gray rounded-md mb-1"></div>
                    <div className="w-10 h-3 bg-gray rounded-md mb-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 border-t">
            <div className="w-full bg-primary rounded-md p-3 text-lg font-semibold block text-center text-white-light">
              View All
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-dark border rounded-md p-4 mb-3">
        <div className="animate-pulse">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="bg-gray rounded-md m-r-18"
                style={{ width: "70px", height: "70px" }}
              ></div>
              <div className="flex flex-col">
                <div className="w-24 h-5 bg-gray rounded-md mb-2"></div>
                <div className="flex items-center">
                  <p className="px-2 border border-gray-ligter text-gray-ligter rounded-md mr-1">
                    {index && index}
                  </p>
                  <div className="w-20 h-4 bg-gray rounded-md mr-1"></div>
                  <div className="w-20 h-4 bg-gray rounded-md"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="w-5 h-4 bg-gray rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LeaderboardSkeleton;
