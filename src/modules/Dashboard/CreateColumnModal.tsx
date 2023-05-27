import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { type FC, Fragment } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { isCreateColumnModalOpenAtom } from "./Board";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { boardAtom } from "./Sidebar";

const createColumnSchema = z.object({
  title: z.string().min(1),
});

const CreateColumnModal: FC<{ refetchCols: () => void }> = ({
  refetchCols,
}) => {
  const [board] = useAtom(boardAtom);
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useAtom(
    isCreateColumnModalOpenAtom
  );
  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm({
    resolver: zodResolver(createColumnSchema),
  });

  const createColumnMutation = api.column.create.useMutation();

  const submitHandler = (data: FieldValues) => {
    createColumnMutation.mutate(
      { title: data.title as string, boardId: board?.currentBoard?.id },
      {
        onSuccess() {
          setIsCreateColumnModalOpen(false);
          setValue("title", null);
          refetchCols();
        },
      }
    );
  };

  return (
    <Modal
      show={isCreateColumnModalOpen}
      onClose={() => setIsCreateColumnModalOpen(false)}
      onSubmit={(e) => {
        void handleSubmit(submitHandler)(e);
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
            Add New Column
          </Dialog.Title>
          <Input
            name="title"
            type="text"
            control={control}
            label="Title"
            placeholder="e.g.TODOS"
          />
          <button
            type="submit"
            disabled={!isValid}
            className={`flex items-center justify-center gap-2 rounded-full py-3 font-medium text-white ${
              isValid ? "bg-secondary" : "bg-secondary/50"
            }`}
          >
            Create Column
          </button>
        </Dialog.Panel>
      </Transition.Child>
    </Modal>
  );
};

export default CreateColumnModal;
