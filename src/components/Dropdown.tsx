import { Menu, Transition } from "@headlessui/react";
import { type FC, Fragment, type ReactNode } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { TbEdit } from "react-icons/tb";
import { TiDeleteOutline } from "react-icons/ti";
import { MdKeyboardArrowDown } from "react-icons/md";

interface IDropdown {
  deleteHandler?: () => void;
  editHandler?: () => void;
  icon: "column" | "arrow";
  children?: ReactNode;
}

const Dropdown: FC<IDropdown> = ({
  deleteHandler,
  editHandler,
  icon,
  children,
}) => {
  return (
    <Menu as="div" className="relative z-50 inline-block text-left">
      <Menu.Button>
        {icon === "column" && <SlOptionsVertical size={18} color="gray" />}
        {icon === "arrow" && <MdKeyboardArrowDown color="#645fc6" />}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-zinc-800 rounded-md bg-[#2c2c38] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {editHandler && (
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500" : ""
                    } group flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-sm text-white`}
                    onClick={(e) => {
                      e.preventDefault();
                      editHandler();
                    }}
                  >
                    <TbEdit size={17} />
                    Edit
                  </button>
                )}
              </Menu.Item>
            </div>
          )}
          {deleteHandler && (
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500" : ""
                    } group flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-sm text-red-500`}
                    onClick={(e) => {
                      e.preventDefault();
                      deleteHandler();
                    }}
                  >
                    <TiDeleteOutline size={17} />
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          )}
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
