import React from "react";

const Grid = ({
  fluid = false,
  children,
}: {
  fluid?: boolean;
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  if (fluid) {
    return (
      <div className="lg:px-3 container mx-auto py-2 bg-dark">{children}</div>
    );
  } else {
    return (
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:gap-x-4 lg:px-3 container mx-auto py-2 bg-dark">
        {children}
      </div>
    );
  }
};

export default Grid;
