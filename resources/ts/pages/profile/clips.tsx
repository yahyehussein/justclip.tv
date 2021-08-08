import React, { useEffect } from "react";

import Clip from "@shared/clip";
import ClipPlaceholder from "@shared/placeholder/clip";
import ClipSkeleton from "@shared/skeleton/clip";
import type { Clip as ClipType } from "../../types/clip";
import { Inertia } from "@inertiajs/inertia";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Profile from "@shared/profile";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import type { User } from "../../types/user";
import axios from "axios";
import { useRemember } from "@inertiajs/inertia-react";

const Clips = ({
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
      next_page_url: `/json/clip?page=1&user_id=${user.id}${sortBy}`,
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
      next_page_url: `/json/clip?page=1&user_id=${user.id}${sortBy}`,
      to: 10,
    });
    axios
      .get(`/json/clip?page=1&user_id=${user.id}${sortBy}`)
      .then(({ data }) => {
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
                {auth?.id === user.id ? (
                  <>
                    <p className="text-2xl text-center mb-2">
                      Upload clips of memorable moments from your favourite
                      Twitch streams and videos.
                    </p>
                    <button
                      className="bg-primary text-white-light font-semibold w-full rounded-md p-2 bg-opacity-80 focus:outline-none"
                      onClick={() => Inertia.visit("/upload")}
                    >
                      Upload Clip
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-2xl text-center">
                      hmm... {user.display_name} hasn&apos;t cliped anything
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Profile>
    </>
  );
};

/* eslint-disable react/display-name */
Clips.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Clips;
