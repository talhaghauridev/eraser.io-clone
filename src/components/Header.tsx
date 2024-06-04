import Image from "next/image";
import React, { Suspense } from "react";
import { NAV_LINKS } from "@/constants";
import AuthButtons from "./AuthButtons";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Logo1 } from "@public/Images";
import { buttonVariants } from "./ui/button";
import Link from "next/link";

async function Header() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <header  className="z-10 backdrop-blur-xl w-full fixed">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Image src={Logo1} alt="logo" width={110} height={110} />

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {NAV_LINKS.map((item, i) => (
                <li key={i}>
                  <a
                    className="text-white transition text-[13px] hover:text-gray-100"
                    href="#"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Suspense fallback={"Loading..."}>
              {(await isAuthenticated()) ? (
                <Link
                  href={"/dashboard"}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  DashBoard
                </Link>
              ) : (
                <AuthButtons />
              )}
            </Suspense>
            <button className="block rounded bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
