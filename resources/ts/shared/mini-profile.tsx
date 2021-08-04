import React, { useState } from "react";
import { isAdminister, isGlobalModerator } from "../utils";

import type { User } from "../types/user";
import axios from "axios";
import numeral from "numeral";
import { usePopper } from "react-popper";

const MiniProfile = ({
  asset_url,
  user_id,
  children,
}: {
  asset_url: string;
  user_id: number;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [
    referenceElement,
    setReferenceElement,
  ] = useState<HTMLDivElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [timer, setTimer] = useState();
  const [user, setUser] = useState<User>();

  const isAdmin = user?.roles?.find((role) => isAdminister(role));
  const isGlobalMod = user?.roles?.find((role) => isGlobalModerator(role));

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "left",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [10, 20],
          },
        },
      ],
    }
  );

  return (
    <>
      <div
        className="inline"
        ref={setReferenceElement}
        onMouseOver={() => {
          const timer: any = setTimeout(() => {
            if (user) {
              popperElement?.setAttribute("data-show", "");
              if (update) {
                update();
              }
            } else {
              axios.get(`/json/${user_id}`).then(({ data }) => {
                setUser(data);
                popperElement?.setAttribute("data-show", "");
                if (update) {
                  update();
                }
              });
            }
          }, 900);
          setTimer(timer);
        }}
        onMouseOut={() => {
          popperElement?.removeAttribute("data-show");
          clearTimeout(timer);
        }}
      >
        {children}
      </div>

      <div
        id="tooltip"
        ref={setPopperElement}
        style={{ width: "328px", ...styles.popper }}
        {...attributes.popper}
        className="shadow z-50 overflow-hidden broder rounded-md"
      >
        {user?.mini_background && (
          <div className="absolute bg-secondary w-full" style={{ zIndex: -1 }}>
            <video
              className="w-full h-full object-cover object-right-top"
              muted={true}
              loop={true}
              autoPlay
            >
              <source
                src={`https://cdn.akamai.steamstatic.com/steamcommunity/public/images/${user?.mini_background}`}
                type="video/mp4"
              />
            </video>
          </div>
        )}

        <div
          className="p-4 flex items-center"
          style={{
            backgroundColor: `rgba(21, 24, 28, ${
              user?.mini_background ? 0.25 : 1
            })`,
          }}
        >
          <div className="-mb-7 flex-shrink-0 z-10 m-r-18">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                width="90"
                height="90"
                className="ring-2 ring-primary"
                onError={(e) => {
                  e.currentTarget.src = `${
                    asset_url ? asset_url : ""
                  }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                }}
              />
            )}
          </div>
          <p
            className="text-2xl text-primary break-all"
            style={{ textShadow: "1px 1px 4px #000" }}
          >
            {user?.display_name}
          </p>
        </div>
        <div
          className="px-4 pt-6 pb-4 relative text-xs text-muted"
          style={{
            backgroundColor: `rgba(47, 51, 54, ${
              user?.mini_background ? 0.73 : 1
            })`,
            backdropFilter: "blur(4px)",
          }}
        >
          {user && (
            <div className="flex">
              <div className="space-y-1 flex-1">
                <p className="font-semibold">Clip Votes</p>
                <p className="text-muted">
                  {numeral(
                    user.clip_upvotes_count - user.clip_downvotes_count
                  ).format("0,0")}
                </p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="font-semibold">Comment Votes</p>
                <p className="text-muted">
                  {numeral(
                    user.comment_upvotes_count - user.comment_downvotes_count
                  ).format("0,0")}
                </p>
              </div>
            </div>
          )}
          <div className="mt-2">
            {isAdmin && (
              <p className="bg-secondary px-2 py-1 rounded-full text-xs font-semibold inline-block mr-1 text-red-persimmon uppercase">
                Admin
              </p>
            )}
            {isGlobalMod && (
              <p className="bg-secondary px-2 py-1 rounded-full text-xs font-semibold inline-block text-primary uppercase">
                Global Mod
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniProfile;
