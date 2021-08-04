import React, { useState } from "react";

import ReactModal from "react-modal";

const Confirm = ({
  id,
  title,
  rule,
  description,
  className,
  onConfirmed,
  children,
}: {
  id: number;
  title: string;
  rule?: string;
  description: string;
  className: string;
  onConfirmed: (id: number, confirm: boolean, rule?: string) => void;
  children: JSX.Element;
  index?: number;
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={className}
        onClick={() => {
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
        <div className="bg-dark broder shadow-md rounded-md w-96 h-auto z-50 mx-3">
          <div className="px-3 py-2 flex justify-between border-b">
            <p className="font-bold">{title}</p>
            <button
              className="focus:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="p-3">{description}</p>
          <div className="p-3 bg-secondary flex justify-end rounded-b-md">
            <button
              onClick={() => {
                setIsOpen(false);
                onConfirmed(id, false);
              }}
              className="border rounded-md p-2 mr-2 bg-secondary hover:bg-gray focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onConfirmed(id, true, rule);
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

export default Confirm;
