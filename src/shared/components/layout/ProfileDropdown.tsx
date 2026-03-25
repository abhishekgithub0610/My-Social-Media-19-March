"use client";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Image from "next/image";
import {
  BsCardText,
  BsCircleHalf,
  BsGear,
  BsLifePreserver,
  BsMoonStars,
  BsPower,
  BsSun,
} from "react-icons/bs";
import type { IconType } from "react-icons";
import { useAuthStore } from "@/features/account/store/authStore";

//import type { ThemeType } from "@/types/context";

import avatar7 from "@/assets/images/avatar/07.jpg";
//import { toSentenceCase } from "@/utils/change-casing";
//import { useLayoutContext } from "@/context/useLayoutContext";
import clsx from "clsx";
//import { developedByLink } from "@/context/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
// type ThemeModeType = {
//   theme: ThemeType;
//   icon: IconType;
// };
// const user = {
//   name: "Abhishek",
//   role: "User",
//   avatar: avatar7, // keep for now
// };
const ProfileDropdown = () => {
  // const themeModes: ThemeModeType[] = [
  //   {
  //     icon: BsSun,
  //     theme: "light",
  //   },
  //   {
  //     icon: BsMoonStars,
  //     theme: "dark",
  //   },
  //   {
  //     icon: BsCircleHalf,
  //     theme: "auto",
  //   },
  // ];

  //const { theme: themeMode, updateTheme } = useLayoutContext();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearUser(); // ✅ your method
    router.push("/sign-in");
  };
  console.log("User in ProfileDropdown:", user); // Debugging line
  if (!user) return null;
  return (
    <Dropdown as="li" className="nav-item ms-2" drop="down" align="end">
      <DropdownToggle
        className="nav-link btn icon-md p-0 content-none"
        role="button"
        data-bs-auto-close="outside"
        data-bs-display="static"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Image className="avatar-img rounded-2" src={avatar7} alt="avatar" />
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-animation dropdown-menu-end pt-3 small me-md-n3"
        aria-labelledby="profileDropdown"
      >
        <div className="d-flex align-items-center position-relative px-3">
          <div className="avatar me-3">
            <Image
              className="avatar-img rounded-circle"
              src={avatar7}
              alt="avatar"
            />
          </div>
          <div>
            <Link className="h6" href="/profile">
              {user.email}
            </Link>
            <p className="small m-0">{user.role}</p>
            {/* <Link className="h6 stretched-link" href="#">
              Lori Ferguson
            </Link>
            <p className="small m-0">Web Developer</p> */}
          </div>
        </div>
        <DropdownItem
          className="btn btn-primary-soft btn-sm my-2 text-center"
          href="/profile/feed"
        >
          View profile
        </DropdownItem>
        <DropdownItem href="/settings/account">
          <BsGear className="fa-fw me-2" />
          Settings &amp; Privacy
        </DropdownItem>
        {/* <DropdownItem href={developedByLink} rel="noreferrer" target="_blank"> */}
        <DropdownItem href="#" rel="noreferrer" target="_blank">
          <BsLifePreserver className="fa-fw me-2" />
          Support
        </DropdownItem>
        <DropdownItem href="#" target="_blank" rel="noreferrer">
          <BsCardText className="fa-fw me-2" />
          Documentation
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onClick={handleLogout} className="text-danger">
          <BsPower className="me-2" />
          Logout
        </DropdownItem>
        {/* <DropdownItem
          className="bg-danger-soft-hover"
          href="/auth-advance/sign-in"
        >
          <BsPower className="fa-fw me-2" />
          Sign Out
        </DropdownItem>{" "} */}
        <DropdownDivider />
        {/* <div className="modeswitch-item theme-icon-active d-flex justify-content-center gap-3 align-items-center p-2 pb-0">
          <span>Mode:</span>

          {themeModes.map(({ icon: Icon, theme }, idx) => (
            <OverlayTrigger
              key={theme + idx}
              overlay={<Tooltip>{toSentenceCase(theme)}</Tooltip>}
            >
              <button
                type="button"
                className={clsx(
                  "btn btn-modeswitch nav-link text-primary-hover mb-0",
                  { active: theme === themeMode },
                )}
                onClick={() => updateTheme(theme)}
              >
                <Icon />
              </button>
            </OverlayTrigger>
          ))}
        </div> */}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
