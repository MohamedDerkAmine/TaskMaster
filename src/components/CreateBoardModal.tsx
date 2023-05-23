import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { type FC, Fragment } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import Input from "./Input";
import Modal from "./Modal";
import { boardAtom } from "./Sidebar";

const newBoardSchema = z.object({
  board_title: z.string().min(1),
  board_description: z.string().min(1),
});

const CreateBoardModal: FC<{ refetchBoards: () => void }> = ({
  refetchBoards,
}) => {
  const [board, setBoard] = useAtom(boardAtom);
  const createBoardMutation = api.board.create.useMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(newBoardSchema),
  });

  const createBoardHandler = (data: FieldValues) => {
    createBoardMutation.mutate(
      {
        title: data.board_title as string,
        description: data.board_description as string,
      },
      {
        onSuccess(data) {
          refetchBoards();
          setBoard({
            ...board,
            boards: data,
            isCreateBoardModalOpen: false,
          });
          setValue("board_title", null);
          setValue("board_description", null);
        },
      }
    );
  };

  return (
    <Modal
      show={board?.isCreateBoardModalOpen ? true : false}
      onClose={() => setBoard({ ...board, isCreateBoardModalOpen: false })}
      onSubmit={(e) => {
        void handleSubmit(createBoardHandler)(e);
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
            Add New Board
          </Dialog.Title>
          <Input
            name="board_title"
            type="text"
            control={control}
            label="Title"
            placeholder="e.g.Launch Tasks"
          />
          <Input
            name="board_description"
            type="textarea"
            control={control}
            label="Description"
            placeholder="e.g.This Board is for the frontend dev team t handle the frontend"
          />
          <button
            type="submit"
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 rounded-full py-3 font-medium text-white ${
              isValid ? "bg-secondary" : "bg-secondary/50"
            }`}
          >
            Create Board
          </button>
        </Dialog.Panel>
      </Transition.Child>
    </Modal>
  );
};

export default CreateBoardModal;
