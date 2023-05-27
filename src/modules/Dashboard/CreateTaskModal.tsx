import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Column, SubTask, Task } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { type FC, Fragment, useState } from "react";
import { type FieldValues, useForm, Controller } from "react-hook-form";
import { HiXMark } from "react-icons/hi2";
import { z } from "zod";
import { api } from "~/utils/api";
import Input from "../../components/Input";
import Modal from "../../components/Modal";

const createTaskShema = z.object({
  title: z.string(),
  description: z.string(),
  columnId: z.string(),
  subTasks: z.array(z.string().optional()).optional(),
});

export const isCreateTaskModalOpenAtom = atom<boolean>(false);

const CreateTaskModal: FC<{
  refetchCols: () => void;
  cols: (Column & { tasks: (Task & { subTasks: SubTask[] })[] })[] | undefined;
}> = ({ refetchCols, cols }) => {
  const [subTasksInputs, setSubTasksInputs] = useState<number[]>([]);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useAtom(
    isCreateTaskModalOpenAtom
  );

  const creatTaskMutation = api.task.create.useMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(createTaskShema),
  });

  const creatTask = (data: FieldValues) => {
    creatTaskMutation.mutate(
      {
        title: data.title as string,
        description: data.description as string,
        columnId: parseInt(data.columnId as string),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        subTasks: data.subTasks
          ?.filter((subTask: string) => subTask !== undefined)
          .map((subTask: string) => ({
            content: subTask,
            status: false,
          })),
      },
      {
        onSuccess: () => {
          reset({ title: "", description: "", columnId: "" });
          refetchCols();
          setIsCreateTaskModalOpen(false);
          setSubTasksInputs([]);
        },
      }
    );
  };

  return (
    <Modal
      show={isCreateTaskModalOpen}
      onClose={() => setIsCreateTaskModalOpen(false)}
      onSubmit={(e) => {
        void handleSubmit(creatTask)(e);
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
            Add New Task
          </Dialog.Title>
          <Input
            name="title"
            type="text"
            control={control}
            label="Title"
            placeholder="e.g.Launch Tasks"
          />
          <Input
            name="description"
            type="textarea"
            control={control}
            label="Description"
            placeholder="e.g.This Board is for the frontend dev team t handle the frontend"
          />

          <div className="w-full">
            <p className="font-medium text-white">Subtasks</p>
            {subTasksInputs.map((subTaskInput) => (
              <div
                className="flex w-full items-center gap-x-4"
                key={subTaskInput}
              >
                <Input
                  name={`subTasks.${subTaskInput}`}
                  control={control}
                  label=""
                  placeholder=""
                  type="text"
                />
                <HiXMark
                  size={30}
                  className="cursor-pointer text-slate-600 transition-all duration-200 ease-in-out hover:text-slate-400"
                  onClick={() => {
                    reset({ subTasks: subTaskInput });
                    setSubTasksInputs([
                      ...subTasksInputs.filter((subT) => subT !== subTaskInput),
                    ]);
                  }}
                />
              </div>
            ))}

            <button
              type="button"
              className="my-4 w-full rounded-full bg-white py-2 text-center text-sm font-medium text-secondary"
              onClick={() =>
                setSubTasksInputs([
                  ...subTasksInputs,
                  subTasksInputs.length + 1,
                ])
              }
            >
              + Add New Subtask
            </button>
          </div>
          <div className="flex flex-col gap-y-2 text-white">
            <label htmlFor="status" className="font-medium">
              Status
            </label>
            <Controller
              name="columnId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="rounded-md border-2 border-[#393945] bg-transparent p-1.5 text-sm text-white"
                >
                  <option value="-">-</option>
                  {cols &&
                    cols.map((column) => (
                      <option value={column.id} key={column.id}>
                        {column.title}
                      </option>
                    ))}
                </select>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 font-medium text-white"
          >
            Create Task
          </button>
        </Dialog.Panel>
      </Transition.Child>
    </Modal>
  );
};

export default CreateTaskModal;
