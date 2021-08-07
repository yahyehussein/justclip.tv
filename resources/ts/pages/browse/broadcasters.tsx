import { InertiaLink, useRemember } from "@inertiajs/inertia-react";
import React, { useState } from "react";

import BoxSkeleton from "@shared/skeleton/box";
import Grid from "@shared/grid";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import ReactModal from "react-modal";
import Site from "@shared/site";
import type { User } from "../../types/user";
import axios from "axios";

const Browse = ({
  asset_url,
  broadcaster,
}: {
  asset_url: string;
  broadcaster: Pagination<User>;
}): JSX.Element => {
  const [broadcasters, setBroadcasters] = useRemember<Pagination<User>>(
    broadcaster
  );
  const [isOpen, setIsOpen] = useState(false);

  const getBroadcasters = () => {
    setIsOpen(false);

    if (broadcasters.next_page_url) {
      axios.get(`${broadcasters.next_page_url}`).then(({ data }) => {
        setBroadcasters({
          ...data,
          data: [...broadcasters.data, ...data.data],
        });
      });
    }
  };

  return (
    <>
      <Site title="Browse Broadcasters"></Site>
      <Grid fluid>
        <div className="lg:px-0 px-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <InertiaLink
                href="/browse"
                className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:inline hidden bg-primary text-white-light"
              >
                Broadcasters
              </InertiaLink>
              <button
                className={`px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:hidden inline ${
                  broadcasters
                    ? "bg-primary text-white-light"
                    : "bg-secondary lg:block hidden"
                }`}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Broadcasters
              </button>

              <InertiaLink
                href="/browse/categories"
                className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:inline hidden bg-secondary"
              >
                Categories
              </InertiaLink>

              <ReactModal
                isOpen={isOpen}
                className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
                overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
              >
                <div className="bg-dark mx-3 border rounded-md z-50 p-2 w-full">
                  <p className="uppercase border-b pb-2 mb-2 font-semibold flex justify-between">
                    <span>Browse:</span>
                    <button
                      className="focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </p>
                  <InertiaLink
                    href="/browse/broadcasters"
                    className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none bg-primary block mb-2 text-center"
                  >
                    Broadcasters
                  </InertiaLink>
                  <InertiaLink
                    href="/browse/categories"
                    className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none bg-secondary block text-center"
                  >
                    Categories
                  </InertiaLink>
                </div>
              </ReactModal>
            </div>
            <div className="px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none border">
              <i className="fas fa-fire"></i> Trending
            </div>
          </div>

          {broadcasters && (
            <InfiniteScroll
              dataLength={broadcasters.to}
              next={getBroadcasters}
              hasMore={!!broadcasters.next_page_url}
              loader={
                <>
                  {[...Array(4)].map((value, key) => (
                    <BoxSkeleton key={key}></BoxSkeleton>
                  ))}
                </>
              }
              style={{ overflow: "none" }}
              className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2 justify-items-stretch"
            >
              {broadcasters?.data.map((broadcaster, index) => {
                return (
                  <InertiaLink
                    key={broadcaster.id}
                    href={`/broadcaster/${broadcaster.login}`}
                    className="relative block"
                  >
                    <div className="absolute top-0 left-0 mt-2 ml-2 flex items-center">
                      <p className="bg-gray px-2 rounded-md mr-1 text-xs">
                        {index + 1}
                      </p>
                      {broadcaster.subscriptions &&
                        (broadcaster.type ? (
                          <span className="bg-red-600 rounded-full w-10 align-middle font-semibold text-center text-xs uppercase text-white-light">
                            Live
                          </span>
                        ) : (
                          <span className="bg-gray rounded-full w-16 align-middle font-semibold text-center text-xs uppercase">
                            Offline
                          </span>
                        ))}
                    </div>
                    {!!broadcaster.partner && (
                      <div className="absolute top-0 right-0 mt-1 mr-2">
                        <img
                          src={`${
                            asset_url ? asset_url : ""
                          }/images/partner.png`}
                          alt="partner"
                        />
                      </div>
                    )}
                    <img
                      src={broadcaster.avatar}
                      alt="avatar"
                      className="hover:ring-2 ring-primary"
                      width="300"
                      height="300"
                      onError={(e) => {
                        e.currentTarget.src = `${
                          asset_url ? asset_url : ""
                        }/images/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png`;
                      }}
                    />
                    <div className="absolute bottom-0 w-full h-auto bg-dark bg-opacity-80 lg:text-2xl p-2 break-all">
                      {broadcaster.display_name}
                    </div>
                  </InertiaLink>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Browse.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Browse;
