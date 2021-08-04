import "react-perfect-scrollbar/dist/css/styles.css";

import React, { useContext, useState } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import { Popover } from "@headlessui/react";
import { clipContext } from "@context/clipContext";

interface Emote {
  id: string | number;
  urls: Record<number, string>;
  code: string;
  name: string;
}

const Emotes = ({
  onEmote,
  showEmotes = false,
}: {
  onEmote: (emote: string) => void;
  showEmotes?: boolean;
}): JSX.Element | null => {
  const clip = useContext(clipContext);

  const [term, setTerm] = useState("");

  const search = (code: "code" | "name"): Emote[] => {
    if (clip?.emotes) {
      if (term) {
        return clip.emotes.filter((item) => {
          if (item[code]) {
            return term
              .toLowerCase()
              .split(" ")
              .every((v) => item[code].toLowerCase().includes(v));
          }
        });
      } else {
        return clip.emotes;
      }
    }

    return [];
  };

  if (clip.emotes) {
    if (clip.emotes.length) {
      return (
        <Popover className="relative flex-grow">
          {showEmotes ? (
            <>
              <Popover.Button className="focus:outline-none mr-2 flex items-center">
                <div className="lg:flex items-center overflow-hidden hidden">
                  {clip?.emotes.slice(0, 26).map(({ id }) => {
                    if (typeof id === "string") {
                      return (
                        <img
                          key={id}
                          src={`https://cdn.betterttv.net/emote/${id}/1x`}
                          alt="emote"
                          className="mr-1"
                        />
                      );
                    } else if (typeof id === "number") {
                      return (
                        <img
                          key={id}
                          src={`https://cdn.frankerfacez.com/emote/${id}/1`}
                          alt="emote"
                          className="mr-1"
                        />
                      );
                    }
                  })}
                </div>
                <div className="lg:hidden flex items-center">
                  <i className="far fa-smile-beam text-2xl"></i>
                </div>
              </Popover.Button>
            </>
          ) : (
            <Popover.Button>
              <i className="far fa-smile-beam text-2xl"></i>
            </Popover.Button>
          )}
          <Popover.Panel className="absolute bg-dark left-0 bottom-11 shadow-inner flex flex-col z-10 lg:w-[279px] h-[312px] w-full">
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              <div className="flex flex-wrap items-center content-start justify-center space-y-1 space-x-1 p-2 flex-grow">
                {search("code").map(({ id, code }) => {
                  if (typeof id === "string") {
                    return (
                      <img
                        key={id}
                        src={`https://cdn.betterttv.net/emote/${id}/1x`}
                        alt="emote"
                        className="mr-2 hover:bg-primary p-1 hover:bg-opacity-40 cursor-pointer emote"
                        data-tippy-content={code}
                        onClick={() => onEmote(code)}
                      />
                    );
                  }
                })}
                {search("name").map(({ id, name }) => {
                  if (typeof id === "number") {
                    return (
                      <img
                        key={id}
                        src={`https://cdn.frankerfacez.com/emote/${id}/1`}
                        alt="emote"
                        className="mr-2 hover:bg-primary p-1 hover:bg-opacity-40 cursor-pointer emote"
                        data-tippy-content={name}
                        onClick={() => onEmote(name)}
                      />
                    );
                  }
                })}
              </div>
            </PerfectScrollbar>
            <div className="flex items-center pr-3 text-base text-gray-400 bg-gray group hover:bg-black transition duration-300 border">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                autoComplete="off"
                className="w-full pl-3 py-3 bg-gray focus:outline-none group-hover:bg-black transition duration-300 flex-grow"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
              />
              <div className="hover:text-primary justify-self-stretch cursor-pointer">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      );
    }
  }

  return <div></div>;
};

export default Emotes;
