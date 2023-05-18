import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Column, SubTask, Task } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { type FC, Fragment, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { HiXMark } from "react-icons/hi2";
import { z } from "zod";
import { api } from "~/utils/api";
import { Modal, Dropdown, Input } from "./";

export const taskAtom = atom<{
  currentTask?: Task & { subTasks: SubTask[] };
  isTaskDetailsModalOpen?: boolean;
} | null>(null);

const isUpdateTaskModalOpenAtom = atom(false);

interface ITaskDetailModal {
  cols: (Column & { tasks: (Task & { subTasks: SubTask[] })[] })[] | undefined;
  refetchCols: () => void;
}

const updateTaskSchema = z.object({
  title: z.string().optional(),
  columnId: z.string().optional(),
  description: z.string().optional(),
  subTasks: z.array(z.string().optional()).optional(),
  newSubTasks: z.array(z.string().optional()).optional(),
});

const TaskDetailsModal: FC<ITaskDetailModal> = ({ cols, refetchCols }) => {
  const [task, setTask] = useAtom(taskAtom);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useAtom(
    isUpdateTaskModalOpenAtom
  );
  const [subTasksIdsToDelete, setSubTasksIdsToDelete] = useState<number[]>([]);

  const [subTasksInputs, setSubTasksInputs] = useState<number[]>([]);
  const deleteTaskMutation = api.task.delete.useMutation();
  const updateSubTaskMutation = api.task.updateSubTask.useMutation();
  const updateTaskMutation = api.task.update.useMutation();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isValid, errors },
  } = useForm({
    // resolver: zodResolver(updateTaskSchema),
  });

  useEffect(() => console.log(errors), [errors]);
  const taskUpdate = (data: z.infer<typeof updateTaskSchema>) => {
    let SubTasks;

    if (
      isNaN(data.subTasks) &&
      data.subTasks?.filter((subTask) => subTask).length > 0 &&
      data.newSubTasks?.length > 0
    ) {
      SubTasks = [
        ...data.subTasks?.filter((subTask) => subTask && subTask.length > 0),
        ...data.newSubTasks?.filter((subTask) => subTask),
      ];
    } else if (
      isNaN(data.subTasks) &&
      data.subTasks?.filter((subTask) => subTask).length > 0
    ) {
      SubTasks = data.subTasks?.filter((subTask) => subTask);
    } else if (data.newSubTasks && isNaN(data.newSubTasks)) {
      SubTasks = data.newSubTasks.filter((subTask) => subTask);
    } else {
      SubTasks = undefined;
    }

    console.log(SubTasks);

    updateTaskMutation.mutate(
      {
        taskId: task?.currentTask?.id,
        title: data.title as string,
        description: data.description as string,
        // columnId: data.columnId
        //   ? parseInt(data.columnId as string)
        //   : task?.currentTask?.columnId,
        subTasksIds:
          [...new Set(subTasksIdsToDelete)].length > 0
            ? [...new Set(subTasksIdsToDelete)]
            : undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        subTasks: SubTasks,
      },
      {
        onSuccess: () => {
          refetchCols();
          reset();
        },
      }
    );
  };

  return (
    <>
      <Modal
        show={isUpdateTaskModalOpen}
        onClose={() => setIsUpdateTaskModalOpen(false)}
        onSubmit={(e) => {
          void handleSubmit(taskUpdate)(e);
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
              Update Task
            </Dialog.Title>

            <Input
              name="title"
              type="text"
              control={control}
              label="Title"
              placeholder="e.g.Launch Tasks"
              defaultValue={task?.currentTask?.title}
            />

            <Input
              name="description"
              type="textarea"
              control={control}
              label="Title"
              placeholder="e.g.Launch Tasks"
              defaultValue={task?.currentTask?.description}
            />

            {task?.currentTask?.subTasks.map((subTask) => (
              <div
                className="flex w-full items-center gap-x-4"
                key={subTask.id}
              >
                <Input
                  name={`subTasks.${subTask.id}`}
                  control={control}
                  type="text"
                  defaultValue={subTask.content}
                />
                <HiXMark
                  size={30}
                  className="cursor-pointer text-slate-600 transition-all duration-200 ease-in-out hover:text-slate-400"
                  onClick={() => {
                    setValue(`subTasks.${subTask.id}`, "");
                    setSubTasksIdsToDelete([
                      ...subTasksIdsToDelete,
                      subTask.id,
                    ]);
                    setTask({
                      currentTask: {
                        ...task.currentTask,
                        subTasks: task.currentTask?.subTasks.filter(
                          (subT) => subTask.id !== subT.id
                        ),
                      },
                    });
                  }}
                />
              </div>
            ))}

            {subTasksInputs.map((subTaskInput) => (
              <div
                className="flex w-full items-center gap-x-4"
                key={`${subTaskInput}other`}
              >
                <Input
                  name={`newSubTasks.${subTaskInput}`}
                  control={control}
                  label=""
                  placeholder=""
                  type="text"
                />
                <HiXMark
                  size={30}
                  className="cursor-pointer text-slate-600 transition-all duration-200 ease-in-out hover:text-slate-400"
                  onClick={() => {
                    reset({
                      newSubTasks: {
                        [subTaskInput]: subTaskInput,
                      },
                    });
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
              // disabled={!isValid}
              className="flex items-center justify-center gap-2 rounded-full bg-secondary py-3 font-medium text-white"
            >
              Update Task
            </button>
          </Dialog.Panel>
        </Transition.Child>
      </Modal>
      <Modal
        show={task?.isTaskDetailsModalOpen ? true : false}
        onClose={() =>
          setTask({
            currentTask: task?.currentTask,
            isTaskDetailsModalOpen: false,
          })
        }
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
            {task?.currentTask && (
              <>
                <Dialog.Title className="flex items-center justify-between">
                  <p className="text-xl font-medium text-white">
                    {task.currentTask.title}
                  </p>
                  <Dropdown
                    icon="column"
                    editHandler={() => {
                      setTask({
                        isTaskDetailsModalOpen: false,
                        currentTask: task.currentTask,
                      });
                      setIsUpdateTaskModalOpen(true);
                    }}
                    deleteHandler={() => {
                      deleteTaskMutation.mutate(
                        {
                          taskId: task.currentTask?.id,
                        },
                        {
                          onSuccess() {
                            setTask({ isTaskDetailsModalOpen: false });
                            refetchCols();
                          },
                        }
                      );
                    }}
                  />
                </Dialog.Title>
                <p className="text-gray-500">{task.currentTask.description}</p>
                <p className="text-sm font-medium text-white">
                  Subtasks (
                  {
                    task.currentTask.subTasks.filter(
                      (subTask) => subTask.status
                    ).length
                  }{" "}
                  of {task.currentTask.subTasks.length})
                </p>
                {task.currentTask.subTasks.map((subTask) => (
                  <label
                    htmlFor={subTask.id.toString()}
                    key={subTask.id}
                    className="flex cursor-pointer items-center gap-x-5 rounded-md bg-tertiary p-3 transition-colors duration-100 ease-in hover:bg-tertiary/50"
                    onClick={() => {
                      updateSubTaskMutation.mutate(
                        {
                          id: subTask.id,
                          content: subTask.content,
                          status: !subTask.status,
                        },
                        { onSuccess: () => refetchCols() }
                      );
                    }}
                  >
                    <input
                      defaultChecked={subTask.status}
                      id={subTask.id.toString()}
                      aria-describedby="comments-description"
                      type="checkbox"
                      className="peer h-4 w-4 rounded border-2 border-zinc-700 bg-transparent text-indigo-600 focus:ring-indigo-600"
                    />
                    <span className="text-white peer-checked:text-gray-500 peer-checked:line-through">
                      {subTask.content}
                    </span>
                  </label>
                ))}
                <p className="text-sm font-medium text-white">Status</p>
                <select
                  name="status"
                  id="status"
                  className="rounded-md border-2 border-[#393945] bg-transparent p-1.5 text-sm text-white"
                  onChange={(e) => {
                    updateTaskMutation.mutate(
                      {
                        taskId: task?.currentTask?.id,
                        columnId: cols?.filter(
                          (col) => col.title === e.target.value
                        )[0]?.id,
                      },
                      { onSuccess: () => refetchCols() }
                    );
                  }}
                >
                  {cols?.map((col) => (
                    <option
                      key={col.id}
                      value={col.title}
                      selected={col.id === task?.currentTask?.columnId}
                    >
                      {col.title}
                    </option>
                  ))}
                </select>
              </>
            )}
          </Dialog.Panel>
        </Transition.Child>
      </Modal>
    </>
  );
};

export default TaskDetailsModal;
