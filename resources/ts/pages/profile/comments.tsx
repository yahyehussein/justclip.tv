import React, { useEffect } from "react";

import type { Clip } from "../../types/clip";
import Comment from "@shared/comment";
import CommentPlaceholder from "@shared/placeholder/user-comment";
import CommentSkeleton from "@shared/skeleton/user-comment";
import { InertiaLink } from "@inertiajs/inertia-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../../types/pagination";
import Profile from "@shared/profile";
import Site from "@shared/site";
import SortClips from "@shared/sort-clips";
import type { User } from "../../types/user";
import axios from "axios";
import { clipContext } from "@context/clipContext";
import moment from "moment";
import { useRemember } from "@inertiajs/inertia-react";

const Comments = ({
  auth,
  asset_url,
  user,
}: {
  auth: User;
  asset_url: string;
  user: User;
}): JSX.Element => {
  const [sortBy, setSortBy] = useRemember("&hot=true", "sort");
  const [comments, setComments] = useRemember<Pagination<Clip>>(
    {
      data: [],
      next_page_url: `/json/${user.id}/comments?page=1${sortBy}`,
      to: 20,
    },
    "comments"
  );
  const [empty, setEmpty] = useRemember(false, "empty");

  const getComments = async () => {
    if (comments.next_page_url) {
      axios.get(`${comments.next_page_url}`).then(({ data }) => {
        setComments({ ...data, data: [...comments.data, ...data.data] });
        setEmpty(!!!data.from);
      });
    }
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setComments({
      data: [],
      next_page_url: `/json/${user.id}/comments?page=1${sortBy}`,
      to: 10,
    });
    axios.get(`/json/${user.id}/comments?page=1${sortBy}`).then(({ data }) => {
      setComments(data);
      setEmpty(!!!data.from);
    });
  };

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Site title={`${user.login}'s Comments`}></Site>
      <Profile asset_url={asset_url} auth={auth} user={user}>
        <div className="flex justify-end mt-2 space-x-3 font-semibold items-center">
          <SortClips onSort={onSort} comments></SortClips>
        </div>
        <div className="mt-2">
          <InfiniteScroll
            dataLength={comments.to ?? 0}
            next={getComments}
            hasMore={!!comments.next_page_url}
            loader={[...Array(2)].map((value, key) => (
              <CommentSkeleton key={key}></CommentSkeleton>
            ))}
            style={{ overflow: "none" }}
          >
            {comments.data.map((clip) => {
              return (
                <clipContext.Provider
                  key={clip.id}
                  value={{ ...clip, auth: auth }}
                >
                  <div className="bg-dark lg:mb-3 lg:border-b">
                    <InertiaLink
                      href={`/clip/${clip.slug}`}
                      className="border-t lg:border-r lg:border-l px-4 py-4 flex justify-between items-center group hover:border-muted"
                    >
                      <div className="flex flex-col">
                        <p className="text-xs text-muted">
                          {moment(clip.created_at).fromNow()} -{" "}
                          {user.display_name} commented on
                        </p>
                        <p className="font-bold text-lg text-primary group-hover:underline leading-4">
                          {clip.title}
                          {clip.spoiler ? (
                            <span className="border border-gray-chateau text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md font-semibold text-gray-chateau leading-3">
                              spoiler
                            </span>
                          ) : null}
                          {clip.tos ? (
                            <span className="border border-red-persimmon text-xs px-1 pb-1 inline-block align-middle ml-1 rounded-md text-red-persimmon font-semibold leading-3">
                              tos
                            </span>
                          ) : null}
                        </p>
                      </div>
                      {clip.spoiler || clip.tos ? (
                        <div className="overflow-hidden">
                          <img
                            src={clip.thumbnail}
                            width={90}
                            height={50}
                            alt="thumbnail"
                            className="blur-player"
                          />
                        </div>
                      ) : (
                        <img
                          src={clip.thumbnail}
                          width={90}
                          height={50}
                          alt="thumbnail"
                        />
                      )}
                    </InertiaLink>
                    {clip.comments.map((comment) => {
                      return (
                        <Comment
                          key={comment.id}
                          comment={comment}
                          asset_url={asset_url}
                          className="lg:border-l border-t lg:border-r px-4 pt-4"
                        ></Comment>
                      );
                    })}
                  </div>
                </clipContext.Provider>
              );
            })}
          </InfiniteScroll>
          {empty && (
            <div className="relative">
              <CommentPlaceholder></CommentPlaceholder>
              <CommentPlaceholder></CommentPlaceholder>
              <div className="absolute w-full h-full bg-dark bg-opacity-70 flex items-center justify-center top-0 px-16 flex-col">
                <p className="text-2xl text-center mb-2">
                  hmm... {user.display_name} hasn&apos;t commented on anything
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
Comments.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Comments;
