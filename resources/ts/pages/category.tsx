import React, { useEffect, useState } from "react";

import type { Category as CategoryType } from "../types/category";
import Clip from "@shared/clip";
import ClipPlaceholder from "@shared/placeholder/clip";
import ClipSkeleton from "@shared/skeleton/clip";
import type { Clip as ClipType } from "../types/clip";
import Footer from "@shared/footer";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Leaderboard } from "../types/leaderboard";
import LeaderboardSkeleton from "@shared/skeleton/leaderboard";
import type { Pagination } from "../types/pagination";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import TopClippers from "@shared/top-clippers";
import type { User } from "../types/user";
import axios from "axios";
import { useRemember } from "@inertiajs/inertia-react";

const Category = ({
  asset_url,
  auth,
  category,
}: {
  asset_url: string;
  auth?: User;
  category: CategoryType;
}): JSX.Element => {
  const [sortBy, setSortBy] = useRemember("&hot=true", "sort");
  const [clips, setClips] = useRemember<Pagination<ClipType>>(
    {
      data: [],
      next_page_url: `/json/clip?page=1&category_id=${category.id}${sortBy}`,
      to: 10,
    },
    "clips"
  );
  const [empty, setEmpty] = useRemember(false, "empty");
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>();
  const [blocked, setBlocked] = useRemember(
    auth?.blocked_categories?.includes(category.id),
    "blocked"
  );

  const getClips = () => {
    if (clips.next_page_url) {
      axios.get(`${clips.next_page_url}`).then(({ data }) => {
        setClips({ ...data, data: [...clips.data, ...data.data] });
        setEmpty(!!!data.from);
      });
    }
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setClips({
      data: [],
      next_page_url: `/json/clip?page=1&category_id=${category.id}${sortBy}`,
      to: 10,
    });
    axios
      .get(`/json/clip?page=1&category_id=${category.id}${sortBy}`)
      .then(({ data }) => {
        setClips(data);
        setEmpty(!!!data.from);
      });
  };

  useEffect(() => {
    getClips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`/json/leaderboard?limit=5&category_id=${category.id}`)
      .then(({ data }) => {
        setLeaderboard(data.data);
      });
  }, [category.id]);

  return (
    <>
      <Site title={`${category.name} Clips`}></Site>
      <Grid>
        <div className="col-span-3 flex lg:items-start items-center lg:px-0 px-2">
          <img
            alt="category"
            className="mr-4"
            sizes="(max-width: 540px) and (orientation: portrait) 82px,99px (max-width: 540px) and (orientation: portrait) 138px,184px"
            srcSet={`${category.box_art_url?.replace(
              /{width}x{height}/g,
              "138x184"
            )} 138w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "52x69"
            )} 52w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "208x277"
            )} 208w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "276x368"
            )} 276w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "416x555"
            )} 416w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "624x832"
            )} 624w,${category.box_art_url?.replace(
              /{width}x{height}/g,
              "832x1109"
            )} 832w`}
            src={`${category.box_art_url?.replace(
              /{width}x{height}/g,
              "138x184"
            )}`}
          />
          <div className="flex flex-col items-start">
            <p className="lg:text-4xl font-bold text-xl mb-2">
              {category.name}
            </p>
            {blocked ? (
              <button
                className="rounded-md py-1 px-2 border border-primary focus:outline-none"
                onClick={() => {
                  setBlocked(false);
                  axios.patch(`/unblock/${category.id}/category`).catch(() => {
                    setBlocked(true);
                  });
                }}
              >
                Unblock
              </button>
            ) : (
              <button
                className="rounded-md py-1 px-2 bg-secondary hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  setBlocked(true);
                  axios.patch(`/block/${category.id}/category`).catch(() => {
                    setBlocked(false);
                  });
                }}
              >
                Block
              </button>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 sm:col-span-3">
          <div className="flex items-center justify-end mb-2">
            <SortClips onSort={onSort}></SortClips>
          </div>
          <InfiniteScroll
            dataLength={clips.to}
            next={getClips}
            hasMore={!!clips.next_page_url}
            loader={
              <>
                <ClipSkeleton></ClipSkeleton>
                <ClipSkeleton></ClipSkeleton>
              </>
            }
          >
            {clips?.data.map((clip) => {
              return (
                <Clip
                  key={clip.id.toString()}
                  asset_url={asset_url}
                  clip={clip}
                  auth={auth}
                ></Clip>
              );
            })}
          </InfiniteScroll>
          {empty && (
            <div className="relative">
              <ClipPlaceholder></ClipPlaceholder>
              <ClipPlaceholder></ClipPlaceholder>
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col rounded-md">
                <p className="text-2xl text-center mb-2">
                  There are no clips for {category.name}
                </p>
                <p className="text-center mb-2">
                  Be the first person to upload a clip
                </p>
                <button
                  className="bg-primary text-white-light font-semibold w-full rounded-md p-2 bg-opacity-80 focus:outline-none"
                  onClick={() => Inertia.visit("/upload")}
                >
                  Upload Clip
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-start-3 lg:col-span-1 col-span-3 row-start-2 lg:mt-0 mt-3">
          {leaderboard ? (
            !!leaderboard.length && (
              <TopClippers
                asset_url={asset_url}
                leaderboard={leaderboard}
                top={category.name}
                category_id={category.id}
              ></TopClippers>
            )
          ) : (
            <LeaderboardSkeleton></LeaderboardSkeleton>
          )}
          <div className="lg:sticky lg:top-3">
            <Footer></Footer>
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Category.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Category;
