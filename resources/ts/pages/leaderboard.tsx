import React, { useState } from "react";

import type { Category } from "../types/category";
import Grid from "@shared/grid";
import { InertiaLink } from "@inertiajs/inertia-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import LeaderboardSkeleton from "@shared/skeleton/leaderboard";
import type { Leaderboard as LeaderboardType } from "../types/leaderboard";
import MiniProfile from "@shared/mini-profile";
import type { Pagination } from "../types/pagination";
import Site from "@shared/site";
import type { User } from "../types/user";
import axios from "axios";
import numeral from "numeral";

const Leaderboard = ({
  asset_url,
  broadcaster,
  category,
  leaderboard,
}: {
  asset_url: string;
  broadcaster?: User;
  category?: Category;
  leaderboard: Pagination<LeaderboardType>;
}): JSX.Element => {
  const [leaderboards, setLeaderboards] = useState<Pagination<LeaderboardType>>(
    leaderboard
  );

  const getLeaderboards = () => {
    axios.get(`${leaderboards.next_page_url}`).then(({ data }) => {
      if (leaderboards?.data) {
        setLeaderboards({
          ...data,
          data: [...leaderboards.data, ...data.data],
        });
      }
    });
  };

  return (
    <>
      <Site title="Leaderboard"></Site>
      <Grid fluid>
        <>
          <div className="pb-3 px-2">
            <p className="text-2xl mb-1 font-bold">
              Today&apos;s Top Growing Clippers{" "}
              {broadcaster && `in ${broadcaster.display_name}`}
              {category && `in ${category.name}`}
            </p>
            <p className="text-muted">
              Browse Justclip&apos;s top growing clippers. Find the top clippers
              in your favourite broadcaster and category.
            </p>
          </div>
          <InfiniteScroll
            dataLength={leaderboards.to}
            next={getLeaderboards}
            hasMore={!!leaderboards.next_page_url}
            loader={<LeaderboardSkeleton mini={false}></LeaderboardSkeleton>}
          >
            {leaderboards.data.map((leaderboard, index) => {
              return (
                <div
                  key={leaderboard.id}
                  className="flex justify-between items-center bg-dark border-t border-b lg:border-r lg:border-l lg:rounded-md p-4 mb-3"
                >
                  <div className="flex items-center">
                    <div className="m-r-18">
                      <MiniProfile
                        asset_url={asset_url}
                        user_id={leaderboard.user.id}
                      >
                        <InertiaLink href="/initialresult">
                          <img
                            src={leaderboard.user.avatar.replace(
                              /\d+x\d+/g,
                              "70x70"
                            )}
                            alt="avatar"
                            width="70"
                            height="70"
                            className="ring-2 ring-primary"
                            onError={(e) => {
                              e.currentTarget.src = `${
                                asset_url ? asset_url : ""
                              }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                            }}
                          />
                        </InertiaLink>
                      </MiniProfile>
                    </div>
                    <div className="flex flex-col">
                      <MiniProfile
                        asset_url={asset_url}
                        user_id={leaderboard.user.id}
                      >
                        <InertiaLink
                          href={`/${leaderboard.user.login}`}
                          className="hover:underline text-3xl font-semibold text-primary"
                        >
                          {leaderboard.user.display_name}
                        </InertiaLink>
                      </MiniProfile>
                      <div className="flex items-center mt-1">
                        <p className="px-2 border border-gray-ligter text-gray-ligter rounded-md mr-1">
                          {index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {leaderboard.current_points - leaderboard.previous_points >=
                    0 ? (
                      <i className="fas fa-caret-up text-primary mr-1"></i>
                    ) : (
                      <i className="fas fa-caret-down text-red-persimmon mr-1"></i>
                    )}
                    <span>
                      {numeral(leaderboard.current_points).format("0a")}
                    </span>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Leaderboard.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Leaderboard;
