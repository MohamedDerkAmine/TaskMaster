import { TbLayoutBoardSplit } from "react-icons/tb";
import { TiPlus } from "react-icons/ti";
import Image from "next/image";
import { Concert_One } from "@next/font/google";
import { useEffect, type FC } from "react";
import type { Board } from "@prisma/client";
import { api } from "~/utils/api";
import { atom, useAtom } from "jotai";
import CreateBoardModal from "./CreateBoardModal";

export const boardAtom = atom<{
  currentBoard?: Board;
  isCreateBoardModalOpen?: boolean;
  boards?: Board[];
} | null>(null);

const concertOne = Concert_One({ weight: ["400"], subsets: ["latin"] });

const SideBar: FC = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const { data: boards, refetch: refetchBoards } = api.board.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => setBoard({ ...board, boards }), [boards]);

  return (
    <div className="hidden w-[400px] flex-col gap-y-5 border-r border-r-white/10 bg-primary lg:flex">
      <div className="flex items-center gap-x-2 p-10">
        <Image src="/assets/kraken.png" alt="logo" width={60} height={60} />
        <p className={`text-2xl font-bold text-white ${concertOne.className}`}>
          TaskMaster
        </p>
      </div>

      <p className="pl-10 text-white/50">All Boards ({boards?.length})</p>

      <ul className="flex flex-col gap-y-4 font-medium">
        {board?.boards?.map((b: Board) => (
          <li
            key={b.id}
            className={`flex w-4/5 cursor-pointer items-center gap-2 rounded-r-full py-4 pl-10 text-white duration-200 ease-in-out ${
              b.id === board?.currentBoard?.id
                ? "bg-secondary"
                : "bg-transparent"
            }`}
            onClick={() =>
              setBoard({
                ...board,
                currentBoard: b,
              })
            }
          >
            <TbLayoutBoardSplit size={20} />
            {b.title}
          </li>
        ))}
        <li
          onClick={() => setBoard({ ...board, isCreateBoardModalOpen: true })}
          className="flex w-4/5 cursor-pointer items-center gap-2 rounded-r-full pl-10 text-secondary"
        >
          <TiPlus />
          Create New Board
        </li>
        <CreateBoardModal refetchBoards={() => void refetchBoards()} />
      </ul>
    </div>
  );
};

export default SideBar;
