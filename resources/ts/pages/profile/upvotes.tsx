import React, { useEffect } from "react";

import Clip from "@shared/clip";
import ClipPlaceholder from "@shared/placeholder/clip";
import ClipSkeleton from "@shared/skeleton/clip";
import type { Clip as ClipType } from "../../types/clip";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Profile from "@shared/profile";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import type { User } from "../../types/user";
import axios from "axios";
import { useRemember } from "@inertiajs/inertia-react";

const Upvotes = ({
  asset_url,
  auth,
  user,
}: {
  asset_url: string;
  auth?: User;
  user: User;
}): JSX.Element => {
  const [sortBy, setSortBy] = useRemember("&hot=true", "sort");
  const [clips, setClips] = useRemember<Pagination<ClipType>>(
    {
      data: [],
      next_page_url: `/json/clip?page=1&vote=upvotes${sortBy}`,
      to: 10,
    },
    "clips"
  );
  const [empty, setEmpty] = useRemember(false, "empty");

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
      next_page_url: `/json/clip?page=1&vote=upvotes${sortBy}`,
      to: 10,
    });
    axios.get(`/json/clip?page=1&vote=upvotes${sortBy}`).then(({ data }) => {
      setClips(data);
      setEmpty(!!!data.from);
    });
  };

  useEffect(() => {
    getClips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Site title={user.login}></Site>
      <Profile asset_url={asset_url} auth={auth} user={user}>
        <div className="flex justify-end mt-2">
          <SortClips onSort={onSort}></SortClips>
        </div>
        <div className="mt-2">
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
                <p className="text-2xl text-center">
                  hmm... looks like you haven&apos;t upvoted anything yet
                </p>
              </div>
            </div>
          )}
        </div>
      </Profile>
    </>
  );
};

/* eslint-disable react/display-name */
Upvotes.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Upvotes;
