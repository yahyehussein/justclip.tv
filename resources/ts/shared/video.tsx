import "moment-duration-format";

import React, { useEffect, useRef } from "react";

import { Clip } from "../types/clip";
import JCPlayer from "@justclip/jcplayer";
import Plyr from "plyr";
import axios from "axios";
import { isMobile } from "../utils";
import moment from "moment";

type Video = (props: {
  thumbnail: string;
  clip?: Clip;
  autoplay?: boolean;
  next?: Clip & { display_name?: string };
}) => JSX.Element;

const Video: Video = ({ thumbnail, clip, autoplay = false, next }) => {
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      const plyr = new Plyr("#player");

      plyr.on("ended", () => {
        axios.post("/viewed", { clip_id: clip?.id });
      });

      return () => {
        plyr.destroy();
      };
    } else {
      const jcplayer = new JCPlayer({
        id: clip?.id,
        container: clipRef.current,
        autoplay: autoplay,
        theme: "#4D8844",
        lang: "en",
        preload: "metadata",
        video: {
          url: thumbnail.replace("-preview-480x272.jpg", ".mp4"),
        },
        danmaku: {
          id: clip ? clip.id.toString() : "0",
          api: "/bullet/chat",
        },
        next,
        moment: next ? moment : null,
      });

      return () => {
        jcplayer.destroy();
      };
    }
  }, [autoplay, clip, next, thumbnail]);

  if (isMobile) {
    return (
      <div className="aspect-w-16 aspect-h-9">
        <video id="player" playsInline controls data-poster={thumbnail}>
          <source
            src={thumbnail.replace("-preview-480x272.jpg", ".mp4")}
            type="video/mp4"
          />
        </video>
      </div>
    );
  } else {
    return (
      <div id="clip" ref={clipRef} onClick={(e) => e.stopPropagation()}></div>
    );
  }
};

export default Video;
