import React, { useState } from "react";

import type { Category } from "../types/category";
import type { Clip } from "../types/clip";
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
  const [spoiler, setSpoiler] = useState(false);
  const [loud, setLoud] = useState(false);
  // const [tos, setTos] = useState(false);
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
      loud,
      notification,
    };

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
          {clip?.category.name === "Just Chatting" && (
            <div className="bg-dark border-l-8 border-t border-b border-r border-yellow-300 p-3 mb-3 rounded-md flex items-center lg:mx-0 mx-2 lg:mt-0 mt-3">
              <i className="fas fa-exclamation-triangle text-2xl mr-3 text-yellow-300"></i>
              <div>
                <p className="text-lg">Just Chatting should be:</p>
                <p className="text-sm">
                  Either about a game directly, people talking about gaming, or
                  something fun that has happened involving games... Please keep
                  the clips primarily centralized around games and the people
                  who play them!
                </p>
              </div>
            </div>
          )}

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
            <form onSubmit={handleUpload} method="post" className="px-3 py-3">
              <div className="flex lg:flex-row flex-col justify-between items-center">
                <div className="flex lg:flex-row flex-col w-full">
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
                      rounded-full py-1 px-6 border-2 font-semibold focus:outline-none lg:w-32 w-full text-center cursor-pointer lg:mr-2 lg:mb-0 mb-2
                      ${loud && "border-yellow-300 bg-yellow-300 text-black"}
                    `}
                    onClick={() => setLoud(!loud)}
                  >
                    <i className={`fas ${loud ? "fa-check" : "fa-plus"}`}></i>{" "}
                    Loud
                  </div>
                  {/* <div
                    className={`
                      rounded-full py-1 px-6 border-2 font-semibold focus:outline-none lg:w-28 w-full text-center cursor-pointer lg:mb-0 mb-2
                      ${tos && "border-red-500 bg-red-500"}
                    `}
                    onClick={() => setTos(!tos)}
                  >
                    <i className={`fas ${tos ? "fa-check" : "fa-plus"}`}></i>{" "}
                    TOS
                  </div> */}
                </div>
                {lock ? (
                  <div>
                    <div className="spinner w-[35px] h-[35px]"></div>
                  </div>
                ) : (
                  <button
                    className={`rounded-full py-1 px-6 font-semibold bg-primary focus:outline-none hover:bg-opacity-80 lg:w-40 w-full text-white-light ${
                      title && clip ? "" : "cursor-not-allowed"
                    }`}
                    disabled={!!!(title && clip)}
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
