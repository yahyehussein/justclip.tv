import { InertiaLink, usePage } from "@inertiajs/inertia-react";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isAdminister, isGlobalModerator } from "../utils";

import { Inertia } from "@inertiajs/inertia";
import { Menu } from "@headlessui/react";
import Notifications from "@shared/notifications";
import Tippy from "@tippyjs/react";
import { delegate } from "tippy.js";
import { useCookies } from "react-cookie";

const Layout = ({ children }: { children: JSX.Element }): JSX.Element => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookieSettings"]);

  const { asset_url, auth, flash, errors } = usePage().props;

  const isAdmin = auth?.roles?.find((role) => isAdminister(role));
  const isGlobalMod = auth?.roles?.find((role) => isGlobalModerator(role));

  const [q, setQ] = useState("");

  useEffect(() => {
    delegate("#global-tooltip", {
      target: ".emote",
    });
    delegate("#global-tooltip", {
      target: ".tippy-next",
      allowHTML: true,
      theme: "tippy-next",
      placement: "top",
    });
  }, []);

  useEffect(() => {
    if (flash.message) {
      toast.dark(flash.message, {
        autoClose: false,
      });
    }
  }, [flash.message]);

  useEffect(() => {
    const keys = Object.keys(errors);

    if (keys) {
      keys.forEach((key) => {
        toast.dark(
          <div>
            <p>{key}</p>
            <p>{errors[key]}</p>
          </div>,
          {
            autoClose: false,
          }
        );
      });
    }
  }, [errors]);

  return (
    <div id="global-tooltip">
      <div className="container flex items-center justify-between px-3 pt-4 mx-auto mb-2">
        <div className="flex items-center">
          <InertiaLink href="/" className="block mr-2 text-2xl lg:hidden">
            <img
              src={`${asset_url ? asset_url : ""}/images/logo_m.png`}
              alt="logo"
              width="30"
            />
          </InertiaLink>
          <Tippy content="Browse" className="hidden lg:block">
            <InertiaLink href="/browse" className="mr-4 text-2xl lg:text-3xl">
              <i className="far fa-window-restore hover:text-primary"></i>
            </InertiaLink>
          </Tippy>
          <InertiaLink href="/" className="hidden mr-3 lg:block">
            <img
              src={`${asset_url ? asset_url : ""}/images/logo.png`}
              alt="logo"
              style={{ minWidth: "180px", maxWidth: "180px" }}
            />
          </InertiaLink>
          {/* <div className="items-center hidden pr-6 mr-3 text-base transition duration-300 border rounded-full lg:flex w-80 bg-gray group hover:bg-black">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              className="w-full py-3 pl-6 text-white transition duration-300 rounded-full bg-gray focus:outline-none group-hover:bg-black"
              autoComplete="off"
              autoCorrect="off"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (q) {
                    Inertia.visit(`/search?q=${q}`);
                  }
                }
              }}
            />
            <div
              className="cursor-pointer hover:text-primary justify-self-stretch"
              onClick={() => {
                if (q) {
                  Inertia.visit(`/search?q=${q}`);
                }
              }}
            >
              <i className="fas fa-search"></i>
            </div>
          </div> */}
        </div>
        {auth ? (
          <div className="relative items-center hidden text-3xl lg:flex">
            <Notifications></Notifications>
            <Tippy content="Upload Clip">
              <InertiaLink href="/upload" className="mr-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="38"
                  height="38"
                  viewBox="0 0 20 20"
                  x="0px"
                  y="0px"
                  className="text-white fill-current hover:fill-current hover:text-primary"
                >
                  <g>
                    <path d="M14.594 4.495l-.585-1.91L15.922 2l.585 1.91-1.913.585zM11.14 3.46l.585 1.911 1.913-.584-.585-1.91-1.913.583zM8.856 6.247l-.584-1.91 1.912-.584.585 1.91-1.913.584zM5.403 5.213l.584 1.91L7.9 6.54l-.585-1.911-1.912.584zM2.534 6.09L3.118 8l1.913-.584-.585-1.91-1.912.583zM5 9H3v7a2 2 0 002 2h10a2 2 0 002-2V9h-2v7H5V9z"></path>
                    <path d="M8 9H6v2h2V9zM9 9h2v2H9V9zM14 9h-2v2h2V9z"></path>
                  </g>
                </svg>
              </InertiaLink>
            </Tippy>
            {(isAdmin || isGlobalMod) && (
              <Tippy content="Reports">
                <InertiaLink href="/clip/reports" className="mr-5">
                  <i className="far fa-flag hover:text-primary"></i>
                </InertiaLink>
              </Tippy>
            )}
            <Tippy content="Settings">
              <InertiaLink href="/settings" className="mr-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  className="text-white fill-current hover:fill-current hover:text-primary"
                >
                  <path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z" />
                </svg>
              </InertiaLink>
            </Tippy>
            <Tippy content="Logout">
              <InertiaLink href="/logout" className="mr-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  className="text-white fill-current hover:fill-current hover:text-primary"
                >
                  <path d="M14 19v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.576-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.424 0 2.774-.302 4-.838v-2.162zm4-9.592l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7z" />
                </svg>
              </InertiaLink>
            </Tippy>
            <Tippy content={auth.display_name}>
              <InertiaLink href={`/${auth.login}`}>
                <img
                  src={auth.avatar.replace(/\d+x\d+/g, "70x70")}
                  alt="avatar"
                  className="ring-2 ring-primary"
                  width="36"
                  height="36"
                  onError={(e) => {
                    e.currentTarget.src = `${
                      asset_url ? asset_url : ""
                    }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                  }}
                />
              </InertiaLink>
            </Tippy>
          </div>
        ) : (
          <div className="hidden lg:block">
            <a
              href="/login"
              className="flex items-center px-6 py-2 space-x-1 text-lg font-semibold transition rounded-full bg-twitch hover:bg-opacity-80 text-white-light"
            >
              <i className="mt-1 fab fa-twitch"></i>
              <span>Connect with Twitch</span>
            </a>
          </div>
        )}

        {/* mobile */}

        <div className="block lg:hidden">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="z-10 focus:outline-none">
                  <i className="text-2xl fas fa-bars hover:text-primary"></i>
                </Menu.Button>
                {open && (
                  <div className="fixed top-0 left-0 z-20 w-screen h-screen bg-dark bg-opacity-80"></div>
                )}
                <Menu.Items className="absolute top-0 right-0 z-50 flex flex-col w-full py-3 text-left border-t border-b bg-dark whitespace-nowrap">
                  <div className="flex items-center justify-between px-2 pb-3 mb-3 border-b">
                    {auth ? (
                      <Menu.Item>
                        <InertiaLink
                          href={`/${auth.login}`}
                          className="flex items-center"
                        >
                          <img
                            src={auth.avatar.replace(/\d+x\d+/g, "70x70")}
                            alt="avatar"
                            className="mr-2 ring-2 ring-primary"
                            width="36"
                            height="36"
                          />
                          <div className="flex flex-col">
                            <span>{auth.display_name}</span>
                            <span className="text-xs text-muted">Clipper</span>
                          </div>
                        </InertiaLink>
                      </Menu.Item>
                    ) : (
                      <Menu.Item>
                        <a
                          href="/login"
                          className="flex items-center justify-center px-6 py-2 rounded-full bg-twitch text-white-light"
                        >
                          <i className="mt-1 mr-1 fab fa-twitch"></i>
                          <span>Connect with Twitch</span>
                        </a>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <i className="text-2xl fas fa-times text-primary"></i>
                    </Menu.Item>
                  </div>
                  <div className="px-2">
                    <div className="flex items-center w-full pr-6 mb-3 text-base border rounded-full bg-dark">
                      <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                        className="w-full py-3 pl-6 rounded-full bg-dark focus:outline-none"
                        autoComplete="off"
                        autoCorrect="off"
                        value={q}
                        onChange={(e) => {
                          setQ(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (q) {
                              Inertia.visit(`/search?q=${q}`);
                            }
                          }
                        }}
                      />
                      <Menu.Item>
                        <div
                          className="cursor-pointer justify-self-stretch"
                          onClick={() => {
                            if (q) {
                              Inertia.visit(`/search?q=${q}`);
                            }
                          }}
                        >
                          <i className="fas fa-search"></i>
                        </div>
                      </Menu.Item>
                    </div>
                    <Menu.Item>
                      <InertiaLink
                        href="/popular"
                        className="flex items-center mb-3"
                      >
                        <i className="mr-2 fas fa-fire fa-fw"></i>
                        <span>Popular</span>
                      </InertiaLink>
                    </Menu.Item>
                    <Menu.Item>
                      <InertiaLink
                        href="/clippers/leaderboard"
                        className="flex items-center mb-3"
                      >
                        <i className="mr-2 fas fa-list-ol fa-fw"></i>
                        <span>Leaderboards</span>
                      </InertiaLink>
                    </Menu.Item>
                    <Menu.Item>
                      <InertiaLink
                        href="/terms"
                        className="flex items-center mb-3"
                      >
                        <i className="mr-2 fas fa-gavel fa-fw"></i>
                        <span>Terms</span>
                      </InertiaLink>
                    </Menu.Item>
                    <Menu.Item>
                      <InertiaLink
                        href="/content-policy"
                        className="flex items-center mb-3"
                      >
                        <i className="mr-2 fas fa-video fa-fw"></i>
                        <span>Content Policy</span>
                      </InertiaLink>
                    </Menu.Item>
                    <Menu.Item>
                      <InertiaLink
                        href="/privacy-policy"
                        className="flex items-center mb-3"
                      >
                        <i className="mr-2 fas fa-user-shield fa-fw"></i>
                        <span>Privacy Policy</span>
                      </InertiaLink>
                    </Menu.Item>
                    <Menu.Item>
                      <InertiaLink href="/dmca" className="flex items-center">
                        <i className="mr-2 far fa-copyright fa-fw"></i>
                        <span>DMCA</span>
                      </InertiaLink>
                    </Menu.Item>
                    {auth && (
                      <>
                        <Menu.Item>
                          <InertiaLink
                            href="/upload"
                            className="block w-full px-6 py-2 my-3 text-center rounded-full bg-secondary"
                          >
                            Upload
                          </InertiaLink>
                        </Menu.Item>
                        <Menu.Item>
                          <InertiaLink
                            href="/settings"
                            className="block w-full px-6 py-2 my-3 text-center rounded-full bg-secondary"
                          >
                            Account Settings
                          </InertiaLink>
                        </Menu.Item>
                        <Menu.Item>
                          <InertiaLink
                            href="/logout"
                            className="block w-full px-6 py-2 text-center rounded-full bg-secondary"
                          >
                            Log Out
                          </InertiaLink>
                        </Menu.Item>
                      </>
                    )}
                  </div>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
      </div>
      {children}
      {!!!cookies.cookieSettings && (
        <div className="fixed z-50 flex items-center justify-center w-full bottom-2">
          <div className="container flex items-center p-2 border-l-4 rounded-md shadow border-primary bg-dark">
            <div className="text-sm">
              <p className="mb-1">
                Do you mind if we use optional cookies to provide you
                personalized content and to analyze site traffic (including
                Google Analytics)?
              </p>
              <p>
                We don&apos;t use a lot of cookies; you can see and manage them
                at any time on our{" "}
                <InertiaLink
                  href="/account/cookiepreferences"
                  className="text-primary hover:underline"
                >
                  Cookie Settings page.
                </InertiaLink>
                . If you click &apos;Accept All,&apos; you consent to the use of
                cookies on Justclip websites. Learn more about cookies in our{" "}
                <InertiaLink
                  href="/privacy-policy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </InertiaLink>
                .
              </p>
            </div>
            <div className="flex flex-col flex-shrink-0">
              <button
                className="px-3 py-1 mb-2 rounded-full bg-primary hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  setCookie("cookieSettings", "true", {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365,
                  });
                }}
              >
                Accept All
              </button>
              <button
                className="px-3 py-1 rounded-full bg-secondary hover:bg-opacity-80 focus:outline-none"
                onClick={() => {
                  removeCookie("cookieSettings", {
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365,
                  });
                }}
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        pauseOnHover
        closeOnClick
      ></ToastContainer>
    </div>
  );
};

export default Layout;
