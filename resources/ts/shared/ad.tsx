import React from "react";
import { useEffect } from "react";

const Ad = ({
  dataAdSlot,
  dataAdFormat,
  className,
}: {
  dataAdSlot: string;
  dataAdFormat: string;
  className?: string;
}): JSX.Element => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-2478457205374361"
      data-ad-slot={dataAdSlot}
      data-ad-format={dataAdFormat}
      data-full-width-responsive="true"
    ></ins>
  );
};

export default Ad;
