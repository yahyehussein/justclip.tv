import React, { useContext, useEffect, useState } from "react";
import {
  formatText,
  isAdminister,
  isGlobalModerator,
  number2Color,
} from "../utils";

import CommentSkeleton from "@shared/skeleton/comment";
import type { Comment as CommentType } from "../types/comment";
import Confirm from "./confirm";
import type { Emote } from "../types/emote";
import { InertiaLink } from "@inertiajs/inertia-react";
import MiniProfile from "@shared/mini-profile";
import type { Pagination } from "../types/pagination";
import Report from "./report";
import Textarea from "@shared/textarea";
import Tippy from "@tippyjs/react";
import type { Voted } from "../types/voted";
import axios from "axios";
import { clipContext } from "@context/clipContext";
import moment from "moment";
import numeral from "numeral";

const Comment = ({
  comment,
  asset_url,
  replyingTo = false,
  className,
}: {
  comment: CommentType;
  asset_url: string;
  replyingTo?: boolean;
  className?: string;
}): JSX.Element | null => {
  const isCommentAdmin = comment.roles?.find((role) => isAdminister(role));
  const isCommentGlobalMod = comment.roles?.find((role) =>
    isGlobalModerator(role)
  );

  const clip = useContext(clipContext);

  const isAdmin = clip.auth?.roles?.find((role) => isAdminister(role));
  const isGlobalMod = clip.auth?.roles?.find((role) => isGlobalModerator(role));

  const [minimized, setMinimized] = useState(false);
  const [votes, setVotes] = useState(
    comment.upvotes_count - comment.downvotes_count
  );
  const [userVoted, setUserVoted] = useState<Voted | null>(comment.voted);
  const [reply, setReply] = useState(false);
  const [viewReplies, setViewReplies] = useState(false);
  const [replies, setReplies] = useState<Pagination<CommentType>>({
    data: [],
    next_page_url: `/json/replies/${comment.id}?page=1`,
    to: 10,
  });
  const [softDelete, setSoftDelete] = useState(comment.deleted_at);
  const [forceDelete, setForceDelete] = useState(false);
  const [deletedBy, setDeletedBy] = useState(comment.deleted_by);
  const [edit, setEdit] = useState(false);
  const [textWithOutEmotes, setTextWithOutEmotes] = useState(comment.text);
  const [textWithEmotes, setTextWithEmotes] = useState(comment.text);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
  const [sticky, setSticky] = useState(comment.sticky);

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (clip.auth) {
      if (userVoted?.vote_type === 1) {
        setUserVoted(null);
        const currentVote = comment.voted;
        if (currentVote?.vote_type === 0) {
          setVotes(comment.upvotes_count - comment.downvotes_count + 1);
        } else {
          if (userVoted.updated) {
            if (currentVote?.vote_type === 1) {
              setVotes(comment.upvotes_count - comment.downvotes_count - 1);
            } else {
              setVotes(comment.upvotes_count - comment.downvotes_count);
            }
          } else {
            setVotes(comment.upvotes_count - comment.downvotes_count - 1);
          }
        }
        axios.delete(`/comment/${comment.id}/upvote/${clip.auth?.id}`);
      } else {
        setUserVoted({ user_id: clip.auth.id, vote_type: 1, updated: true });
        const currentVote = comment.voted;
        if (currentVote?.vote_type === 0) {
          setVotes(comment.upvotes_count - comment.downvotes_count + 2);
        } else {
          if (currentVote?.vote_type) {
            setVotes(comment.upvotes_count - comment.downvotes_count);
          } else {
            setVotes(comment.upvotes_count - comment.downvotes_count + 1);
          }
        }
        axios.post(`/comment/${comment.id}/upvote`);
      }
    } else {
      axios.post(`/comment/${comment.id}/upvote`);
    }
  };

  const handleDownvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (clip.auth) {
      if (userVoted?.vote_type === 0) {
        setVotes(comment.upvotes_count - comment.downvotes_count);
        setUserVoted(null);
        const currentVote = comment.voted;
        if (currentVote?.vote_type === 1) {
          setVotes(comment.upvotes_count - comment.downvotes_count - 1);
        } else {
          if (userVoted.updated) {
            if (currentVote?.vote_type === 0) {
              setVotes(comment.upvotes_count - comment.downvotes_count + 1);
            } else {
              setVotes(comment.upvotes_count - comment.downvotes_count);
            }
          } else {
            setVotes(comment.upvotes_count - comment.downvotes_count + 1);
          }
        }
        axios.delete(`/comment/${comment.id}/downvote/${userVoted.user_id}`);
      } else {
        setUserVoted({ user_id: clip.auth.id, vote_type: 0, updated: true });
        const currentVote = comment.voted;
        if (currentVote?.vote_type === 1) {
          setVotes(comment.upvotes_count - comment.downvotes_count - 2);
        } else {
          if (currentVote?.vote_type) {
            setVotes(comment.upvotes_count - comment.downvotes_count);
          } else {
            setVotes(comment.upvotes_count - comment.downvotes_count - 1);
          }
        }
        axios.post(`/comment/${comment.id}/downvote`);
      }
    } else {
      axios.post(`/comment/${comment.id}/downvote`);
    }
  };

  const handleDelete = (id: number, confirm: boolean) => {
    if (confirm) {
      if (comment.replies) {
        setSoftDelete(moment().toDate());
      } else {
        setForceDelete(true);
      }
      axios.delete(`/comments/${id}`);
    }
  };

  const handleRemove = (id: number, confirm: boolean) => {
    if (confirm) {
      if (isAdmin) {
        setDeletedBy("admin");
      } else if (isGlobalMod) {
        setDeletedBy("global moderator");
      }
      setSoftDelete(moment().toDate());
      axios.delete(`/comments/${id}`);
    }
  };

  const handleSticky = () => {
    setSticky(!sticky);
    axios.patch(`/comments/${comment.id}`, { sticky: !sticky });
  };

  const onCommentPost = (comment: CommentType) => {
    setReplies({
      ...replies,
      data: [...replies.data, comment],
      next_page_url: replies.data.length ? replies.next_page_url : null,
    });
    setReply(false);
    setViewReplies(true);
  };

  const onEditUpdate = (text: string, emotes: Emote[]) => {
    setTextWithOutEmotes(text);
    setTextWithEmotes(formatText(text, emotes));
    setEdit(false);
  };

  const getReplies = async () => {
    if (replies.next_page_url) {
      setLoadingMoreReplies(true);
      const { data } = await axios.get(`${replies.next_page_url}`);
      setLoadingMoreReplies(false);
      if (replies.data.length) {
        setReplies({ ...data, data: [...replies.data, ...data.data] });
      } else {
        setReplies({ ...data, data: [...data.data] });
      }
    }
  };

  useEffect(() => {
    if (comment.upvotes_count - comment.downvotes_count < 0 && !softDelete) {
      if (!replyingTo) {
        setMinimized(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTextWithEmotes(formatText(comment.text, comment.emotes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (comment.children) {
      setReplies({
        ...replies,
        data: comment.children ? [comment.children[0]] : [],
        next_page_url: null,
      });
      setViewReplies(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!forceDelete) {
    return (
      <div className={className}>
        <div className="flex mb-3">
          {!softDelete ? (
            comment.user ? (
              <InertiaLink
                href={`/${comment.user.login}`}
                className="mt-[6px] mr-[18px]"
              >
                <MiniProfile asset_url={asset_url} user_id={comment.user.id}>
                  <img
                    src={comment.user.avatar.replace(/\d+x\d+/g, "70x70")}
                    alt="avatar"
                    width={replyingTo ? "38" : "48"}
                    height={replyingTo ? "38" : "48"}
                    onError={(e) => {
                      e.currentTarget.src = `${
                        asset_url ? asset_url : ""
                      }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`;
                    }}
                  />
                </MiniProfile>
              </InertiaLink>
            ) : (
              <div className="mt-[6px] mr-[18px]">
                <img
                  src={`${
                    asset_url ? asset_url : ""
                  }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`}
                  alt="avatar"
                  width="48"
                  height="48"
                />
              </div>
            )
          ) : (
            <div className="mt-[6px] mr-[18px]">
              <img
                src={`${
                  asset_url ? asset_url : ""
                }/images/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png`}
                alt="avatar"
                width="48"
                height="48"
              />
            </div>
          )}
          <div className="flex flex-col flex-1 justify-center">
            <div className="flex justify-between items-end">
              <div className="text-sm space-x-1">
                {softDelete ? (
                  <span className="text-muted inline-block align-middle">
                    {deletedBy
                      ? `Comment deleted by ${deletedBy}`
                      : "Comment deleted by user"}
                  </span>
                ) : (
                  <>
                    {comment.user?.id === clip.user_id && (
                      <Tippy content="Clipper">
                        <img
                          src={`${
                            asset_url ? asset_url : ""
                          }/images/clip-champ.png`}
                          alt="clip-champ"
                          className="inline align-middle"
                        />
                      </Tippy>
                    )}
                    {comment.user?.id === clip.broadcaster_id && (
                      <Tippy content="Broadcaster">
                        <img
                          src={`${
                            asset_url ? asset_url : ""
                          }/images/broadcaster.png`}
                          alt="broadcaster"
                          className="inline align-middle"
                        />
                      </Tippy>
                    )}
                    {comment.user ? (
                      <InertiaLink href={`/${comment.user.login}`}>
                        <MiniProfile
                          asset_url={asset_url}
                          user_id={comment.user.id}
                        >
                          <span className="hover:underline inline-block align-middle">
                            {comment.user.display_name}
                          </span>
                        </MiniProfile>
                      </InertiaLink>
                    ) : (
                      <span>[DELETED]</span>
                    )}
                    {comment.in_chat && (
                      <>
                        <span className="text-muted inline-block align-middle">
                          &#8226;
                        </span>
                        <span
                          className="text-xs font-semibold inline-block align-middle uppercase"
                          style={{
                            color: comment.in_chat.color
                              ? number2Color(comment.in_chat.color)
                              : "inherit",
                          }}
                        >
                          In Chat
                        </span>
                      </>
                    )}
                    {isCommentAdmin && (
                      <>
                        <span className="text-muted inline-block align-middle">
                          &#8226;
                        </span>
                        <span className="text-red-persimmon text-xs font-semibold inline-block align-middle uppercase">
                          Admin
                        </span>
                      </>
                    )}
                    {isCommentGlobalMod && (
                      <>
                        <span className="text-muted inline-block align-middle">
                          &#8226;
                        </span>
                        <span className="text-primary text-xs font-semibold inline-block align-middle uppercase">
                          Global Mod
                        </span>
                      </>
                    )}
                    {replyingTo &&
                      (comment.comment_id ? (
                        comment?.comment?.user && (
                          <>
                            <i className="fas fa-reply fa-flip-horizontal text-muted inline-block align-middle"></i>
                            <InertiaLink
                              href={`/${comment.comment.user.login}`}
                              className="text-muted hover:underline mr-1 inline-block align-middle"
                            >
                              <span className="">
                                {comment.comment.user.display_name}
                              </span>
                            </InertiaLink>
                          </>
                        )
                      ) : (
                        <span className="text-muted mr-1 inline-block align-middle">
                          <i className="fas fa-reply fa-flip-horizontal"></i>{" "}
                          [DELETED]
                        </span>
                      ))}
                  </>
                )}
                <span className="text-muted inline-block align-middle">
                  &#8226;
                </span>
                <span className="text-muted inline-block align-middle">
                  {moment(comment.created_at).fromNow()}
                </span>
                {!softDelete &&
                  moment(comment.created_at).isBefore(comment.updated_at) && (
                    <>
                      <span className="text-muted inline-block align-middle">
                        {" "}
                        &#8226;{" "}
                      </span>
                      <span className="text-muted inline-block align-middle">
                        edited
                      </span>
                    </>
                  )}
                {sticky && (
                  <>
                    <span className="text-muted inline-block align-middle">
                      &#8226;
                    </span>
                    <span className="text-primary inline-block align-middle">
                      Stickied comment
                    </span>
                  </>
                )}
              </div>
              {!replyingTo && !softDelete && (
                <div
                  className="cursor-pointer hover:text-primary-color"
                  onClick={() => setMinimized(!minimized)}
                >
                  {!minimized && <i className="far fa-minus-square"></i>}
                  {minimized && <i className="far fa-plus-square"></i>}
                </div>
              )}
            </div>
            {!minimized && (
              <>
                {!softDelete && (
                  <>
                    <p
                      className="my-1 break-words"
                      dangerouslySetInnerHTML={{ __html: textWithEmotes }}
                    ></p>
                    <div className="text-muted text-sm">
                      <button
                        className={`hover:bg-primary hover:bg-opacity-50 px-2 focus:outline-none hover:text-white ${
                          userVoted?.vote_type === 1 &&
                          "bg-primary bg-opacity-70 text-white"
                        }`}
                        onClick={handleUpvote}
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <span className="mx-1">
                        {votes ? numeral(votes).format("0.[0]a") : "0"}
                      </span>
                      <button
                        className={`hover:bg-red-500 hover:bg-opacity-50 px-2 focus:outline-none hover:text-white ${
                          userVoted?.vote_type === 0 &&
                          "bg-red-500 bg-opacity-70 text-white"
                        }`}
                        onClick={handleDownvote}
                      >
                        <i className="fas fa-arrow-down"></i>
                      </button>
                      <span className="mx-1">|</span>
                      <button
                        className={`hover:bg-secondary rounded-sm px-2 focus:outline-none ${
                          reply ? "bg-secondary" : ""
                        }`}
                        onClick={() => {
                          setReply(!reply);
                          setEdit(false);
                        }}
                      >
                        Reply
                      </button>
                      {clip.auth?.id === comment.user?.id ? (
                        <>
                          <button
                            className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                            onClick={() => {
                              setEdit(!edit);
                              setReply(false);
                            }}
                          >
                            Edit
                          </button>
                          <Confirm
                            id={comment.id}
                            title="Delete comment?"
                            description="Are you sure you want to delete this comment and votes? You can't undo this."
                            className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                            onConfirmed={handleDelete}
                          >
                            <>Delete</>
                          </Confirm>
                          {!!!isAdmin ||
                            (!!!isGlobalMod && !replyingTo && (
                              <button
                                className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                                onClick={handleSticky}
                              >
                                {sticky ? "Unsticky" : "Sticky"}
                              </button>
                            ))}
                        </>
                      ) : isAdmin || isGlobalMod ? (
                        <>
                          <Confirm
                            id={comment.id}
                            title="Remove comment?"
                            description="Are you sure you want to remove this comment?"
                            className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                            onConfirmed={handleRemove}
                          >
                            <>Remove</>
                          </Confirm>
                          {!replyingTo && (
                            <button
                              className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                              onClick={handleSticky}
                            >
                              {sticky ? "Unsticky" : "Sticky"}
                            </button>
                          )}
                        </>
                      ) : (
                        <Report
                          className="hover:bg-secondary rounded-sm px-2 focus:outline-none"
                          type="comment"
                          clip={clip}
                          comment={comment}
                          auth={clip.auth}
                        >
                          <>Report</>
                        </Report>
                      )}
                    </div>
                  </>
                )}
                {!!comment.replies && (
                  <span
                    className="text-muted hover:underline cursor-pointer mt-1"
                    onClick={() => {
                      setReplies({
                        data: [],
                        next_page_url: `/json/replies/${comment.id}?page=1`,
                        to: 10,
                      });
                      setViewReplies(!viewReplies);
                      if (!viewReplies) {
                        getReplies();
                      }
                    }}
                  >
                    View more replies ({comment.replies})
                  </span>
                )}
              </>
            )}
            <div className="mt-2">
              {reply && (
                <Textarea
                  locked={clip.locked || !!clip.deleted_at}
                  onCommentPost={onCommentPost}
                  comment_id={comment.id}
                ></Textarea>
              )}
              {edit && (
                <Textarea
                  locked={clip.locked || !!clip.deleted_at}
                  comment_id={comment.id}
                  edit={{ id: comment.id, text: textWithOutEmotes }}
                  onEditUpdate={onEditUpdate}
                ></Textarea>
              )}
            </div>
          </div>
        </div>
        {!minimized && viewReplies && (
          <>
            {replies.data.map((reply) => {
              return (
                <Comment
                  key={reply.id}
                  comment={reply}
                  asset_url={asset_url}
                  replyingTo
                  className={replyingTo ? "" : "ml-[66px]"}
                ></Comment>
              );
            })}
            {loadingMoreReplies && (
              <div className="ml-[66px]">
                <CommentSkeleton minimized={false}></CommentSkeleton>
              </div>
            )}
            {!!replies.data.length && replies.next_page_url && (
              <span
                className="text-muted hover:underline cursor-pointer ml-[66px] flex-shrink"
                onClick={() => getReplies()}
              >
                <i className="fas fa-level-up-alt fa-rotate-90 mr-2 text-primary"></i>
                Show more replies
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  return null;
};

export default Comment;
