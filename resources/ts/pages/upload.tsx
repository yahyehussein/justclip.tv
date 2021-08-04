import React, { useState } from "react";

import type { Category } from "../types/category";
import { Clip } from "types/clip";
import Footer from "@shared/footer";
import Grid from "@shared/grid";
import { Inertia } from "@inertiajs/inertia";
import Layout from "@shared/layout";
import Site from "@shared/site";
import type { User } from "../types/user";
import Video from "@shared/video";
import axios from "axios";

interface Data extends Clip {
  broadcaster: User;
  category: Category;
}

const Upload = (): JSX.Element => {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [clip, setClip] = useState<Data | null>(null);
  const [mirror, setMirror] = useState<{
    on: boolean;
    value: string | null;
    error: boolean;
  }>({
    on: false,
    value: null,
    error: false,
  });
  const [spoiler, setSpoiler] = useState(false);
  const [tos, setTos] = useState(false);
  const [notification, setNotification] = useState(true);
  const [lock, setLock] = useState(false);

  const handleClip = async (e: React.FormEvent<HTMLInputElement>) => {
    setLink(e.currentTarget.value);
    const clip = e.currentTarget.value.match(
      /^https?:\/\/(www\.)?(m\.)?(clips\.)?twitch\.tv\/(clip\/)?(\w+\/clip\/)?([\w-]+)?(\?tt_medium=redt)?(\?filter=\w+\&range=\w+\&sort=\w+)?\/?$/
    );
    if (clip) {
      setLock(true);
      axios
        .get(`/clip/create?slug=${clip[6]}`)
        .then(({ data }: { data: Data }) => {
          setClip(data);
          setTitle(data.title);
          setLock(false);
        })
        .catch(() => {
          setLock(false);
        });
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setLock(true);

    const upload = {
      ...clip,
      title,
      spoiler,
      tos,
      notification,
    };

    if (mirror.value) {
      upload.mirror = mirror.value;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Inertia.post("/clip", upload);
  };

  return (
    <>
      <Site title="Upload Clip"></Site>
      <Grid fluid>
        <>
          <div className="flex justify-between border-b pb-3 mb-3 items-center lg:px-0 px-2">
            <p className=" text-xl font-semibold">Upload Clip</p>
            <i className="fab fa-twitch fa-lg text-twitch"></i>
          </div>
          <div className="bg-dark lg:rounded-md mb-3 border-t border-b lg:border-r lg:border-l">
            <div className="px-3 pt-3">
              <input
                type="text"
                name="clip"
                id="clip"
                placeholder="Url"
                className="w-full pl-6 py-3 bg-gray focus:outline-none rounded-md hover:bg-black transition duration-300 border mb-2"
                value={link}
                onChange={handleClip}
                autoComplete="off"
                onClick={(e) => e.currentTarget.select()}
                disabled={lock}
              />
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title"
                className="w-full pl-6 py-3 bg-gray focus:outline-none rounded-md hover:bg-black transition duration-300 border"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
                disabled={lock}
                maxLength={100}
              />

              <div className="mt-2">
                {clip?.thumbnail && <Video thumbnail={clip.thumbnail}></Video>}
              </div>
            </div>
            {clip && mirror.on && (
              <div className="px-3 py-2">
                <p className="mb-2">
                  Step 1: Download{" "}
                  <a
                    href={clip.thumbnail.replace(
                      "-preview-480x272.jpg",
                      ".mp4"
                    )}
                    className="text-primary hover:underline"
                  >
                    {title}
                  </a>
                </p>
                <p className="mb-2">
                  Step 2: Upload clip to{" "}
                  <a
                    href="https://streamable.com/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Streamable
                  </a>
                </p>
                <div className="flex items-center">
                  <p className="flex-shrink-0 mr-3">Step 3:</p>
                  <div className="w-full">
                    <input
                      type="text"
                      className="w-full bg-dark focus:outline-none rounded-full border px-3 py-2"
                      placeholder="Streamable URL"
                      onChange={(e) => {
                        const streamable = e.currentTarget.value.match(
                          /^https?:\/\/(www\.)?(streamable)\.com\/([\w]+)$/
                        );

                        if (streamable) {
                          setMirror({
                            ...mirror,
                            value: e.currentTarget.value,
                            error: false,
                          });
                        } else if (e.currentTarget.value) {
                          setMirror({
                            ...mirror,
                            value: null,
                            error: true,
                          });
                        } else {
                          setMirror({
                            ...mirror,
                            value: null,
                            error: false,
                          });
                        }
                      }}
                    />
                    {mirror.error && (
                      <p className="text-sm text-muted">
                        Streamable link wrong
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleUpload} method="post" className="px-3 py-3">
              <div className="flex lg:flex-row flex-col justify-between items-center">
                <div className="flex lg:flex-row flex-col w-full">
                  {clip && (
                    <div
                      className={`
                      rounded-full py-1 px-6 border-2 font-semibold focus:outline-none lg:w-32 w-full text-center cursor-pointer lg:mr-2 lg:mb-0 mb-2
                      ${
                        mirror.on &&
                        "border-[#0f90fa] bg-[#0f90fa] text-white-light"
                      }
                    `}
                      onClick={() => setMirror({ ...mirror, on: !mirror.on })}
                    >
                      <i
                        className={`fas ${mirror.on ? "fa-check" : "fa-plus"}`}
                      ></i>{" "}
                      Mirror
                    </div>
                  )}
                  <div
                    className={`
                      rounded-full py-1 px-6 border-2 font-semibold focus:outline-none lg:w-32 w-full text-center cursor-pointer lg:mr-2 lg:mb-0 mb-2
                      ${spoiler && "border-secondary bg-secondary"}
                    `}
                    onClick={() => setSpoiler(!spoiler)}
                  >
                    <i
                      className={`fas ${spoiler ? "fa-check" : "fa-plus"}`}
                    ></i>{" "}
                    Spoiler
                  </div>
                  <div
                    className={`
                      rounded-full py-1 px-6 border-2 font-semibold focus:outline-none lg:w-28 w-full text-center cursor-pointer lg:mb-0 mb-2
                      ${tos && "border-red-500 bg-red-500"}
                    `}
                    onClick={() => setTos(!tos)}
                  >
                    <i className={`fas ${tos ? "fa-check" : "fa-plus"}`}></i>{" "}
                    TOS
                  </div>
                </div>
                {lock ? (
                  <div>
                    <div className="spinner w-[35px] h-[35px]"></div>
                  </div>
                ) : (
                  <button
                    className={`rounded-full py-1 px-6 font-semibold bg-primary focus:outline-none hover:bg-opacity-80 lg:w-40 w-full text-white-light ${
                      title && clip && !mirror.error ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!!!(title && clip && !mirror.error)}
                  >
                    Upload
                  </button>
                )}
              </div>
            </form>
            <div className="bg-gray px-3 py-3 rounded-b-md">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="notification"
                  id="notification"
                  className="mr-2 bg-primary"
                  checked={notification}
                  onChange={() => setNotification(!notification)}
                />
                <span>Send me clip reply notifications</span>
              </div>
            </div>
          </div>
          <div className="">
            <div className="bg-dark lg:rounded-md px-3 py-3 mb-3 border-t border-b lg:border-r lg:border-l">
              <p className="border-b-2 pb-1 font-semibold mb-2 text-lg">
                Uploading to Justclip
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li className="border-b-2 pb-1">Remember the human</li>
                <li className="border-b-2 pb-1">
                  Behave like you would in real life
                </li>
                <li>Read Justclip’s content policy</li>
              </ol>
            </div>
            <Footer ad={false}></Footer>
          </div>
        </>
      </Grid>
    </>
  );
};

/* eslint-disable react/display-name */
Upload.layout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default Upload;
