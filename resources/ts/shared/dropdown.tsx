import { Menu } from "@headlessui/react";
import React from "react";

const Dropdown = ({
  menu,
  menuClassName,
  itemsClassName,
  children,
}: {
  menu: string | JSX.Element;
  menuClassName?: string;
  itemsClassName?: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Menu>
        <Menu.Button className={`focus:outline-none h-full ${menuClassName}`}>
          {menu}
        </Menu.Button>
        <Menu.Items className={itemsClassName}>
          {React.Children.map(children, (child) => (
            <Menu.Item>{child}</Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default Dropdown;
