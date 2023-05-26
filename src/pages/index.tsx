import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Concert_One } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi";
import { VscSignOut } from "react-icons/vsc";
import { TbLayoutBoardSplit } from "react-icons/tb";

const concertOne = Concert_One({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="h-full w-full bg-primary px-10 sm:h-screen">
      <div className="container mx-auto py-10">
        <nav className="flex justify-between text-white">
          <div className="flex items-center gap-x-4">
            <Image src="/assets/kraken.png" alt="logo" width={60} height={60} />
            <p className={`text-2xl font-bold ${concertOne.className}`}>
              TaskMaster
            </p>
          </div>

          <ul className="flex items-center gap-x-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-md bg-zinc-700 p-3 font-medium"
            >
              <TbLayoutBoardSplit size={20} />
              Dashboard
            </Link>
            <li
              className={`flex items-center gap-2 rounded-md ${
                isSignedIn ? "bg-red-500" : "bg-slate-600"
              } p-3 font-medium`}
            >
              {isSignedIn && <VscSignOut size={20} />}
              {isSignedIn ? <SignOutButton /> : <SignInButton />}
            </li>
          </ul>
        </nav>

        <header className="flex flex-col gap-20 text-white">
          <h1 className="mt-40 font-serif text-7xl font-semibold leading-tight md:w-2/3">
            Take Control of Your Tasks: Your Personal Task Management Assistant
          </h1>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-md bg-slate-700 p-3 md:w-2/12"
          >
            <p className="text-xl">Go To Dashboard</p>
            <FiArrowRightCircle size={23} />
          </Link>
        </header>
      </div>
    </div>
  );
}
