"use client";
import React, { useState } from "react";
import logo from "../../../public/logoword.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: sessionData } = useSession();
  const [profileModal, setProfileModal] = useState(false);

  
  const profileModalHandler = () => {
    setProfileModal(!profileModal);
  };

  const dropDownMenu = (
    <ul
      tabIndex={0}
      className="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
    >
      <li>
        <a className="justify-between">
          Profile
          <span className="badge">New</span>
        </a>
      </li>
      <li>
        <a>Settings</a>
      </li>
      <li>
        <a onClick={() => void signOut({ callbackUrl: '/' })}>Logout</a>
      </li>
    </ul>
  );

  return (
    <div className="navbar fixed top-0 left-0 right-0 bg-gray-100 bg-opacity-50 z-30 backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-8 flex items-center justify-between">
        <div className="flex cursor-pointer flex-row items-center">
          <Link href="/">
            <Image src={logo} alt="logo" className="mr-2 h-8 w-8" />
          </Link>
          <Link className="btn btn-ghost text-xl normal-case" href="/">
            Kafka Nimbus
          </Link>
        </div>

        <div className="flex items-center ml-auto">
          <Link href="/cluster-dashboard" className="font-bold mx-8">
            Clusters
          </Link>
          <Image
            width="34"
            height="34"
            src={sessionData ? sessionData.user.image : logo}
            alt="profile-pic"
            className="rounded-full overflow-hidden hover:bg-slate-300"
            onClick={profileModalHandler}
          />
        </div>
        {profileModal ? dropDownMenu : null}
      </div>
    </div>
  );
};

export default NavBar;
