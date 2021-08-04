import { InertiaLink, useRemember } from "@inertiajs/inertia-react";
import React, { useEffect } from "react";

import BoxPlaceholder from "@shared/placeholder/box";
import BoxSkeleton from "@shared/skeleton/box";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Profile from "@shared/profile";
import Site from "@shared/site";
import type { User } from "../../types/user";
import axios from "axios";

const Following = ({
  asset_url,
  auth,
  user,
}: {
  asset_url: string;
  auth?: User;
  user: User;
}): JSX.Element => {
  const [followings, setFollowings] = useRemember<Pagination<User>>(
    {
      data: [],
      next_page_url: `/json/following?page=1&user_id=${user.id}`,
      to: 20,
    },
    "followings"
  );
  const [empty, setEmpty] = useRemember(false, "empty");

  const getFollowings = () => {
    if (followings.next_page_url) {
      axios.get(`${followings.next_page_url}`).then(({ data }) => {
        if (followings?.data) {
          setFollowings({ ...data, data: [...followings.data, ...data.data] });
          setEmpty(!!!data.from);
        }
      });
    }
  };

  useEffect(() => {
    getFollowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Site title={user.login}></Site>
      <Profile asset_url={asset_url} auth={auth} user={user}>
        <div className="mt-3">
          <InfiniteScroll
            dataLength={followings.to}
            next={getFollowings}
            hasMore={!!followings.next_page_url}
            loader={
              <>
                {[...Array(16)].map((value, key) => (
                  <BoxSkeleton key={key}></BoxSkeleton>
                ))}
              </>
            }
            style={{ overflow: "none" }}
            className="grid lg:grid-cols-3 grid-cols-2 gap-2 justify-items-stretch"
          >
            {followings?.data.map((following) => {
              return (
                <InertiaLink
                  key={following.id}
                  href={`/broadcaster/${following.login}`}
                  className="relative block"
                >
                  <img
                    src={following.avatar}
                    alt="avatar"
                    className="hover:ring-2 ring-twitch h-auto w-full"
                  />
                  {following.subscriptions &&
                    (following.type ? (
                      <span className="bg-red-600 rounded-full w-10 align-middle font-semibold text-center text-xs uppercase text-white-light absolute top-0 left-0 mt-2 ml-2">
                        Live
                      </span>
                    ) : (
                      <span className="bg-gray rounded-full w-16 align-middle font-semibold text-center text-xs uppercase absolute top-0 left-0 mt-2 ml-2">
                        Offline
                      </span>
                    ))}
                  {!!following.partner && (
                    <div className="absolute top-0 right-0 mt-1 mr-2">
                      <img
                        src={`${asset_url ? asset_url : ""}/images/partner.png`}
                        alt="partner"
                      />
                    </div>
                  )}
                  <div className="absolute bottom-0 w-full h-auto bg-dark bg-opacity-80 lg:text-2xl p-2 break-all">
                    {following.display_name}
                  </div>
                </InertiaLink>
              );
            })}
          </InfiniteScroll>
          {empty && (
            <div className="grid lg:grid-cols-3 grid-cols-2 gap-2 justify-items-stretch relative">
              {[...Array(9)].map((value, key) => (
                <BoxPlaceholder key={key}></BoxPlaceholder>
              ))}
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col">
                <p className="text-2xl text-center mb-2">
                  hmm... {user.display_name} has not followed anyone yet
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
Following.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Following;
