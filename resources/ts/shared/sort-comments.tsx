import React, { useState } from "react";

import ReactModal from "react-modal";
import { useRemember } from "@inertiajs/inertia-react";

const SortComments = ({
  onSort,
}: {
  onSort: (sortBy: string) => void;
}): JSX.Element => {
  const [best, setBest] = useRemember(true, "best");
  const [newest, setNewest] = useRemember(false, "newest");
  const [oldest, setOldest] = useRemember(false, "oldest");
  const [sortCommentBy, setSortCommentBy] = useState("best");
  const [isSortCommentByOpen, setIsSortCommentByOpen] = useState(false);

  const handleSort = (sortBy: string) => {
    switch (sortBy) {
      case "best":
        setNewest(false);
        setOldest(false);
        setBest(true);
        onSort(`&best=true`);
        break;
      case "newest":
        setBest(false);
        setOldest(false);
        setNewest(true);
        onSort(`&newest=true`);
        break;
      case "oldest":
        setBest(false);
        setNewest(false);
        setOldest(true);
        onSort(`&oldest=true`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center">
      <div className="lg:flex hidden font-semibold items-center">
        <button
          className={`px-3 py-1 rounded-full mr-2 hover:bg-opacity-80 font-semibold focus:outline-none ${
            best ? "border" : "bg-secondary"
          }`}
          onClick={() => handleSort("best")}
        >
          <i className="fas fa-fire"></i> Best
        </button>
        <button
          className={`px-3 py-1 rounded-full mr-2 hover:bg-opacity-80 font-semibold focus:outline-none ${
            newest ? "border" : "bg-secondary"
          }`}
          onClick={() => handleSort("newest")}
        >
          <i className="fas fa-certificate"></i> Newest
        </button>
        <button
          className={`px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none ${
            oldest ? "border" : "bg-secondary"
          }`}
          onClick={() => handleSort("oldest")}
        >
          <i className="fas fa-history"></i> Oldest
        </button>
      </div>
      <button
        className="px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none border lg:hidden block capitalize"
        onClick={() => {
          setIsSortCommentByOpen(!isSortCommentByOpen);
        }}
      >
        {sortCommentBy === "best" && <i className="fas fa-fire"></i>}
        {sortCommentBy === "newest" && <i className="fas fa-certificate"></i>}
        {sortCommentBy === "oldest" && <i className="fas fa-history"></i>}{" "}
        {sortCommentBy}
      </button>

      <ReactModal
        isOpen={isSortCommentByOpen}
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
        overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
      >
        <div className="bg-dark mx-3 border rounded-md z-50 p-2 w-full">
          <p className="uppercase border-b pb-2 mb-2 font-semibold flex justify-between">
            <span>Sort Comments by:</span>
            <button
              className="focus:outline-none"
              onClick={() => setIsSortCommentByOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </p>

          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none  w-full mb-2 ${
              sortCommentBy === "best" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("best");
              setSortCommentBy("best");
              setIsSortCommentByOpen(false);
            }}
          >
            <i className="fas fa-fire"></i> best
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none  w-full mb-2 ${
              sortCommentBy === "newest" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("newest");
              setSortCommentBy("newest");
              setIsSortCommentByOpen(false);
            }}
          >
            <i className="fas fa-certificate"></i> Newest
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none  w-full ${
              sortCommentBy === "oldest" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("oldest");
              setSortCommentBy("oldest");
              setIsSortCommentByOpen(false);
            }}
          >
            <i className="fas fa-history"></i> Oldest
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default SortComments;
