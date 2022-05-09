import "moment-duration-format";

import React, { useState } from "react";
import {
  isAdminister,
  isEnglish,
  isGlobalModerator,
  isMobile,
  secondsToHms,
} from "../utils";

import Ad from "./ad";
import type { Clip as ClipType } from "../types/clip";
import Confirm from "./confirm";
import Dropdown from "@shared/dropdown";
import { Inertia } from "@inertiajs/inertia";
import { InertiaLink } from "@inertiajs/inertia-react";
import MiniProfile from "@shared/mini-profile";
import ReactModal from "react-modal";
import Remove from "@shared/remove";
import Report from "./report";
import Tippy from "@tippyjs/react";
import type { User } from "../types/user";
import Video from "@shared/video";
import type { Voted } from "../types/voted";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import { useEffect } from "react";

const Clip = ({
  asset_url,
  clip,
  auth,
  link = true,
  autoplay = false,
  page = false,
}: {
  asset_url: string;
  clip: ClipType;
  auth?: User;
  link?: boolean;
  autoplay?: boolean;
  page?: boolean;
}): JSX.Element | null => {
  const isAdmin = auth?.roles?.find((role) => isAdminister(role));
  const isGlobalMod = auth?.roles?.find((role) => isGlobalModerator(role));

  const [votes, setVotes] = useState(clip.upvotes_count - clip.downvotes_count);
  const [userVoted, setUserVoted] = useState<Voted | null>(clip.voted);
  const [hearted, setHearted] = useState(clip.hearted);
  const [removed, setRemoved] = useState<Date | null>(clip.deleted_at);
  const [deleted, setDeleted] = useState(false);
  const [deletedBy, setDeletedBy] = useState(clip.deleted_by);
  const [outOfContext, setOutOfContext] = useState(clip.out_of_context);
  const [locked, setLocked] = useState(clip.locked);
  const [spoiler, setSpoiler] = useState(clip.spoiler);
  const [loud, setLoud] = useState(clip.loud);
  // const [tos, setTos] = useState(clip.tos);
  const [notifyComments, setNotifyComments] = useState(clip.notify_comments);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (removed) {
      return;
    }

    if (auth) {
      if (userVoted?.vote_type === 1) {
        setUserVoted(null);
        if (clip.broadcaster_id === auth?.id) {
          setHearted(false);
        }
        const currentVote = clip.voted;
        if (currentVote?.vote_type === 0) {
          setVotes(clip.upvotes_count - clip.downvotes_count + 1);
        } else {
          if (userVoted.updated) {
            if (currentVote?.vote_type === 1) {
              setVotes(clip.upvotes_count - clip.downvotes_count - 1);
            } else {
              setVotes(clip.upvotes_count - clip.downvotes_count);
            }
          } else {
            setVotes(clip.upvotes_count - clip.downvotes_count - 1);
          }
        }
        axios.delete(`/clip/${clip.id}/upvote/${userVoted.user_id}`);
      } else {
        setUserVoted({ user_id: auth.id, vote_type: 1, updated: true });
        if (clip.broadcaster_id === auth?.id) {
          setHearted(true);
        }
        const currentVote = clip.voted;
        if (currentVote?.vote_type === 0) {
          setVotes(clip.upvotes_count - clip.downvotes_count + 2);
        } else {
          if (currentVote?.vote_type) {
            setVotes(clip.upvotes_count - clip.downvotes_count);
          } else {
            setVotes(clip.upvotes_count - clip.downvotes_count + 1);
          }
        }
        axios.post(`/clip/${clip.id}/upvote`);
      }
    } else {
      axios.post(`/clip/${clip.id}/upvote`);
    }
  };

  const handleDownvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (removed) {
      return;
    }

    if (auth) {
      if (userVoted?.vote_type === 0) {
        setVotes(clip.upvotes_count - clip.downvotes_count);
        setUserVoted(null);
        if (clip.broadcaster_id === auth?.id) {
          setHearted(false);
        }

        const currentVote = clip.voted;
        if (currentVote?.vote_type === 1) {
          setVotes(clip.upvotes_count - clip.downvotes_count - 1);
        } else {
          if (userVoted.updated) {
            if (currentVote?.vote_type === 0) {
              setVotes(clip.upvotes_count - clip.downvotes_count + 1);
            } else {
              setVotes(clip.upvotes_count - clip.downvotes_count);
            }
          } else {
            setVotes(clip.upvotes_count - clip.downvotes_count + 1);
          }
        }
        axios.delete(`/clip/${clip.id}/downvote/${userVoted.user_id}`);
      } else {
        setUserVoted({ user_id: auth.id, vote_type: 0, updated: true });
        if (clip.broadcaster_id === auth?.id) {
          setHearted(false);
        }
        const currentVote = clip.voted;
        if (currentVote?.vote_type === 1) {
          setVotes(clip.upvotes_count - clip.downvotes_count - 2);
        } else {
          if (currentVote?.vote_type) {
            setVotes(clip.upvotes_count - clip.downvotes_count);
          } else {
            setVotes(clip.upvotes_count - clip.downvotes_count - 1);
          }
        }
        axios.post(`/clip/${clip.id}/downvote`);
      }
    } else {
      axios.post(`/clip/${clip.id}/downvote`);
    }
  };

  const handleDelete = (id: number, confirm: boolean) => {
    if (confirm) {
      setIsOpen(false);
      if (page) {
        Inertia.delete(`/clip/${id}?redirect=${clip.user?.login}`);
      } else {
        setDeleted(true);
        axios.delete(`/clip/${id}`);
      }
    }
  };

  const handleRemove = (rule: string, confirm: boolean) => {
    if (confirm) {
      setIsOpen(false);
      setRemoved(moment().toDate());
      if (page) {
        Inertia.delete(`/reports/${clip.id}?approved=1&type=clip&rule=${rule}`);
      } else {
        axios.delete(`/reports/${clip.id}?approved=1&type=clip&rule=${rule}`);
      }
    }
  };

  const handleRestore = (id: number, confirm: boolean) => {
    if (confirm) {
      setIsOpen(false);
      setRemoved(null);
      setDeletedBy(undefined);
      if (page) {
        Inertia.delete(`/clip/${id}?redirect=${clip.user?.login}`);
      } else {
        axios.delete(`/clip/${id}`);
      }
    }
  };

  const handleOutOfContext = () => {
    setOutOfContext(!outOfContext);
    setIsOpen(false);
    if (page) {
      Inertia.patch(`/clip/${clip.id}?redirect=true`, {
        out_of_context: !outOfContext,
      });
    } else {
      axios.patch(`/clip/${clip.id}`, {
        out_of_context: !outOfContext,
      });
    }
  };

  const handleLocked = () => {
    setLocked(!locked);
    setIsOpen(false);
    if (page) {
      Inertia.patch(`/clip/${clip.id}?redirect=true`, {
        locked: !locked,
      });
    } else {
      axios.patch(`/clip/${clip.id}`, {
        locked: !locked,
      });
    }
  };

  const handleSpoiler = () => {
    setSpoiler(!spoiler);
    setIsOpen(false);
    if (page) {
      Inertia.patch(`/clip/${clip.id}?redirect=true`, {
        spoiler: !spoiler,
      });
    } else {
      axios.patch(`/clip/${clip.id}`, {
        spoiler: !spoiler,
      });
    }
  };

  const handleLoud = () => {
    setLoud(!loud);
    setIsOpen(false);
    if (page) {
      Inertia.patch(`/clip/${clip.id}?redirect=true`, {
        loud: !loud,
      });
    } else {
      axios.patch(`/clip/${clip.id}`, {
        loud: !loud,
      });
    }
  };

  // const handleTos = () => {
  //   setTos(!tos);
  //   setIsOpen(false);
  //   if (page) {
  //     Inertia.patch(`/clip/${clip.id}?redirect=true`, { tos: !tos });
  //   } else {
  //     axios.patch(`/clip/${clip.id}`, { tos: !tos });
  //   }
  // };

  const handleNotifyComments = () => {
    setNotifyComments(!notifyComments);
    setIsOpen(false);
    if (page) {
      Inertia.patch(`/clip/${clip.id}?redirect=true`, {
        notifyComments: !notifyComments,
      });
    } else {
      axios.patch(`/clip/${clip.id}`, {
        notifyComments: !notifyComments,
      });
    }
  };

  useEffect(() => {
    setDeletedBy(clip.deleted_by);
  }, [clip.deleted_by]);

  if (!deleted) {
    return (
      <div
        onClick={() => {
          if (link) {
            Inertia.get(`/clip/${clip.slug}`);
          }
        }}
        className={`flex bg-dark lg:rounded-md lg:mb-3 lg:border ${
          link ? "hover:border-muted cursor-pointer" : ""
        }`}
      >
        <div className="flex-col items-center hidden w-10 pt-2 lg:flex bg-codgray rounded-tl-md rounded-bl-md">
          <button
            className={`hover:bg-primary hover:bg-opacity-50 px-2 py-1 focus:outline-none ${
              userVoted?.vote_type === 1 && "bg-primary bg-opacity-70"
            }`}
            onClick={handleUpvote}
          >
            <i className="fas fa-arrow-up"></i>
          </button>
          <span>
            {votes >= 0 ? numeral(votes).format("0.[0]a") : <>&bull;</>}
          </span>
          <button
            className={`hover:bg-red-500 hover:bg-opacity-50 px-2 py-1 focus:outline-none ${
              userVoted?.vote_type === 0 && "bg-red-500 bg-opacity-70"
            }`}
            onClick={handleDownvote}
          >
            <i className="fas fa-arrow-down"></i>
          </button>
        </div>
        <div className="flex-1">
          <div className="pl-2 mb-1">
            <div className="pt-2 text-sm lg:text-xs text-muted lg:pt-0">
              <span className="hidden align-middle lg:inline-block">
                Clipped by
              </span>
              &nbsp;
              {clip.user && (
                <img
                  src={clip.user.avatar.replace(/\d+x\d+/g, "28x28")}
                  alt="avatar"
                  className="inline mr-2 align-middle lg:hidden ring-2 ring-primary"
                  width="20"
                  height="20"
                />
              )}
              {clip.user ? (
                <MiniProfile asset_url={asset_url} user_id={clip.user.id}>
                  <InertiaLink
                    href={`/${clip.user.display_name}`}
                    className="inline-block font-semibold align-middle hover:underline lg:font-normal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {clip.user.display_name}
                  </InertiaLink>
                </MiniProfile>
              ) : (
                <span className="inline-block align-middle">[DELETED]</span>
              )}
              <span className="inline-block align-middle lg:hidden">
                &nbsp;&bull;
              </span>
              &nbsp;
              <Tippy
                content={moment(clip.created_at).format(
                  "ddd, MMM Do, YYYY, HH:mm:ss A"
                )}
              >
                <span className="inline-block align-middle hover:underline">
                  {moment(clip.created_at).fromNow()}
                </span>
              </Tippy>
              &nbsp;
              <span className="hidden align-middle lg:inline-block">
                with{" "}
                {clip.upvotes_count + clip.downvotes_count != 0
                  ? Math.round(
                      (clip.upvotes_count /
                        (clip.upvotes_count + clip.downvotes_count)) *
                        100
                    )
                  : 0}
                % upvoted{" "}
              </span>
              &nbsp;
              <span className="inline-block align-middle">
                {removed && (
                  <Tippy content="Clip Removed">
                    <i className="inline-block mr-1 align-middle far fa-trash-alt text-red-persimmon"></i>
                  </Tippy>
                )}
                {locked && (
                  <Tippy content="Comment Locked">
                    <i className="inline-block mr-1 text-yellow-300 align-middle fas fa-lock"></i>
                  </Tippy>
                )}
                {outOfContext && (
                  <Tippy content="Out of Context">
                    <i className="inline-block text-yellow-300 align-middle fas fa-exclamation-triangle"></i>
                  </Tippy>
                )}
              </span>
            </div>
            <p className="py-1 text-lg lg:text-xl lg:py-0">
              {hearted && (
                <Tippy
                  content={
                    <span>
                      <i className="text-xs fas fa-heart"></i> by{" "}
                      {clip.broadcaster.display_name}
                    </span>
                  }
                >
                  <span className="relative inline-block mr-2 align-middle">
                    <img
                      src={clip.broadcaster.avatar.replace(/\d+x\d+/g, "28x28")}
                      alt="avatar"
                      className="rounded-full"
                      width="20"
                      height="20"
                    />
                    <i className="absolute text-xs fas fa-heart text-twitch -bottom-1 -right-1"></i>
                  </span>
                </Tippy>
              )}
              {clip.category && (
                <span onClick={(e) => e.stopPropagation()}>
                  <InertiaLink
                    href={`/category/${clip.category.name}`}
                    className="inline-block px-2 py-1 mr-1 text-xs font-semibold align-middle rounded-full bg-primary hover:bg-opacity-80 text-white-light"
                  >
                    {clip.category.name}
                  </InertiaLink>
                </span>
              )}
              {deletedBy && (
                <span onClick={(e) => e.stopPropagation()}>
                  <InertiaLink
                    href={`/content-policy#${deletedBy.rule
                      .replaceAll(" ", "_")
                      .toLowerCase()}`}
                    className="hidden px-2 py-1 mr-1 text-xs font-semibold align-middle rounded-full bg-secondary hover:bg-opacity-80 lg:inline-block"
                  >
                    Removed - {deletedBy.rule}
                  </InertiaLink>
                </span>
              )}
              {clip.title}
              {spoiler && (
                <span className="inline-block px-1 pb-1 ml-1 text-xs font-semibold leading-3 align-middle border rounded-md border-gray-chateau text-gray-chateau">
                  spoiler
                </span>
              )}
              {tos && (
                <span className="inline-block px-1 pb-1 ml-1 text-xs font-semibold leading-3 align-middle border rounded-md border-red-persimmon text-red-persimmon">
                  tos
                </span>
              )} */}
            </p>
          </div>
          {(spoiler || tos) && !page ? (
            <div className="relative overflow-hidden text-xs lg:text-base">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={clip.thumbnail}
                  alt="thumbnail"
                  className="w-full blur-player"
                />
              </div>
              <div className="absolute top-0 right-0 flex items-center mt-2 mr-1 lg:hidden">
                {clip.category && (
                  <div className="px-2 py-1 mr-1 font-semibold rounded-full bg-primary bg-opacity-80 text-white-light">
                    {clip.category.name}
                  </div>
                )}
                <div className="px-2 py-1 font-semibold rounded-full bg-primary bg-opacity-80 text-white-light">
                  {clip.broadcaster.display_name}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 px-1 mb-2 mr-2 rounded-md bg-dark bg-opacity-70">
                {moment.duration(clip.duration, "seconds").format()}
              </div>
            </div>
          ) : (
            <>
              {isMobile && !page ? (
                <div className="relative block text-xs lg:hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={clip.thumbnail}
                      alt="thumbnail"
                      className="w-full"
                    />
                  </div>
                  <div className="absolute top-0 right-0 flex items-center mt-2 mr-1">
                    {clip.category && (
                      <div className="px-2 py-1 mr-1 font-semibold rounded-full bg-primary bg-opacity-80 text-white-light">
                        {clip.category.name}
                      </div>
                    )}
                    <div className="px-2 py-1 font-semibold rounded-full bg-primary bg-opacity-80 text-white-light">
                      {clip.broadcaster.display_name}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 px-1 mb-2 mr-2 rounded-md bg-dark bg-opacity-70">
                    {moment.duration(clip.duration, "seconds").format()}
                  </div>
                </div>
              ) : (
                <Video
                  thumbnail={clip.thumbnail}
                  clip={clip}
                  autoplay={autoplay}
                  next={clip.next}
                ></Video>
              )}
              {/* {page && (
                <Ad
                  dataAdSlot="1328388064"
                  dataAdFormat="horizontal"
                  className="mt-2 lg:mt-0"
                ></Ad>
              )} */}
            </>
          )}
          <div
            className={`lg:flex text-muted justify-between items-center justify-items-stretch hidden h-[56px] ${
              page ? "border-t" : ""
            }`}
          >
            <div
              className="flex self-stretch"
              onClick={(e) => e.stopPropagation()}
            >
              <InertiaLink
                href={`/clip/${clip.slug}`}
                className="flex items-center p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
              >
                <i className="align-middle fas fa-comment-alt"></i>
                &nbsp;
                {numeral(clip.comments_count).format("0.[0]a")} Comments
              </InertiaLink>
              <a
                href={`https://www.twitch.tv/videos/${
                  clip.video_id
                }?t=${secondsToHms(clip.offset + clip.duration)}`}
                className="flex items-center p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fas fa-info-circle"></i>&nbsp;Context
              </a>
              {clip.user?.id === auth?.id ? (
                <>
                  <Confirm
                    id={clip.id}
                    title="Delete clip?"
                    description="Are you sure you want to delete your clip and votes? You can't undo this."
                    className="p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
                    onConfirmed={handleDelete}
                  >
                    <>
                      <i className="far fa-trash-alt"></i> Delete
                    </>
                  </Confirm>
                  <Dropdown
                    menu={<i className="fas fa-ellipsis-h"></i>}
                    menuClassName="p-2 font-semibold hover:bg-secondary hover:text-white rounded-none border-r"
                    itemsClassName="flex flex-col bg-dark text-left mt-3 border-t border-r border-l -left-1px text-sm text-white whitespace-nowrap absolute left-0 bottom-0 z-50"
                  >
                    <label
                      htmlFor={`spoiler-${clip.id}`}
                      className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                      onClick={handleSpoiler}
                    >
                      <input
                        type="checkbox"
                        name="spoiler"
                        id={`spoiler-${clip.id}`}
                        className="mr-2 bg-primary"
                        checked={spoiler}
                        onChange={handleSpoiler}
                      />
                      <span>Mark As Spoiler</span>
                    </label>
                    <label
                      htmlFor={`loud-${clip.id}`}
                      className="flex items-center px-5 py-2 hover:bg-secondary cursor-pointer"
                      onClick={handleLoud}
                    >
                      <input
                        type="checkbox"
                        name="loud"
                        id={`loud-${clip.id}`}
                        className="mr-2 bg-primary"
                        checked={loud}
                        onChange={handleLoud}
                      />
                      <span>Mark As Loud</span>
                    </label>
                    {/* <label
                      htmlFor={`tos-${clip.id}`}
                      className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                      onClick={handleTos}
                    >
                      <input
                        type="checkbox"
                        name="tos"
                        id={`tos-${clip.id}`}
                        className="mr-2 bg-primary"
                        checked={tos}
                        onChange={handleTos}
                      />
                      <span>Mark As TOS</span>
                    </label> */}
                    <label
                      htmlFor={`notification-${clip.id}`}
                      className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                      onClick={handleNotifyComments}
                    >
                      <input
                        type="checkbox"
                        name="notification"
                        id={`notification-${clip.id}`}
                        className="mr-2 bg-primary"
                        checked={notifyComments}
                        onChange={handleNotifyComments}
                      />
                      <span>Send Me Reply Notifications</span>
                    </label>
                  </Dropdown>
                </>
              ) : isAdmin || isGlobalMod ? (
                <>
                  {removed ? (
                    <Confirm
                      id={clip.id}
                      title="Restore clip?"
                      description="Are you sure you want to restore this clip?"
                      className="p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
                      onConfirmed={handleRestore}
                    >
                      <>
                        <i className="fas fa-trash-restore-alt"></i> Restore
                      </>
                    </Confirm>
                  ) : (
                    <>
                      <Remove
                        className="p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
                        onConfirmed={handleRemove}
                      >
                        <>
                          <i className="fas fa-ban"></i> Remove
                        </>
                      </Remove>
                      <Dropdown
                        menu={<i className="fas fa-shield-alt"></i>}
                        menuClassName="p-2 font-semibold hover:bg-secondary hover:text-white rounded-none border-r"
                        itemsClassName="flex flex-col bg-dark text-left mt-3 border-t border-r border-l -left-1px text-sm text-white whitespace-nowrap absolute left-0 bottom-0 z-50"
                      >
                        <label
                          htmlFor={`out-of-context-${clip.id}`}
                          className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                          onClick={handleOutOfContext}
                        >
                          <input
                            type="checkbox"
                            name="out-of-context"
                            id={`out-of-context-${clip.id}`}
                            className="mr-2 bg-primary"
                            checked={outOfContext}
                            onChange={handleOutOfContext}
                          />
                          <span>Out of context</span>
                        </label>
                        <label
                          htmlFor={`lock-${clip.id}`}
                          className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                          onClick={handleLocked}
                        >
                          <input
                            type="checkbox"
                            name="lock"
                            id={`lock-${clip.id}`}
                            className="mr-2 bg-primary"
                            checked={locked}
                            onChange={handleLocked}
                          />
                          <span>Lock comments</span>
                        </label>
                        <label
                          htmlFor={`spoiler-${clip.id}`}
                          className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                          onClick={handleSpoiler}
                        >
                          <input
                            type="checkbox"
                            name="spoiler"
                            id={`spoiler-${clip.id}`}
                            className="mr-2 bg-primary"
                            checked={spoiler}
                            onChange={handleSpoiler}
                          />
                          <span>Mark As Spoiler</span>
                        </label>
                        <label
                          htmlFor={`loud-${clip.id}`}
                          className="flex items-center px-5 py-2 hover:bg-secondary cursor-pointer"
                          onClick={handleLoud}
                        >
                          <input
                            type="checkbox"
                            name="loud"
                            id={`loud-${clip.id}`}
                            className="mr-2 bg-primary"
                            checked={loud}
                            onChange={handleLoud}
                          />
                          <span>Mark As Loud</span>
                        </label>
                        {/* <label
                          htmlFor={`tos-${clip.id}`}
                          className="flex items-center px-5 py-2 cursor-pointer hover:bg-secondary"
                          onClick={handleTos}
                        >
                          <input
                            type="checkbox"
                            name="tos"
                            id={`tos-${clip.id}`}
                            className="mr-2 bg-primary"
                            checked={tos}
                            onChange={handleTos}
                          />
                          <span>Mark As TOS</span>
                        </label> */}
                      </Dropdown>
                    </>
                  )}
                </>
              ) : (
                !removed && (
                  <Report
                    className="flex items-center p-2 font-semibold border-r hover:bg-secondary hover:text-white focus:outline-none"
                    clip={clip}
                    type="clip"
                    auth={auth}
                  >
                    <>
                      <i className="mr-1 align-middle fas fa-flag"></i> Report
                    </>
                  </Report>
                )
              )}
            </div>
            {typeof clip.views_count === "undefined" ? (
              <InertiaLink
                href={`/broadcaster/${clip.broadcaster.login}`}
                className="flex items-center p-2 font-semibold border-l rounded-br-md group hover:bg-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={clip.broadcaster.avatar.replace(/\d+x\d+/g, "70x70")}
                  alt="avatar"
                  className="mr-1"
                  width="40"
                  height="40"
                  onError={(e) => {
                    e.currentTarget.src = `${
                      asset_url ? asset_url : ""
                    }/images/de130ab0-def7-11e9-b668-784f43822e80-profile_image-70x70.png`;
                  }}
                />
                <div className="flex flex-col items-start">
                  <p className="group-hover:text-white">
                    <span className="inline-block align-middle">
                      {isEnglish(clip.broadcaster.display_name)
                        ? clip.broadcaster.display_name
                        : clip.broadcaster.login}
                    </span>
                    &nbsp;
                    {clip.broadcaster.partner && (
                      <img
                        src={`${asset_url ? asset_url : ""}/images/partner.png`}
                        alt="partner"
                        className="inline-block align-middle"
                      />
                    )}
                  </p>
                  {clip.broadcaster.subscriptions &&
                    (clip.broadcaster.type ? (
                      <span className="w-10 text-xs font-semibold text-center uppercase align-middle bg-red-600 rounded-full text-white-light">
                        Live
                      </span>
                    ) : (
                      <span className="w-16 text-xs font-semibold text-center uppercase align-middle rounded-full bg-gray">
                        Offline
                      </span>
                    ))}
                </div>
              </InertiaLink>
            ) : (
              <div className="flex items-center self-stretch p-2 font-semibold border-l">
                {numeral(clip.views_count).format("0,0")} views
              </div>
            )}
          </div>

          {/* mobile */}

          <div className="flex items-center justify-between p-2 lg:hidden">
            <div className="flex items-center">
              <div className="flex items-center px-2 py-1 mr-2 border rounded-full">
                <button
                  className={`px-2 focus:outline-none ${
                    userVoted?.vote_type === 1 ? "text-primary" : ""
                  }`}
                  onClick={handleUpvote}
                >
                  <i className="fas fa-arrow-up"></i>
                </button>
                <span>{votes >= 0 ? votes : <>&bull;</>}</span>
                <button
                  className={`px-2 focus:outline-none ${
                    userVoted?.vote_type === 0 ? "text-red-500" : ""
                  }`}
                  onClick={handleDownvote}
                >
                  <i className="fas fa-arrow-down"></i>
                </button>
              </div>
              <div className="flex items-center px-2 py-1 border rounded-full">
                <i className="mr-1 align-middle fas fa-comment-alt"></i>{" "}
                {numeral(clip.comments_count).format("0a")}
              </div>
              {page && (
                <div className="items-center rounded-full flex border px-2 py-1">
                  <i className="far fa-eye align-middle mr-1"></i>{" "}
                  {numeral(clip.views_count).format("0.[0]a")}
                </div>
              )}
            </div>
            <div
              className="flex items-center p-2 border rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <i className="fas fa-ellipsis-h"></i>
              <ReactModal
                isOpen={isOpen}
                className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
                overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
              >
                <div className="relative z-50 w-full p-2 mx-3 border rounded-md bg-dark">
                  <button
                    className="absolute text-lg top-1 right-3 focus:outline-none"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <a
                    href={`https://www.twitch.tv/videos/${
                      clip.video_id
                    }?t=${secondsToHms(clip.offset)}`}
                    className="block px-3 py-2 font-semibold focus:outline-none"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-info-circle fa-fw"></i> Context
                  </a>
                  {clip.user ? (
                    <InertiaLink
                      href={`/${clip.user.login}`}
                      className="block px-3 py-2 font-semibold focus:outline-none"
                    >
                      <i className="far fa-user-circle fa-fw"></i>{" "}
                      {clip.user.display_name}&apos;s profile
                    </InertiaLink>
                  ) : (
                    <span>[DELETED]</span>
                  )}
                  <InertiaLink
                    href={`/broadcaster/${clip.broadcaster.login}`}
                    className="block px-3 py-2 font-semibold focus:outline-none"
                  >
                    <i className="fab fa-twitch fa-fw"></i> More from{" "}
                    {clip.broadcaster.display_name}
                  </InertiaLink>
                  {clip.user?.id === auth?.id ? (
                    <>
                      <button
                        className="px-3 py-2 font-semibold focus:outline-none"
                        onClick={() => {
                          if (page) {
                            Inertia.delete(
                              `/clip/${clip.id}?redirect=${clip.user?.login}`
                            );
                          } else {
                            setDeleted(true);
                            axios.delete(`/clip/${clip.id}`);
                          }
                        }}
                      >
                        <i className="far fa-trash-alt fa-fw"></i> Delete
                      </button>
                      <label
                        htmlFor={`spoiler-${clip.id}`}
                        className="block px-4 py-2 font-semibold focus:outline-none"
                        onClick={handleSpoiler}
                      >
                        <input
                          type="checkbox"
                          name="spoiler"
                          id={`spoiler-${clip.id}`}
                          className="mr-2 bg-primary"
                          checked={spoiler}
                          onChange={handleSpoiler}
                        />
                        <span>Mark As Spoiler</span>
                      </label>
                      <label
                        htmlFor={`loud-${clip.id}`}
                        className="px-4 py-2 font-semibold focus:outline-none block"
                        onClick={handleLoud}
                      >
                        <input
                          type="checkbox"
                          name="loud"
                          id={`loud-${clip.id}`}
                          className="mr-2 bg-primary"
                          checked={loud}
                          onChange={handleLoud}
                        />
                        <span>Mark As Loud</span>
                      </label>
                      {/* <label
                        htmlFor={`tos-${clip.id}`}
                        className="block px-4 py-2 font-semibold focus:outline-none"
                        onClick={handleTos}
                      >
                        <input
                          type="checkbox"
                          name="tos"
                          id={`tos-${clip.id}`}
                          className="mr-2 bg-primary"
                          checked={tos}
                          onChange={handleTos}
                        />
                        <span>Mark As TOS</span>
                      </label> */}
                      <label
                        htmlFor={`notification-${clip.id}`}
                        className="block px-4 py-2 font-semibold focus:outline-none"
                        onClick={handleNotifyComments}
                      >
                        <input
                          type="checkbox"
                          name="notification"
                          id={`notification-${clip.id}`}
                          className="mr-2 bg-primary"
                          checked={notifyComments}
                          onChange={handleNotifyComments}
                        />
                        <span>Send Me Reply Notifications</span>
                      </label>
                    </>
                  ) : (
                    !removed && (
                      <Report
                        className="px-3 py-2 font-semibold focus:outline-none"
                        clip={clip}
                        type="clip"
                        auth={auth}
                      >
                        <>
                          <i className="align-middle fas fa-flag fa-fw"></i>{" "}
                          Report
                        </>
                      </Report>
                    )
                  )}
                </div>
              </ReactModal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Clip;
