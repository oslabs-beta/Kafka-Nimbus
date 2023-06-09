"use client";
import logo from "../../../public/logoword.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NavBar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="navbar fixed left-0 right-0 top-0 z-30 flex justify-between bg-gray-100 bg-opacity-50 backdrop-blur-sm">
        <div className="flex cursor-pointer flex-row align-middle">
          <Link href="/">
            <Image
              width="60"
              height="60"
              src={logo}
              alt="logo"
              className="mr-2 h-8 w-8"
            />
          </Link>
          <motion.div
            className="text-xl normal-case"
            // href="/"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.1 }}
            transition={{ stiffness: 400, damping: 10 }}
          >
            Kafka Nimbus
          </motion.div>
        </div>


        <div className="mr-5">
          <motion.div
            className="mx-4 hover:cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ stiffness: 400, damping: 10 }}
            onClick={() =>
              router.push("https://github.com/oslabs-beta/Kafka-Nimbus")
            }
          >
            Docs
          </motion.div>

          {!sessionData ? (
            <Link
              href="./api/auth/signin?callbackUrl=/cluster-dashboard"
              className="overflow-hidden"
            >
              <Image
                width="35"
                height="35"
                alt="logo-not-logged-in"
                src={
                  "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                }
              ></Image>
            </Link>
          ) : (
            <details className="dropdown-end dropdown">
              <summary className="w-35 list-none overflow-hidden rounded-full">
                <Image
                  width="35"
                  height="35"
                  src={
                    sessionData?.user?.image ||
                    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Github-circle_%28CoreUI_Icons_v1.0.0%29.svg"
                  }
                  alt="profile-pic"
                  className="overflow-hidden rounded-full  hover:bg-slate-300"
                />
              </summary>
              <ul className="m-px: 10px dropdown-content menu rounded-box w-56 bg-base-200 bg-slate-100">
                <li>
                  <button
                    onClick={() => {
                      router.push("/cluster-dashboard");
                    }}
                  >
                    Clusters
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      void signOut({ callbackUrl: "/" });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
