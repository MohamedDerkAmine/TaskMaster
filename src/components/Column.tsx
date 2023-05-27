import type { SubTask, Task, Column } from "@prisma/client";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import { type FC } from "react";
import { api } from "~/utils/api";
import Dropdown from "./Dropdown";
import { taskAtom } from "../modules/Dashboard/TaskDetailsModal";
import UpdateColumnModal from "../modules/Dashboard/UpdateColumnModal";

interface ICol {
  column: Column & { tasks: (Task & { subTasks: SubTask[] })[] };
  refetchCols: () => void;
}

const dragAtom = atom<number | null>(null);
export const columnToUpdateAtom = atom<{ id?: number; title?: string } | null>(
  null
);

const Col: FC<ICol> = ({ column, refetchCols }) => {
  const [_columnToUpdate, setColumnToUpdate] = useAtom(columnToUpdateAtom);
  const [_, setTask] = useAtom(taskAtom);
  const [drag, setDrag] = useAtom(dragAtom);
  const updateTaskMutation = api.task.update.useMutation();
  const deleteColumnMutation = api.column.delete.useMutation();

  const deleteColumn = (columnId: number) => {
    deleteColumnMutation.mutate(
      { columnId },
      { onSuccess: () => refetchCols() }
    );
  };

  return (
    <div
      key={column.id}
      className={`flex flex-col gap-y-5 rounded-md p-4 transition-all duration-300 ease-in-out ${
        drag === column.id ? "bg-primary/50" : "bg-transparent"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(column.id);
      }}
      onDrop={(e) => {
        updateTaskMutation.mutate(
          {
            title: undefined,
            taskId: parseInt(e.dataTransfer.getData("taskId")),
            columnId: column.id,
            description: undefined,
            subTasks: [],
            subTasksIds: [],
          },
          { onSuccess: () => refetchCols() }
        );
      }}
    >
      <p className="flex w-80 items-center justify-between uppercase text-gray-500">
        {column.title} ( {column.tasks.length} )
        <Dropdown
          icon="column"
          editHandler={() =>
            setColumnToUpdate({ id: column.id, title: column.title })
          }
          deleteHandler={() => deleteColumn(column.id)}
        />
      </p>
      <div className="flex flex-col gap-y-4">
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <motion.p
              draggable
              key={task.id}
              className="text-md flex cursor-pointer flex-col gap-y-2 rounded-md bg-primary p-3 font-medium text-white transition-colors duration-100 ease-in hover:bg-primary/50"
              onDragStart={(e: DragEvent) =>
                e.dataTransfer?.setData("taskId", task.id.toString())
              }
              onDragEnd={() => setDrag(null)}
              onClick={() =>
                setTask({
                  isTaskDetailsModalOpen: true,
                  currentTask: task,
                })
              }
            >
              <p>{task.title}</p>
              <p className="text-sm text-gray-500">
                {task.subTasks.filter((subTask) => subTask.status).length} of{" "}
                {task.subTasks.length} Subtasks
              </p>
            </motion.p>
          ))
        ) : (
          <div className="rounded-sm bg-gray-900/30 p-5 text-gray-400/50 text-gray-500">
            There is no tasks to display
          </div>
        )}
      </div>
      <UpdateColumnModal refetchCols={() => void refetchCols()} />
    </div>
  );
};

export default Col;
