import { InertiaLink } from "@inertiajs/inertia-react";
import { Leaderboard } from "../types/leaderboard";
import React from "react";
import numeral from "numeral";

const Clipper = ({
  asset_url,
  index,
  leaderboard,
}: {
  asset_url: string;
  index: number;
  leaderboard: Leaderboard;
}): JSX.Element => {
  if (index === 0) {
    return (
      <div
        className="bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${leaderboard.user.avatar})`,
        }}
      >
        <InertiaLink
          href={`/${leaderboard.user.login}`}
          className="flex items-center lg:pt-44 px-3 lg:pb-2 bg-secondary bg-opacity-70 hover:bg-opacity-80 transition"
        >
          <p className="px-4 py-2 bg-primary text-white-light rounded-md text-2xl lg:mr-2 mr-3">
            {index + 1}
          </p>
          <div className="lg:hidden block mr-3">
            <img
              src={leaderboard.user.avatar.replace(/\d+x\d+/g, "70x70")}
              alt="avatar"
              width="45"
              height="45"
              onError={(e) => {
                e.currentTarget.src = `${
                  asset_url ? asset_url : ""
                }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
              }}
            />
          </div>
          <div className="flex flex-col">
            <p className="text-white-light">{leaderboard.user.display_name}</p>
            <p className="text-white-light">
              {leaderboard.current_points - leaderboard.previous_points >= 0 ? (
                <i className="fas fa-caret-up text-primary mr-1"></i>
              ) : (
                <i className="fas fa-caret-down text-red-persimmon mr-1"></i>
              )}
              {numeral(leaderboard.current_points).format("0.[0]a")}
            </p>
          </div>
        </InertiaLink>
      </div>
    );
  }

  return (
    <InertiaLink
      href={`/${leaderboard.user.login}`}
      className="flex items-center my-2 group px-3"
    >
      <p className="px-4 py-2 border rounded-md text-2xl mr-3 group-hover:text-muted transition">
        {index + 1}
      </p>
      <div className="mr-3">
        <img
          src={leaderboard.user.avatar.replace(/\d+x\d+/g, "70x70")}
          alt="avatar"
          width="45"
          height="45"
          onError={(e) => {
            e.currentTarget.src = `${
              asset_url ? asset_url : ""
            }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
          }}
        />
      </div>
      <div className="flex flex-col">
        <p className="group-hover:text-muted">
          {leaderboard.user.display_name}
        </p>
        <p className="text-muted text-sm">
          {leaderboard.current_points - leaderboard.previous_points >= 0 ? (
            <i className="fas fa-caret-up text-primary mr-1"></i>
          ) : (
            <i className="fas fa-caret-down text-red-persimmon mr-1"></i>
          )}
          {numeral(leaderboard.current_points).format("0.[0]a")}
        </p>
      </div>
    </InertiaLink>
  );
};

const TopClippers = ({
  asset_url,
  leaderboard,
  top,
  broadcaster_id,
  category_id,
  className,
}: {
  asset_url: string;
  leaderboard: Leaderboard[];
  top?: string;
  broadcaster_id?: number;
  category_id?: number;
  className?: string;
}): JSX.Element => {
  return (
    <div
      className={`bg-dark lg:rounded-md pt-3 mb-3 border-t border-b lg:border-r lg:border-l ${className}`}
    >
      <p className="text-xl font-semibold pl-3 mb-2 capitalize">
        Top {top} Clippers
      </p>
      {leaderboard.map((leaderboard, index) => {
        return (
          <Clipper
            asset_url={asset_url}
            key={leaderboard.id.toString()}
            index={index}
            leaderboard={leaderboard}
          ></Clipper>
        );
      })}
      <div className="p-2 border-t">
        {broadcaster_id || category_id ? (
          <>
            {broadcaster_id && (
              <InertiaLink
                href={`/clippers/leaderboard?broadcaster_id=${broadcaster_id}`}
                className="w-full bg-primary hover:bg-opacity-80 rounded-md p-3 text-lg font-semibold block text-center text-white-light"
              >
                View All
              </InertiaLink>
            )}
            {category_id && (
              <InertiaLink
                href={`/clippers/leaderboard?category_id=${category_id}`}
                className="w-full bg-primary hover:bg-opacity-80 rounded-md p-3 text-lg font-semibold block text-center text-white-light"
              >
                View All
              </InertiaLink>
            )}
          </>
        ) : (
          <InertiaLink
            href={`/clippers/leaderboard`}
            className="w-full bg-primary hover:bg-opacity-80 rounded-md p-3 text-lg font-semibold block text-center text-white-light"
          >
            View All
          </InertiaLink>
        )}
      </div>
    </div>
  );
};

export default TopClippers;
