import Ad from "@shared/ad";
import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";
import moment from "moment";

const Footer = ({ ad = true }: { ad?: boolean }): JSX.Element => {
  return (
    <>
      {/* {ad && (
        <div
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          align="center"
          className="bg-dark lg:rounded-md lg:p-3 lg:border mb-3"
        >
          <Ad dataAdSlot="1328388064" dataAdFormat="rectangle"></Ad>
        </div>
      )} */}
      <div className="bg-dark rounded-md p-3 text-sm border lg:block hidden">
        <div className="flex mb-5">
          <div className="space-y-1 flex-1">
            <InertiaLink href="/terms" className="block">
              Terms
            </InertiaLink>
          </div>
          <div className="space-y-1 flex-1">
            <InertiaLink href="/content-policy" className="block">
              Content Policy
            </InertiaLink>
            <InertiaLink href="/privacy-policy" className="block">
              Privacy Policy
            </InertiaLink>
            <InertiaLink href="/dmca" className="block">
              DMCA
            </InertiaLink>
          </div>
        </div>
        <p>Justclip &copy; {moment().year()}. All rights reserved</p>
        <p className="text-muted text-xs">
          Disclaimer: This site is not affiliated with Twitch.
        </p>
      </div>
    </>
  );
};

export default Footer;
