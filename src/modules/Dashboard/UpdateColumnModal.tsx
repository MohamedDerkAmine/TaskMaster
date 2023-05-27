import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { atom, useAtom } from "jotai";
import { type FC, Fragment } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/utils/api";
import { columnToUpdateAtom } from "../../components/Column";
import { Input, Modal } from "../../components";

export const isUpdateBaordModalOpenAtom = atom<boolean>(false);

const updateColumnSchema = z.object({
  title: z.string().optional(),
});

const UpdateColumnModal: FC<{ refetchCols: () => void }> = ({
  refetchCols,
}) => {
  const [columnToUpdate, setColumnToUpdate] = useAtom(columnToUpdateAtom);
  const updateColumnMutation = api.column.update.useMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(updateColumnSchema),
  });

  const columnUpdate = (data: FieldValues) => {
    updateColumnMutation.mutate(
      {
        columnId: columnToUpdate?.id,
        title: data.title as string,
      },
      {
        onSuccess() {
          reset();
          refetchCols();
          setColumnToUpdate(null);
        },
      }
    );
  };

  return (
    <Modal
      show={columnToUpdate?.id ? true : false}
      onClose={() => setColumnToUpdate(null)}
      onSubmit={(e) => {
        void handleSubmit(columnUpdate)(e);
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
            Update Column
          </Dialog.Title>
          <Input
            name="title"
            type="text"
            control={control}
            label="Title"
            placeholder="e.g.Launch Tasks"
            defaultValue={columnToUpdate?.title}
          />
          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 font-medium text-white"
          >
            Update Column
          </button>
        </Dialog.Panel>
      </Transition.Child>
    </Modal>
  );
};

export default UpdateColumnModal;
