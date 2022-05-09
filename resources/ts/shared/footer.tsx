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
          className="mb-3 bg-dark lg:rounded-md lg:p-3 lg:border"
        >
          <Ad dataAdSlot="1328388064" dataAdFormat="rectangle"></Ad>
        </div>
      )} */}
      <div className="hidden p-3 text-sm border rounded-md bg-dark lg:block">
        <div className="flex mb-5">
          <div className="flex-1 space-y-1">
            <InertiaLink href="/terms" className="block">
              Terms
            </InertiaLink>
          </div>
          <div className="flex-1 space-y-1">
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
        <p className="text-xs text-muted">
          Disclaimer: This site is not affiliated with Twitch and does not store
          any clips on its server. All clips are provided by twitch media
          assets.
        </p>
      </div>
    </>
  );
};

export default Footer;
