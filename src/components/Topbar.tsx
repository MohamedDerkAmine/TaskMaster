import { Menu } from "@headlessui/react";
import { useAtom } from "jotai";
import Image from "next/image";
import { type FC } from "react";
import { TiPlus } from "react-icons/ti";
import { toast, ToastContainer } from "react-toastify";
import { api } from "~/utils/api";
import { Dropdown } from "~/components";
import { boardAtom } from "./Sidebar";
import "react-toastify/dist/ReactToastify.css";
import CreateTaskModal, { isCreateTaskModalOpenAtom } from "./CreateTaskModal";
import UpdateBoardModal, {
  isUpdateBaordModalOpenAtom,
} from "./UpdateBoardModal";

const TopBar: FC = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const [_isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useAtom(
    isCreateTaskModalOpenAtom
  );
  const [_isUpdateBaordModalOpen, setIsUpdateBaordModalOpen] = useAtom(
    isUpdateBaordModalOpenAtom
  );

  const { data: cols, refetch: refetchCols } = api.column.getAll.useQuery(
    {
      boardId: board?.currentBoard?.id,
    },
    { enabled: board?.currentBoard?.id ? true : false }
  );
  const deleteBoardMutation = api.board.delete.useMutation();

  const deleteHandler = () => {
    deleteBoardMutation.mutate(
      {
        boardId: board?.currentBoard?.id,
      },
      {
        onSuccess(data) {
          setBoard({ ...board, currentBoard: undefined, boards: data });
        },
      }
    );
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {board?.currentBoard && (
        <div className="flex items-center justify-between border-b border-b-white/20 bg-primary p-5 text-white sm:p-10">
          <p className="flex items-center gap-3 text-2xl font-bold">
            <Image
              src="/assets/kraken.png"
              width={40}
              height={40}
              alt="logo"
              className="block lg:hidden"
            />
            {board?.currentBoard.title}
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
          </p>

          <div className="flex items-center gap-5">
            <button
              className="flex items-center gap-2 rounded-full bg-secondary px-5 py-3"
              onClick={() => {
                if (cols && cols.length > 0) {
                  setIsCreateTaskModalOpen(true);
                  return;
                }

                toast.error(
                  <p>
                    Please Create A New Tasks Collection By Clicking On + New
                    Column
                  </p>,
                  {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  }
                );
              }}
            >
              <TiPlus />
              <p className="hidden font-medium sm:block">Add New Task</p>
            </button>

            <Dropdown
              icon="column"
              deleteHandler={deleteHandler}
              editHandler={() => setIsUpdateBaordModalOpen(true)}
            />

            {/* Create Task Modal */}
            <CreateTaskModal
              cols={cols}
              refetchCols={() => void refetchCols()}
            />

            {/* Board Update Modal */}
            <UpdateBoardModal />
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
