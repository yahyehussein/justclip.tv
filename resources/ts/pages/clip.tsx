import React, { useEffect, useState } from "react";

import Clip from "@shared/clip";
import type { Clip as ClipType } from "../types/clip";
import Comment from "@shared/comment";
import CommentSkeleton from "@shared/skeleton/comment";
import type { Comment as CommentType } from "../types/comment";
import Grid from "@shared/grid";
import { InertiaLink } from "@inertiajs/inertia-react";
import InfiniteScroll from "react-infinite-scroll-component";
import Layout from "@shared/layout";
import type { Pagination } from "../types/pagination";
import Site from "@shared/site";
import SortComments from "@shared/sort-comments";
import Textarea from "@shared/textarea";
import type { User } from "../types/user";
import axios from "axios";
import { clipContext } from "@context/clipContext";
import { isMobile } from "../utils";

interface Emote {
  id: string | number;
  urls: Record<number, string>;
  code: string;
  name: string;
}

const ClipPage = (props: {
  asset_url: string;
  clip: ClipType;
  clips?: ClipType[];
  auth?: User;
  following?: boolean;
  comment_id?: string;
}): JSX.Element => {
  const [sortBy, setSortBy] = useState("&best=true");
  const [comments, setComments] = useState<Pagination<CommentType>>({
    data: [],
    next_page_url: `/json/comments?page=1&clip_id=${props.clip.id}${props.comment_id}${sortBy}`,
    to: 20,
  });
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const [following, setFollowing] = useState(props.following);

  const getComments = () => {
    axios.get(`${comments.next_page_url}`).then(({ data }) => {
      setComments({ ...data, data: [...data.data, ...comments.data] });
    });
  };

  const onSort = (sortBy: string) => {
    setSortBy(sortBy);
    setComments({
      data: [],
      next_page_url: `/json/comments?page=1&clip_id=${props.clip.id}${props.comment_id}${sortBy}`,
      to: 10,
    });
  };

  const onCommentPost = (comment: CommentType) => {
    setComments({
      ...comments,
      data: [{ ...comment }, ...comments.data],
      next_page_url: comments.data.length ? comments.next_page_url : null,
    });
  };

  useEffect(() => {
    if (!isMobile) {
      axios
        .get(`/json/emotes/${props.clip.broadcaster.id}`)
        .then(({ data }) => {
          setEmotes([...data.betterttv, ...data.frankerfacez]);
        });
    }
    return () => {
      setEmotes([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getComments();
    return () => {
      setComments({
        data: [],
        next_page_url: `/json/comments?page=1&clip_id=${props.clip.id}${props.comment_id}${sortBy}`,
        to: 20,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Site title={props.clip.title}></Site>
      <clipContext.Provider
        value={{ ...props.clip, auth: props.auth, emotes: emotes }}
      >
        <Grid fluid>
          <>
            {props.clip.deleted_at && (
              <div className="bg-dark border-l-8 border-t border-b border-r border-red-persimmon p-3 lg:mb-3 rounded-md flex items-center lg:mx-0 mx-2">
                <i className="far fa-trash-alt text-2xl mr-3 text-red-persimmon"></i>
                <div>
                  <p className="text-lg">Sorry, this clip has been removed</p>
                  <p className="text-sm">
                    We remove clips for a varity of reasons, including keeping
                    viewers safe, civil, and true to their purpose
                  </p>
                </div>
              </div>
            )}
            <Clip
              asset_url={props.asset_url}
              clip={props.clip}
              auth={props.auth}
              link={false}
              autoplay
              page
            ></Clip>
            {props.clip.out_of_context && (
              <div className="bg-dark border-l-8 border-t border-b border-r border-yellow-300 p-3 mb-3 rounded-md flex items-center lg:mx-0 mx-2">
                <i className="fas fa-exclamation-triangle text-2xl mr-3 text-yellow-300"></i>
                <div>
                  <p className="text-lg">Out of context</p>
                  <p className="text-sm">
                    Please watch the full video on twitch to get a better
                    understanding
                  </p>
                </div>
              </div>
            )}
            <div className="flex lg:mb-3 justify-between items-center bg-dark lg:rounded-md border-t border-b lg:border-r lg:border-l p-2">
              <InertiaLink
                href={`/broadcaster/${props.clip.broadcaster.login}`}
                className="font-semibold flex items-center"
              >
                <img
                  src={props.clip.broadcaster.avatar.replace(
                    /\d+x\d+/g,
                    "70x70"
                  )}
                  alt="avatar"
                  className="mr-2"
                  width="50"
                  height="50"
                  onError={(e) => {
                    e.currentTarget.src = `${
                      props.asset_url ? props.asset_url : ""
                    }/images/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png`;
                  }}
                />
                <div className="flex flex-col items-start">
                  <div className="group-hover:text-white-light">
                    <span className="inline-block align-middle">
                      {props.clip.broadcaster.display_name}
                    </span>
                    &nbsp;
                    {props.clip.broadcaster.partner && (
                      <img
                        src={`${
                          props.asset_url ? props.asset_url : ""
                        }/images/partner.png`}
                        alt="partner"
                        className="inline-block align-middle"
                      />
                    )}
                  </div>
                  {props.clip.broadcaster.subscriptions &&
                    (props.clip.broadcaster.type ? (
                      <span className="bg-red-600 rounded-full w-10 align-middle font-semibold text-center text-xs uppercase text-white-light">
                        Live
                      </span>
                    ) : (
                      <span className="bg-gray rounded-full w-16 align-middle font-semibold text-center text-xs uppercase">
                        Offline
                      </span>
                    ))}
                </div>
              </InertiaLink>
              {following ? (
                <button
                  className="lg:px-4 lg:py-2 p-2 flex items-center rounded-full hover:bg-opacity-80 focus:outline-none border border-primary uppercase font-semibold"
                  onClick={() => {
                    setFollowing(false);
                    axios
                      .patch(`/unfollow/${props.clip.broadcaster.id}`)
                      .catch(() => {
                        setFollowing(false);
                      });
                  }}
                >
                  <i className="far fa-heart"></i>
                  <span>&nbsp;Following</span>
                </button>
              ) : (
                <button
                  className="lg:px-4 lg:py-2 p-2 flex items-center bg-primary text-white-light rounded-full hover:bg-opacity-80 focus:outline-none uppercase font-semibold"
                  onClick={() => {
                    setFollowing(true);
                    axios
                      .patch(`/follow/${props.clip.broadcaster.id}`)
                      .catch(() => {
                        setFollowing(false);
                      });
                  }}
                >
                  <i className="fas fa-heart"></i>
                  <span>&nbsp;Follow</span>
                </button>
              )}
            </div>
            {props.clip.locked && (
              <div className="bg-dark border-l-8 border-t border-b border-r border-yellow-300 p-3 mb-3 rounded-md flex items-center lg:mx-0 mx-2 lg:mt-0 mt-3">
                <i className="fas fa-lock text-2xl mr-3 text-yellow-300"></i>
                <div>
                  <p className="text-lg">
                    This Thread has been locked by the global moderator of
                    Justclip
                  </p>
                  <p className="text-sm">New comment cannot be posted</p>
                </div>
              </div>
            )}
            <Textarea
              onCommentPost={onCommentPost}
              showEmotes
              locked={props.clip.locked || !!props.clip.deleted_at}
            ></Textarea>
            <div className="flex space-x-3 font-semibold items-center mb-2 justify-between lg:px-0 px-2">
              {props.comment_id ? (
                <InertiaLink
                  href={`/clip/${props.clip.slug}`}
                  className="px-3 py-1 rounded-full mr-2 hover:bg-opacity-80 font-semibold focus:outline-none bg-secondary"
                >
                  View all comments
                </InertiaLink>
              ) : (
                <div></div>
              )}
              <SortComments onSort={onSort}></SortComments>
            </div>
            {props.clip.comments_count || comments.data.length ? (
              <>
                <InfiniteScroll
                  dataLength={comments.to ?? 0}
                  next={getComments}
                  hasMore={!!comments.next_page_url}
                  loader={<CommentSkeleton></CommentSkeleton>}
                  style={{ overflow: "none" }}
                >
                  {comments.data.map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        asset_url={props.asset_url}
                        className="bg-dark lg:rounded-md border-t border-b lg:border-r lg:border-l lg:px-4 lg:pt-4 px-3 pt-3 mb-3"
                      ></Comment>
                    );
                  })}
                </InfiniteScroll>
              </>
            ) : (
              <div className="flex flex-col justify-center text-muted items-center py-10">
                <i className="far fa-sad-tear text-4xl"></i>
                <p className="text-xl">No Comments Yet</p>
                <p>Be the first to share what you think!</p>
              </div>
            )}
          </>
        </Grid>
      </clipContext.Provider>
    </>
  );
};

/* eslint-disable react/display-name */
ClipPage.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default ClipPage;
