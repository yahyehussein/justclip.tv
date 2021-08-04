import React, { useState } from "react";

import { Clip } from "../types/clip";
import { Comment } from "../types/comment";
import { InertiaLink } from "@inertiajs/inertia-react";
import ReactModal from "react-modal";
import { User } from "../types/user";
import axios from "axios";

interface BulletChatMessage {
  id: number;
  text: string;
}

const Report = ({
  className,
  type,
  user,
  clip,
  comment,
  auth,
  children,
}: {
  className: string;
  type: "clip" | "comment" | "user";
  user?: User;
  clip?: Clip;
  comment?: Comment;
  auth?: User;
  children: JSX.Element;
}): JSX.Element => {
  const rules = [
    {
      name: "Title spoiling",
    },
    {
      name: "Personal attacks",
    },
    {
      name: "Discrimination",
    },
    {
      name: "Unsourced allegations",
    },
    {
      name: "Out of context content",
    },
    {
      name: "Witch hunting",
    },
    {
      name: "Doxing",
    },
    {
      name: "Politics",
    },
    {
      name: "Clickbait",
    },
    {
      name: "Self Promotion",
    },
    {
      name: "Vote Manipulation",
    },
    {
      name: `"He Said It" Clips`,
    },
    {
      name: "Swatting",
    },
    {
      name: "Death And Injuries",
    },
    {
      name: "Twitch Community Guideline",
    },
  ];

  // Refactor to useReducer
  const [isOpen, setIsOpen] = useState(false);
  const [rule, setRule] = useState<number | null>(null);
  const [next, setNext] = useState(false);
  const [nextSelectMessage, setNextSelectMessage] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [bulletChat, setBulletChat] = useState(false);
  const [bulletChatMessages, setBulletChatMessages] = useState<
    BulletChatMessage[]
  >([]);
  const [searchBulletChat, setSearchBulletChat] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (rule !== null) {
      const bulletChat = bulletChatMessages.filter(
        (item) => item.id === selectedMessage
      )[0];

      const data = {
        user_id: user ? user.id : null,
        clip_id: clip ? clip.id : null,
        bullet_chat_id: selectedMessage !== null ? bulletChat.id : null,
        comment_id: comment?.id,
        report: {
          type: selectedMessage ? "bullet chat" : type,
          from: {
            id: auth?.id,
            login: auth?.login,
            display_name: auth?.display_name,
            avatar: auth?.avatar,
            avatar_frame: auth?.avatar_frame,
            roles: auth?.roles,
          },
          rule: rules[rule].name,
        },
      };

      axios.post("/reports", data);
    }

    setIsOpen(false);
    setRule(null);
    setNext(false);
    setNextSelectMessage(false);
    setSelectedChoice(null);
    setBulletChat(false);
    setBulletChatMessages([]);
    setSearchBulletChat("");
    setSelectedMessage(null);
  };

  const search = (): BulletChatMessage[] => {
    if (searchBulletChat) {
      return bulletChatMessages.filter((item) => {
        if (item["text"]) {
          return searchBulletChat
            .toLowerCase()
            .split(" ")
            .every((v) => item["text"].toLowerCase().includes(v));
        }
      });
    } else {
      return bulletChatMessages;
    }
  };

  const getBulletChat = () => {
    setLoading(true);
    axios.get(`/bullet/chat?id=${clip?.id}`).then(({ data }) => {
      setBulletChatMessages(data.data);
      setLoading(false);
    });
  };

  return (
    <>
      <button
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {children}
      </button>

      <ReactModal
        isOpen={isOpen}
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
        overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
      >
        <div
          className="bg-dark broder shadow-md rounded-md z-50"
          style={{ width: "505px" }}
        >
          <div className="flex justify-between items-center border-b p-3 text-muted font-semibold">
            <p>
              {next && (
                <button
                  className="focus:outline-none mr-2 p-1"
                  onClick={() => {
                    setNext(false);
                    setNextSelectMessage(false);
                    setSelectedChoice(null);
                    setBulletChatMessages([]);
                    setSelectedMessage(null);
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              )}
              Submit a Report
            </p>
            <button
              className="focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          {next && rule !== null ? (
            <>
              {nextSelectMessage && (
                <>
                  <div className="p-3">
                    <p>Select bullet chat message</p>
                  </div>
                  <div className="flex items-center pr-3 text-base text-gray-400 bg-gray group hover:bg-black transition duration-300 border">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      autoComplete="off"
                      className="w-full pl-3 py-3 bg-gray focus:outline-none group-hover:bg-black transition duration-300 flex-grow"
                      onChange={(e) => setSearchBulletChat(e.target.value)}
                      value={searchBulletChat}
                    />
                    <div className="hover:text-primary justify-self-stretch cursor-pointer">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                  {loading && (
                    <div className="pt-2 flex justify-center">
                      <div className="spinner w-[35px] h-[35px]"></div>
                    </div>
                  )}
                  <div className="h-96 overflow-auto">
                    {search().map(({ id, text }) => {
                      return (
                        <div
                          key={id}
                          className="p-3 border-b flex justify-between items-center cursor-pointer"
                          onClick={() => {
                            setSelectedMessage(id);
                          }}
                        >
                          <p className="break-all">{text}</p>
                          <div
                            className={`rounded-full border w-5 h-5 flex-shrink-0 ${
                              selectedMessage === id
                                ? "bg-primary border-primary"
                                : ""
                            }`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="flex items-center justify-end p-3">
                {bulletChat ? (
                  !bulletChatMessages.length ? (
                    <button
                      onClick={() => {
                        setNextSelectMessage(true);
                        getBulletChat();
                      }}
                      className={`bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none ${
                        selectedChoice !== null ? "hover:bg-opacity-80" : ""
                      }`}
                      disabled={selectedChoice === null}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitReport}
                      className={`bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none ${
                        selectedMessage !== null ? "hover:bg-opacity-80" : ""
                      }`}
                      disabled={selectedMessage === null}
                    >
                      Submit Rport
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleSubmitReport}
                    className={`bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none ${
                      selectedChoice !== null ? "hover:bg-opacity-80" : ""
                    }`}
                    disabled={selectedChoice === null}
                  >
                    Submit Rport
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="p-3 border-b">
                <p className="mb-2">
                  Thanks for looking out for yourself and your fellow clippers
                  by reporting things that break the rules. Let us know
                  what&apos;s happening, and we&apos;ll look into it.
                </p>

                {type === "clip" && (
                  <div className="flex mb-3">
                    <button
                      className={`border-t border-b border-l border-r hover:bg-secondary p-3 flex-1 focus:outline-none ${
                        !bulletChat ? "bg-secondary" : ""
                      }`}
                      onClick={() => {
                        setBulletChat(false);
                      }}
                    >
                      Clip
                    </button>
                    <button
                      className={`border-t border-b border-r hover:bg-secondary p-3 flex-1 focus:outline-none ${
                        bulletChat ? "bg-secondary" : ""
                      }`}
                      onClick={() => {
                        setBulletChat(true);
                      }}
                    >
                      Bullet Chat
                    </button>
                  </div>
                )}
                <div className="flex flex-wrap items-center mb-2">
                  {rules.map(({ name }, index) => {
                    return (
                      <button
                        key={name}
                        className={`rounded-full border px-2 py-1 hover:bg-primary hover:text-white-light text-lg mr-1 mb-2 focus:outline-none ${
                          rule === index
                            ? "bg-primary border-primary hover:text-white-light text-white-light"
                            : ""
                        }`}
                        onClick={() => {
                          setRule(index);
                        }}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
                <div className="bg-secondary flex items-center p-2 text-muted text-sm rounded-md">
                  <i className="fas fa-info-circle mr-2"></i>
                  <p>
                    Not sure if something is breaking the rules? Review
                    Justclip&apos;s{" "}
                    <InertiaLink
                      href="/content-policy"
                      className="text-primary hover:underline"
                    >
                      Content Policy
                    </InertiaLink>
                  </p>
                </div>
                {!!!auth && (
                  <div className="bg-primary flex items-center p-2 text-white-light text-sm rounded-md mt-2">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <p>
                      You need to be login to report{" "}
                      <a href="/login" className="text-red-200 hover:underline">
                        Connect with Twitch
                      </a>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-3">
                {!!auth && rule !== null ? (
                  bulletChat && !bulletChatMessages.length ? (
                    <button
                      onClick={() => {
                        setNext(true);
                        setNextSelectMessage(true);
                        getBulletChat();
                      }}
                      className={`bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none ${
                        rule !== null ? "hover:bg-opacity-80" : ""
                      }`}
                      disabled={rule === null}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitReport}
                      className={`bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none ${
                        rule !== null ? "hover:bg-opacity-80" : ""
                      }`}
                      disabled={rule === null}
                    >
                      Submit Rport
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="bg-primary rounded-full px-5 py-1 font-semibold uppercase flex-shrink-0 focus:outline-none hover:bg-opacity-80"
                  >
                    Close
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </ReactModal>
    </>
  );
};

export default Report;
