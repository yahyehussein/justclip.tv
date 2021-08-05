import React, { useState } from "react";

import { Menu } from "@headlessui/react";
import ReactModal from "react-modal";
import { useRemember } from "@inertiajs/inertia-react";

const SortClips = ({
  onSort,
  comments,
}: {
  onSort: (sortBy: string) => void;
  comments?: boolean;
}): JSX.Element => {
  const [hot, setHot] = useRemember(true, "hot");
  const [newest, setNewest] = useRemember(false, "newest");
  const [top, setTop] = useRemember(false, "top");
  const [topDate, setTopDate] = useRemember("today", "date");
  const [isSortClipByOpen, setIsSortClipByOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [sortClipBy, setSortClipBy] = useRemember("hot", "sortClipBy");
  const [sortBy, setSortBy] = useRemember("past day", "sortBy");

  const handleSort = (sortBy: string, topDate = "today") => {
    switch (sortBy) {
      case "hot":
        setNewest(false);
        setTop(false);
        setHot(true);
        onSort(`&hot=true`);
        break;
      case "newest":
        setHot(false);
        setTop(false);
        setNewest(true);
        onSort(`&newest=true`);
        break;
      case "top":
        setHot(false);
        setNewest(false);
        setTop(true);
        setTopDate(topDate);
        onSort(`&top=true&t=${topDate}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center lg:mr-0 mr-2">
      <div className="lg:flex hidden font-semibold items-center">
        <button
          className={`px-3 py-1 rounded-full mr-2 hover:bg-opacity-80 font-semibold focus:outline-none ${
            hot ? "border" : "bg-secondary"
          }`}
          onClick={() => handleSort("hot")}
        >
          <i className="fas fa-fire"></i> Hot
        </button>
        <button
          className={`px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none ${
            newest ? "border" : "bg-secondary"
          }`}
          onClick={() => handleSort("newest")}
        >
          <i className="fas fa-certificate"></i> Newest
        </button>
        {!comments && (
          <>
            <button
              className={`px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none ml-2 ${
                top ? "border" : "bg-secondary"
              }`}
              onClick={() => handleSort("top")}
            >
              <i className="fas fa-list-ol"></i> Top
            </button>
            {!!top && (
              <div className="relative">
                <Menu>
                  <Menu.Button className="border px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none ml-2 capitalize">
                    {topDate}
                  </Menu.Button>
                  <Menu.Items className="absolute top-[42px] right-0 w-32 z-50 bg-dark border rounded-md shadow-md">
                    <Menu.Item>
                      <button
                        className={`block px-3 py-2 hover:bg-secondary w-full text-left focus:outline-none ${
                          topDate === "today" ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSort("top", "today")}
                      >
                        Today
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={`block px-3 py-2 hover:bg-secondary w-full text-left focus:outline-none ${
                          topDate === "week" ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSort("top", "week")}
                      >
                        This Week
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={`block px-3 py-2 hover:bg-secondary w-full text-left focus:outline-none ${
                          topDate === "month" ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSort("top", "month")}
                      >
                        This Month
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={`block px-3 py-2 hover:bg-secondary w-full text-left focus:outline-none ${
                          topDate === "year" ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSort("top", "year")}
                      >
                        This Year
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className={`block px-3 py-2 hover:bg-secondary w-full text-left focus:outline-none ${
                          topDate === "all" ? "bg-secondary" : ""
                        }`}
                        onClick={() => handleSort("top", "all")}
                      >
                        All Time
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            )}
          </>
        )}
      </div>
      <button
        className="px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none border lg:hidden block capitalize"
        onClick={() => {
          setIsSortClipByOpen(!isSortClipByOpen);
        }}
      >
        {sortClipBy === "hot" && <i className="fas fa-fire"></i>}
        {sortClipBy === "newest" && <i className="fas fa-certificate"></i>}
        {sortClipBy === "top" && <i className="fas fa-list-ol"></i>}{" "}
        {sortClipBy}
      </button>
      {sortClipBy === "top" && (
        <button
          className="px-3 py-1 rounded-full hover:bg-opacity-80 font-semibold focus:outline-none border lg:hidden block capitalize ml-2"
          onClick={() => {
            setIsSortByOpen(!isSortByOpen);
          }}
        >
          {sortBy}
        </button>
      )}

      <ReactModal
        isOpen={isSortClipByOpen}
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
        overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
      >
        <div className="bg-dark mx-3 border rounded-md z-50 p-2 w-full">
          <p className="uppercase border-b pb-2 mb-2 font-semibold flex justify-between">
            <span>Sort Clips by:</span>
            <button
              className="focus:outline-none"
              onClick={() => setIsSortClipByOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </p>

          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortClipBy === "hot" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("hot");
              setSortClipBy("hot");
              setIsSortClipByOpen(false);
            }}
          >
            <i className="fas fa-fire"></i> Hot
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortClipBy === "newest" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("newest");
              setSortClipBy("newest");
              setIsSortClipByOpen(false);
            }}
          >
            <i className="fas fa-certificate"></i> Newest
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none  w-full ${
              sortClipBy === "top" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top");
              setSortClipBy("top");
              setIsSortClipByOpen(false);
            }}
          >
            <i className="fas fa-list-ol"></i> Top
          </button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={isSortByOpen}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
        overlayClassName="fixed inset-0 bg-dark bg-opacity-30"
      >
        <div className="bg-dark mx-3 border rounded-md z-50 p-2 w-full">
          <p className="uppercase border-b pb-2 mb-2 font-semibold flex justify-between">
            <span>Sort by:</span>
            <button
              className="focus:outline-none"
              onClick={() => setIsSortByOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </p>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortBy === "past day" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top", "today");
              setSortBy("past day");
              setIsSortByOpen(false);
            }}
          >
            Past Day
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortBy === "past week" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top", "week");
              setSortBy("past week");
              setIsSortByOpen(false);
            }}
          >
            Past Week
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortBy === "past month" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top", "month");
              setSortBy("past month");
              setIsSortByOpen(false);
            }}
          >
            Past Month
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full mb-2 ${
              sortBy === "past year" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top", "year");
              setSortBy("past year");
              setIsSortByOpen(false);
            }}
          >
            Past Year
          </button>
          <button
            className={`px-3 py-1 rounded-full mr-2 font-semibold focus:outline-none w-full ${
              sortBy === "all time" ? "border" : "bg-secondary"
            }`}
            onClick={() => {
              handleSort("top", "all");
              setSortBy("all time");
              setIsSortByOpen(false);
            }}
          >
            All Time
          </button>
        </div>
      </ReactModal>
    </div>
  );
};

export default SortClips;
