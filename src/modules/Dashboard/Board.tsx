import { atom, useAtom } from "jotai";
import { type FC } from "react";
import { api } from "~/utils/api";
import { boardAtom } from "./Sidebar";
import { TiPlus } from "react-icons/ti";
import { Menu } from "@headlessui/react";
import { Dropdown } from "../../components";
import { Col } from "../../components";
import CreateColumnModal from "./CreateColumnModal";
import TaskDetailsModal from "./TaskDetailsModal";

export const isCreateColumnModalOpenAtom = atom<boolean>(false);

const Board: FC = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const [_, setIsCreateColumnModalOpen] = useAtom(isCreateColumnModalOpenAtom);

  const { data: cols, refetch } = api.column.getAll.useQuery(
    {
      boardId: board?.currentBoard?.id ? board?.currentBoard?.id : 0,
    },
    {
      refetchOnWindowFocus: false,
      enabled: board?.currentBoard?.id ? true : false,
    }
  );

  return (
    <div className="h-full w-full overflow-x-hidden bg-tertiary">
      {board?.currentBoard ? (
        <div className="flex w-full gap-x-10 overflow-x-auto p-9">
          {cols &&
            cols.map((column) => (
              <Col
                key={column.id}
                column={column}
                refetchCols={() => void refetch()}
              />
            ))}
          <div
            onClick={() => setIsCreateColumnModalOpen(true)}
            className="flex h-[790px] w-80 cursor-pointer items-center justify-center rounded-md bg-gray-900/30 text-gray-400/50 transition-all duration-300 ease-out hover:bg-gray-900/80"
          >
            <p className="flex w-80 items-center justify-center text-2xl font-medium">
              <TiPlus size={25} />
              New Column
            </p>
          </div>

          <CreateColumnModal refetchCols={() => void refetch()} />

          <TaskDetailsModal cols={cols} refetchCols={() => void refetch()} />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-x-2 font-medium text-white">
          Select a Board
          <div className="block lg:hidden">
            <Dropdown icon="arrow">
              {board?.boards?.map((b) => {
                if (b.id !== board?.currentBoard?.id)
                  return (
                    <div className="px-1 py-1" key={b.id}>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-violet-500" : ""
                            } group flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-sm text-white`}
                            onClick={() =>
                              setBoard({
                                ...board,
                                currentBoard: b,
                              })
                            }
                          >
                            {b.title}
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  );
              })}
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-violet-500" : ""
                      } group flex w-full items-center gap-x-2 rounded-md px-2 py-2 text-sm text-white`}
                      onClick={() =>
                        setBoard({
                          ...board,
                          isCreateBoardModalOpen: true,
                        })
                      }
                    >
                      Create Board
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
