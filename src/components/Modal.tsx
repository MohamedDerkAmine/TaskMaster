import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { FC, ReactElement, FormEvent } from "react";

interface IModal {
  show: boolean;
  onClose: () => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactElement;
}

const Modal: FC<IModal> = ({ show, onClose, onSubmit, children }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <form className="fixed inset-0 overflow-y-auto" onSubmit={onSubmit}>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {children}
          </div>
        </form>
      </Dialog>
    </Transition>
  );
};

export default Modal;
