import { Topbar, Board, Sidebar } from "~/modules/Dashboard";

export default function Main() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex w-full flex-col lg:w-4/5">
        <Topbar />
        <Board />
      </div>
    </div>
  );
}
