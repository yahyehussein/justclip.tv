import React, { useState } from "react";

import { InertiaLink } from "@inertiajs/inertia-react";
import ReactModal from "react-modal";

const Remove = ({
  className,
  children,
  onConfirmed,
}: {
  className: string;
  children: JSX.Element;
  onConfirmed: (rule: string, confirm: boolean) => void;
}): JSX.Element => {
  const rules = [
    {
      name: "Not Gaming Related",
    },
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

  const [isOpen, setIsOpen] = useState(false);
  const [rule, setRule] = useState<number | null>(null);

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
            <p>Remove Clip?</p>
            <button
              className="focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-3 border-b">
            <p className="mb-2">
              Thanks for looking out for yourself and your fellow clippers by
              removing things that break the rules.
            </p>

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
          </div>
          <div className="flex items-center justify-end p-3">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="border rounded-md p-2 mr-2 bg-secondary hover:bg-gray focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (rule !== null) {
                  onConfirmed(rules[rule].name, true);
                  setIsOpen(false);
                  setRule(null);
                }
              }}
              className="rounded-md p-2 bg-primary text-white-light hover:bg-opacity-80 focus:outline-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default Remove;
