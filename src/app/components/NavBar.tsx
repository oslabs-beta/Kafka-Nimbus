"use client";
import React, { useState } from "react";
import logo from "../../../public/logoword.svg";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
        <a>Logout</a>
      </li>
    </ul>
  );

  return (
    <div className="navbar bg-base-100 mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8 border-b-2">
      <div className="flex cursor-pointer flex-row align-middle">
        <Image src={logo} alt="logo" className="mr-2 h-8 w-8" />
        <a className="btn btn-ghost text-xl normal-case">Kafka Nimbus</a>
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
