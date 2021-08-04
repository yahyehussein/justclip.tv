import { InertiaLink, useRemember } from "@inertiajs/inertia-react";
import React, { useState } from "react";

import BoxSkeleton from "@shared/skeleton/box";
import type { Category } from "../../types/category";
import Grid from "@shared/grid";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import ReactModal from "react-modal";
import Site from "@shared/site";
import axios from "axios";
import numeral from "numeral";

const Browse = ({
  category,
}: {
  category: Pagination<Category>;
}): JSX.Element => {
  const [categories, setCategories] = useRemember<Pagination<Category>>(
    category
  );
  const [isOpen, setIsOpen] = useState(false);

  const getCategories = () => {
    setIsOpen(false);

    if (categories.next_page_url) {
      axios.get(`${categories.next_page_url}`).then(({ data }) => {
        setCategories({ ...data, data: [...categories.data, ...data.data] });
      });
    }
  };

  return (
    <>
      <Site title="Browse Categories"></Site>
      <Grid fluid>
        <div>
          <div className="flex items-center justify-between mb-3 lg:px-0 px-2">
            <div>
              <InertiaLink
                href="/browse"
                className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:inline hidden bg-secondary"
              >
                Broadcasters
              </InertiaLink>

              <InertiaLink
                href="/browse/categories"
                className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:inline hidden bg-primary text-white-light"
              >
                Categories
              </InertiaLink>
              <button
                className={`px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none lg:hidden inline ${
                  categories
                    ? "bg-primary text-white-light"
                    : "bg-secondary lg:block hidden"
                }`}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Categories
              </button>

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
                    href="/browse"
                    className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none bg-secondary block text-center mb-2"
                  >
                    Broadcasters
                  </InertiaLink>

                  <InertiaLink
                    href="/browse/categories"
                    className="px-2 py-1 rounded-full mr-1 hover:bg-opacity-80 font-semibold focus:outline-none bg-primary block text-center"
                  >
                    Categories
                  </InertiaLink>
                </div>
              </ReactModal>
            </div>
            <div className="px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none border">
              <i className="fas fa-sort-amount-up"></i> Most popular
            </div>
          </div>

          {categories && (
            <InfiniteScroll
              dataLength={categories.to}
              next={getCategories}
              hasMore={!!categories.next_page_url}
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
              {categories?.data.map((category) => {
                return (
                  <InertiaLink
                    key={category.id}
                    href={`/category/${category.name}`}
                    className="relative block"
                  >
                    <p className="bg-gray px-2 pb-1 rounded-md mr-1 text-xs absolute top-0 left-0 mt-2 ml-2">
                      <span className="inline-block align-middle pt-0.5">
                        {numeral(category.clips_count).format("0.[0]a")}
                      </span>
                      &nbsp;
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 20 20"
                        x="0px"
                        y="0px"
                        className="fill-current text-white inline-block align-middle"
                      >
                        <g>
                          <path d="M14.594 4.495l-.585-1.91L15.922 2l.585 1.91-1.913.585zM11.14 3.46l.585 1.911 1.913-.584-.585-1.91-1.913.583zM8.856 6.247l-.584-1.91 1.912-.584.585 1.91-1.913.584zM5.403 5.213l.584 1.91L7.9 6.54l-.585-1.911-1.912.584zM2.534 6.09L3.118 8l1.913-.584-.585-1.91-1.912.583zM5 9H3v7a2 2 0 002 2h10a2 2 0 002-2V9h-2v7H5V9z"></path>
                          <path d="M8 9H6v2h2V9zM9 9h2v2H9V9zM14 9h-2v2h2V9z"></path>
                        </g>
                      </svg>
                    </p>
                    <img
                      src={category.box_art_url?.replace(
                        /{width}x{height}/g,
                        "285x380"
                      )}
                      alt="category"
                      className="hover:ring-2 ring-twitch h-auto w-full"
                      width="285"
                      height="380"
                    />
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
