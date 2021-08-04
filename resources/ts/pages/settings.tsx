import React, { useState } from "react";

import { Category } from "../types/category";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import Layout from "@shared/layout";
import Site from "@shared/site";
import type { User } from "../types/user";
import axios from "axios";
import { useEffect } from "react";

const Settings = ({ auth }: { auth: User }): JSX.Element => {
  const [broadcasters, setBroadcasters] = useState<{
    loading: boolean;
    data: User[];
    search: string;
  }>();
  const [categories, setCategories] = useState<{
    loading: boolean;
    data: Category[];
    search: string;
  }>();

  useEffect(() => {
    setBroadcasters({ loading: true, data: [], search: "" });
    axios.get("/json/browse/broadcasters?blocked=true").then(({ data }) => {
      setBroadcasters({ loading: false, data: data, search: "" });
    });
  }, []);

  useEffect(() => {
    setCategories({ loading: true, data: [], search: "" });
    axios.get("/json/browse/categories?blocked=true").then(({ data }) => {
      setCategories({ loading: false, data: data, search: "" });
    });
  }, []);

  return (
    <>
      <Site title="Settings"></Site>
      <Grid fluid>
        <div className="lg:px-0 px-2">
          <p className="text-2xl font-bold mb-3">Account settings</p>
          <p className="border-b pb-2 text-muted mb-2 uppercase font-bold text-xs">
            Notification
          </p>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">Activity on my profile</p>
              <p className="text-muted">
                Notify me about comments and other activity on my clip
              </p>
            </div>
            <input
              id="notify-comments"
              type="checkbox"
              className="offscreen"
              checked={auth.notify_comments}
              onChange={() =>
                Inertia.patch(`/settings/${auth.id}/notify_comments`)
              }
            />
            <label
              htmlFor="notify-comments"
              className="switch cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">Replies to my comments</p>
              <p className="text-muted">
                Notify me about replies to my comments
              </p>
            </div>
            <input
              id="notify-replies"
              type="checkbox"
              className="offscreen"
              checked={auth.notify_replies}
              onChange={() =>
                Inertia.patch(`/settings/${auth.id}/notify_replies`)
              }
            />
            <label htmlFor="notify-replies" className="switch cursor-pointer" />
          </div>
          <p className="border-b pb-2 text-muted mb-2 uppercase font-bold text-xs">
            Blocked Broadcasters
          </p>
          <div className="flex items-center w-60 pr-3 text-base bg-gray group hover:bg-black border transition duration-300 mb-2 rounded-full float-right">
            <input
              type="text"
              name="search-blocked-broadcasters"
              id="search-blocked-broadcasters"
              placeholder="Search"
              className="w-full pl-3 py-2 bg-gray focus:outline-none group-hover:bg-black transition duration-300 text-white rounded-full"
              autoComplete="off"
              autoCorrect="off"
              onChange={(e) => {
                if (broadcasters) {
                  setBroadcasters({ ...broadcasters, search: e.target.value });
                }
              }}
            />
            <div className="hover:text-primary justify-self-stretch cursor-pointer">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="border w-full h-52 overflow-auto mb-2">
            {broadcasters?.data
              ?.filter((item) => {
                if (broadcasters?.search) {
                  return broadcasters?.search
                    ?.toLowerCase()
                    .split(" ")
                    .every((v) => item.login.toLowerCase().includes(v));
                }

                return broadcasters?.data;
              })
              .map((broadcaster) => {
                return (
                  <div
                    key={broadcaster.id}
                    className="flex items-center border-b p-2 justify-between"
                  >
                    <InertiaLink
                      href={`/broadcaster/${broadcaster.login}`}
                      className="flex"
                    >
                      <img
                        src={broadcaster.avatar.replace(/\d+x\d+/g, "28x28")}
                        alt="broadcaster"
                        className="mr-2"
                      />
                      <p className="text-lg">{broadcaster.display_name}</p>
                    </InertiaLink>
                    <button
                      className="bg-secondary hover:bg-opacity-80 rounded-md px-3 py-1"
                      onClick={() => {
                        setBroadcasters({
                          ...broadcasters,
                          data: broadcasters?.data.filter(
                            (value) => value.id !== broadcaster.id
                          ),
                        });
                        axios.patch(`/unblock/${broadcaster.id}/broadcaster`);
                      }}
                    >
                      Unblock
                    </button>
                  </div>
                );
              })}
            {broadcasters?.loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="spinner w-[35px] h-[35px]"></div>
              </div>
            ) : (
              !broadcasters?.data.length && (
                <div className="flex items-center justify-center w-full h-full text-center">
                  <div className="flex flex-col">
                    <p className="text-2xl">You aren’t blocking anyone</p>
                    <p className="text-xs text-muted">
                      When you block a broadcaster, their clips won’t show on
                      popular, browse and category.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
          <p className="border-b pb-2 text-muted mb-2 uppercase font-bold text-xs">
            Blocked Categories
          </p>
          <div className="flex items-center w-60 pr-3 text-base bg-gray group hover:bg-black border transition duration-300 mb-2 rounded-full float-right">
            <input
              type="text"
              name="search-blocked-categories"
              id="search-blocked-categories"
              placeholder="Search"
              className="w-full pl-3 py-2 bg-gray focus:outline-none group-hover:bg-black transition duration-300 text-white rounded-full"
              autoComplete="off"
              autoCorrect="off"
              onChange={(e) => {
                if (categories) {
                  setCategories({ ...categories, search: e.target.value });
                }
              }}
            />
            <div className="hover:text-primary justify-self-stretch cursor-pointer">
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div className="border w-full h-52 overflow-auto mb-2">
            {categories?.data
              ?.filter((item) => {
                if (categories?.search) {
                  return categories?.search
                    ?.toLowerCase()
                    .split(" ")
                    .every((v) => item.name.toLowerCase().includes(v));
                }

                return categories?.data;
              })
              .map((category) => {
                return (
                  <div
                    key={category.id}
                    className="flex items-center border-b p-2 justify-between"
                  >
                    <InertiaLink
                      href={`/category/${category.name}`}
                      className="flex"
                    >
                      <img
                        src={category.box_art_url?.replace(
                          /{width}x{height}/g,
                          "52x69"
                        )}
                        alt="broadcaster"
                        className="mr-2"
                      />
                      <p className="text-lg">{category.name}</p>
                    </InertiaLink>
                    <button
                      className="bg-secondary hover:bg-opacity-80 rounded-md px-3 py-1"
                      onClick={() => {
                        setCategories({
                          ...categories,
                          data: categories?.data.filter(
                            (value) => value.id !== category.id
                          ),
                        });
                        axios.patch(`/unblock/${category.id}/category`);
                      }}
                    >
                      Unblock
                    </button>
                  </div>
                );
              })}
            {categories?.loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <div className="spinner w-[35px] h-[35px]"></div>
              </div>
            ) : (
              !categories?.data.length && (
                <div className="flex items-center justify-center w-full h-full text-center">
                  <div className="flex flex-col">
                    <p className="text-2xl">You aren’t blocking any category</p>
                    <p className="text-xs text-muted">
                      When you block a category, the clips won’t show on
                      popular, browse, broadcaster, user, upvotes and downvotes.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Settings.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Settings;
