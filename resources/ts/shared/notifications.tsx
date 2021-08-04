import React, { useEffect, useState } from "react";

import Hashids from "hashids";
import { InertiaLink } from "@inertiajs/inertia-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Menu } from "@headlessui/react";
import type { Notification } from "../types/notification";
import NotificationSkeleton from "./skeleton/notification";
import { Pagination } from "../types/pagination";
import Tippy from "@tippyjs/react";
import axios from "axios";
import { formatText } from "../utils";
import moment from "moment";

const hashids = new Hashids("justclip");

const Notifications = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Pagination<Notification>>({
    data: [],
    next_page_url: "/json/notifications?page=1",
    to: 12,
  });

  const getNotifications = () => {
    axios.get(`${notifications.next_page_url}`).then(({ data }) => {
      setNotifications({
        ...data,
        data: [...notifications.data, ...data.data],
      });
    });
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button className="focus:outline-none z-10">
            <Tippy content="Notifications">
              <div className="relative mr-5">
                {!!notifications.unread && (
                  <span className="absolute -top-0.5 -right-1.5 inline-flex rounded-full h-3 w-3 bg-primary">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  </span>
                )}
                <i
                  className={`far fa-bell hover:text-primary ${
                    open ? "text-primary" : ""
                  }`}
                ></i>
              </div>
            </Tippy>
          </Menu.Button>
          <Menu.Items className="absolute top-[59px] right-0 w-[475px] z-50 bg-dark border rounded-md shadow-md text-base">
            <div className="p-4 flex justify-between items-center">
              <p className="text-lg font-bold">
                <i className="far fa-bell"></i> Notifications
              </p>
              <button
                className="text-primary hover:underline text-sm font-semibold focus:outline-none"
                onClick={() => {
                  setNotifications({ ...notifications, unread: 0 });
                  axios.patch(`/notifications/all`);
                }}
              >
                Mark all as read ({notifications.unread})
              </button>
            </div>
            <div id="notifications" className="h-[400px] overflow-auto">
              <InfiniteScroll
                dataLength={notifications.to}
                next={getNotifications}
                hasMore={!!notifications.next_page_url}
                loader={<NotificationSkeleton></NotificationSkeleton>}
                endMessage={
                  <div className="border-t py-2">
                    <p className="text-center text-xl font-bold">
                      You&apos;re all caught up. What a pro!
                    </p>
                    <p className="text-center">You have no notifications.</p>
                  </div>
                }
                scrollableTarget="notifications"
              >
                {notifications?.data.map((notification) => {
                  return (
                    <Menu.Item key={notification.id}>
                      <InertiaLink
                        href={`/clip/${notification.data.clip.slug}${
                          notification.data.comment
                            ? `/${hashids.encode(notification.data.comment.id)}`
                            : ""
                        }`}
                        onClick={() => {
                          setNotifications({ ...notifications, unread: 0 });
                          axios.patch(`/notifications/${notification.id}`);
                        }}
                        className="border-t flex hover:bg-secondary relative"
                      >
                        <div className="mr-4 text-xl py-4 pl-4">
                          {notification.data.type === "similar" && (
                            <i className="far fa-trash-alt text-red-persimmon fa-fw"></i>
                          )}
                          {notification.data.type === "upvote" && (
                            <i className="fas fa-arrow-up text-primary fa-fw"></i>
                          )}
                          {notification.data.type === "downvote" && (
                            <i className="fas fa-arrow-down text-red-persimmon fa-fw"></i>
                          )}
                          {notification.data.type === "comment" && (
                            <i className="fas fa-comment-alt fa-fw"></i>
                          )}
                          {notification.data.type === "reply" && (
                            <i className="fas fa-comments fa-fw"></i>
                          )}
                        </div>
                        <div className="flex flex-col items-start w-full py-4 pr-4">
                          {notification.data.type === "similar" ? (
                            <>
                              <img
                                src="https://static-cdn.jtvnw.net/jtv_user_pictures/9c9c8cc9-19c5-4e51-afd2-4c224effa120-profile_image-70x70.png"
                                alt="avatar"
                                className="mb-2"
                                width="32"
                                height="32"
                              />
                              <p>Justclip</p>
                              <p className="text-muted mb-1">
                                Similar clip:{" "}
                                <span className="text-primary hover:underline">
                                  {notification.data.clip.title}
                                </span>
                              </p>
                            </>
                          ) : (
                            <img
                              src={notification.data.user.avatar}
                              alt="avatar"
                              className="mb-2"
                              width="32"
                              height="32"
                            />
                          )}
                          {notification.data.type === "upvote" && (
                            <>
                              <p>
                                {notification.data.user.display_name} upvoted
                                your clip
                              </p>
                              <p className="text-muted mb-1">
                                {notification.data.clip?.title}
                              </p>
                              <div className="flex items-center">
                                <div className="bg-primary px-2 py-1 rounded-full text-xs mr-1 font-semibold text-white-light">
                                  {notification.data.clip?.category?.name}
                                </div>
                                <div className="bg-primary px-2 py-1 rounded-full text-xs mr-1 font-semibold text-white-light">
                                  {
                                    notification.data.clip?.broadcaster
                                      .display_name
                                  }
                                </div>
                              </div>
                            </>
                          )}
                          {notification.data.type === "downvote" && (
                            <>
                              <p>
                                {notification.data.user.display_name} downvoted
                                your clip
                              </p>
                              <p className="text-muted mb-1">
                                {notification.data.clip?.title}
                              </p>
                              <div className="bg-primary px-2 py-1 rounded-full text-xs mr-1 font-semibold text-white-light">
                                {notification.data.clip?.category?.name}
                              </div>
                            </>
                          )}
                          {notification.data.comment && (
                            <>
                              {notification.data.type === "comment" && (
                                <>
                                  <div className="overflow-hidden h-10">
                                    <p>
                                      {notification.data.user.display_name}{" "}
                                      comment: &quot;
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: formatText(
                                            notification.data.comment.text,
                                            notification.data.comment.emotes
                                          ),
                                        }}
                                      ></span>
                                      &quot;
                                    </p>
                                  </div>
                                </>
                              )}
                              {notification.data.type === "reply" && (
                                <>
                                  <div className="overflow-hidden max-h-32">
                                    <p>
                                      {notification.data.user.display_name}{" "}
                                      replied: &quot;
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: formatText(
                                            notification.data.comment.text,
                                            notification.data.comment.emotes
                                          ),
                                        }}
                                      ></span>
                                      &quot;
                                    </p>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          <p className="text-muted text-sm">
                            {moment(notification.created_at).fromNow()}
                          </p>
                        </div>
                        {notification.read_at && (
                          <div className="absolute top-0 w-full h-full bg-dark bg-opacity-50"></div>
                        )}
                        <button
                          className="absolute top-3 right-5 focus:outline-none"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            axios.delete(`/notifications/${notification.id}`);
                            const data = notifications.data.filter(
                              (item) => item.id !== notification.id
                            );
                            setNotifications({
                              ...notifications,
                              data,
                            });
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </InertiaLink>
                    </Menu.Item>
                  );
                })}
              </InfiniteScroll>
            </div>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

export default Notifications;
