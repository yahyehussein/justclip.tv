// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { InertiaHead } from "@inertiajs/inertia-react";
import React from "react";

const Site = ({
  title,
  children,
}: {
  title?: string;
  children?: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <InertiaHead>
      <title>{title ? `${title} - Justclip` : "Justclip"}</title>
      {children}
    </InertiaHead>
  );
};

export default Site;
