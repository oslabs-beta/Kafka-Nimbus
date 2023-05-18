"use client";
import React, { useState } from "react";
import logo from "../../../public/logoword.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';



const NavBar = () => {
  const { data: sessionData } = useSession();
  const [profileModal, setProfileModal] = useState(false);

  const profileModalHandler = () => {
    setProfileModal(!profileModal);
  };

  const dropDownMenu = (
    <ul
      tabIndex={0}
      className="menu menu-compact  dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
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
    <div className="navbar relative bg-base-100 mx-auto flex w-full items-center justify-between p-6 lg:px-8 border-b-2">
      <div className="flex cursor-pointer flex-row align-middle">
        <Link href="/"><Image src={logo} alt="logo" className="mr-2 h-8 w-8" /></Link>
        <Link className="btn btn-ghost text-xl normal-case" href="/">Kafka Nimbus</Link>
      </div>

      <div className="overflow-hidden rounded-full hover:bg-slate-300">
        <Image
          width="34"
          height="34"
          src={sessionData ? sessionData.user.image : logo}
          alt="profile-pic"
          className=""
          onClick={profileModalHandler}
        />
      </div>
      {profileModal ? dropDownMenu : null}
    </div>
  );
};

export default NavBar;
