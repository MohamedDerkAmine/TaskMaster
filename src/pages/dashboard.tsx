import { TopBar, Board, SideBar } from "~/components";

export default function Main() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex w-full flex-col lg:w-4/5">
        <TopBar />
        <Board />
      </div>
    </div>
  );
}
