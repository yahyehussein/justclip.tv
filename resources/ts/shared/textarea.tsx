import React, { useContext, useEffect, useRef, useState } from "react";

import type { Comment } from "../types/comment";
import DOMPurify from "dompurify";
import { Emote } from "../types/emote";
import Emotes from "@shared/emotes";
import axios from "axios";
import { clipContext } from "@context/clipContext";

interface Edit {
  id: number;
  text: string;
}

const Textarea = ({
  locked,
  comment_id,
  showEmotes,
  edit,
  onCommentPost,
  onEditUpdate,
}: {
  locked: boolean;
  comment_id?: number;
  showEmotes?: boolean;
  edit?: Edit;
  onCommentPost?: (comment: Comment) => void;
  onEditUpdate?: (text: string, emotes: Emote[]) => void;
}): JSX.Element => {
  const clip = useContext(clipContext);

  const textarea = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState(edit ? edit.text : "");
  const [lock, setLock] = useState(false);

  const getTextEmotes = () => {
    const comment = text.replace(/(?:\r\n|\r|\n)/g, " ").split(" ");
    const duplicates: string[] = [];
    const emotes = [];

    if (clip.emotes) {
      for (let index = 0; index < clip.emotes.length; index++) {
        if (
          (comment.includes(clip.emotes[index].code) ||
            comment.includes(clip.emotes[index].name)) &&
          !duplicates.includes(clip.emotes[index].code) &&
          !duplicates.includes(clip.emotes[index].name)
        ) {
          duplicates.push(clip.emotes[index].code || clip.emotes[index].name);

          let url = `https://cdn.betterttv.net/emote/${clip.emotes[index].id}/1x`;

          if (typeof clip.emotes[index].id === "number") {
            url = `https://cdn.frankerfacez.com/emote/${clip.emotes[index].id}/1`;
          }

          emotes.push({
            id: clip.emotes[index].id,
            code: clip.emotes[index].code || clip.emotes[index].name,
            url,
          });
        }
      }
    }

    return emotes;
  };

  const handleComment = () => {
    setLock(true);

    axios
      .post("/comments", {
        text: DOMPurify.sanitize(text),
        clip_id: clip.id,
        comment_id,
        emotes: getTextEmotes(),
        broadcaster_id: clip.broadcaster_id,
      })
      .then(({ data }) => {
        if (onCommentPost) {
          onCommentPost(data);
        }
        setLock(false);
        setText("");
      });
  };

  const handleEdit = () => {
    setLock(true);

    axios
      .patch(`/comments/${edit?.id}`, { text, emotes: getTextEmotes() })
      .then(() => {
        if (onEditUpdate) {
          onEditUpdate(text, getTextEmotes());
        }
        setLock(false);
      });
  };

  const onEmote = (emote: string) => {
    textarea.current?.focus();
    textarea.current?.select();
    if (text) {
      setText(`${text} ${emote}`);
    } else {
      setText(`${emote}`);
    }
  };

  useEffect(() => {
    return () => {
      setText("");
    };
  }, []);

  return (
    <div className="bg-dark lg:rounded-md lg:border-t border-b lg:border-r lg:border-l mb-2">
      <textarea
        name="comment"
        id="comment"
        className="bg-secondary p-2 w-full mb-0 lg:rounded-t-md focus:outline-none focus:broder lg:h-[112px] h-[84px]"
        placeholder="What are your thoughts?"
        rows={4}
        ref={textarea}
        onChange={(e) => setText(e.target.value)}
        value={text}
        spellCheck="false"
        disabled={lock}
        maxLength={2000}
      ></textarea>
      <div className="flex items-center justify-between px-2 pb-2">
        <Emotes onEmote={onEmote} showEmotes={showEmotes}></Emotes>
        {lock ? (
          <div className="spinner w-[40px] h-[40px]"></div>
        ) : edit ? (
          <button
            className={`bg-secondary hover:bg-opacity-80 px-4 py-2 rounded-full flex-shrink-0 focus:outline-none ${
              text ? "" : "cursor-not-allowed"
            } ${locked ? "cursor-not-allowed" : ""}`}
            disabled={!!!text || locked}
            onClick={handleEdit}
          >
            Edit
          </button>
        ) : (
          <button
            className={`bg-secondary hover:bg-opacity-80 px-4 p-2 rounded-full flex-shrink-0 focus:outline-none ${
              text ? "" : "cursor-not-allowed"
            } ${locked ? "cursor-not-allowed" : ""}`}
            disabled={!!!text || locked}
            onClick={handleComment}
          >
            Comment
          </button>
        )}
      </div>
    </div>
  );
};

export default Textarea;
