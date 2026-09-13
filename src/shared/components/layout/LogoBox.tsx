"use client";
import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/images/tenor-future1.png";

const LogoBox = () => {
  return (
    <Link className="navbar-brand" href="/">
      <Image
        src={logo}
        alt="logo"
        height={36}
        width={36}
        className="navbar-brand-item"
      />
    </Link>
  );
};

export default LogoBox;
