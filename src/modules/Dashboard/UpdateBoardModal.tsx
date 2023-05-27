import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { atom, useAtom } from "jotai";
import { Fragment } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { boardAtom } from "./Sidebar";

export const isUpdateBaordModalOpenAtom = atom<boolean>(false);

const updateBoardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const UpdateBoardModal = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const [isUpdateBaordModalOpen, setIsUpdateBaordModalOpen] = useAtom(
    isUpdateBaordModalOpenAtom
  );
  const updateBoardMutation = api.board.update.useMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(updateBoardSchema),
  });

  const boardUpdate = (data: FieldValues) => {
    updateBoardMutation.mutate(
      {
        boardId: board?.currentBoard?.id,
        title: data.title as string,
        description: data.description as string,
      },
      {
        onSuccess(data) {
          reset();
          setBoard({
            ...board,
            currentBoard: data.board,
            boards: data.boards,
          });
          setIsUpdateBaordModalOpen(false);
        },
      }
    );
  };

  return (
    <Modal
      show={isUpdateBaordModalOpen}
      onClose={() => setIsUpdateBaordModalOpen(false)}
      onSubmit={(e) => {
        void handleSubmit(boardUpdate)(e);
      }}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Dialog.Panel className="flex w-full max-w-md transform flex-col gap-y-5 overflow-hidden rounded-2xl bg-primary p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-white"
          >
            Update Board
          </Dialog.Title>
          <Input
            name="title"
            type="text"
            control={control}
            label="Title"
            placeholder="e.g.Launch Tasks"
            defaultValue={board?.currentBoard?.title}
          />
          <Input
            name="description"
            type="textarea"
            control={control}
            label="Description"
            placeholder="e.g.This Board is for the frontend dev team t handle the frontend"
            defaultValue={board?.currentBoard?.description}
          />
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 font-medium text-white"
          >
            Update Board
          </button>
        </Dialog.Panel>
      </Transition.Child>
    </Modal>
  );
};

export default UpdateBoardModal;
