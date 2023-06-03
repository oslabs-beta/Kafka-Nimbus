"use client";
import React, { useState } from "react";
import logo from "../../../public/logoword.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';



const NavBar = () => {
  const { data: sessionData } = useSession();


  return (
    <div className="navbar relative bg-base-100 mx-auto flex w-full items-center justify-between p-6 lg:px-8 border-b-2">
      <div className="flex cursor-pointer flex-row align-middle">
        <Link href="/"><Image src={logo} alt="logo" className="mr-2 h-8 w-8" /></Link>
        <Link className="btn btn-ghost text-xl normal-case" href="/">Kafka Nimbus</Link>
      </div>

      <div className="">
        {(!sessionData) ?
          <Image
            width="34"
            height="34"
            src={logo}
            alt="logo-not-logged-in"
            className="overflow-hidden hover:bg-slate-300"
          /> :
          <details className="dropdown dropdown-end">
            <summary><Image
              width="34"
              height="34"
              src={sessionData ? sessionData.user.image : logo}
              alt="profile-pic"
              className="rounded-full overflow-hidden  hover:bg-slate-300"
            /></summary>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link href="/cluster-dashboard">Clusters</Link>
              </li>
              <li><a onClick={() => void signOut({ callbackUrl: '/' })}>Logout</a></li>
            </ul>
          </details>}
      </div>

    </div>
  );
};

export default NavBar;
