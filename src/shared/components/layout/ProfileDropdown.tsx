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
import { useEffect, useState } from "react";
import avatar7 from "@/assets/images/avatar/07.jpg";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserById } from "@/features/users/services/userApi";
const ProfileDropdown = () => {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;

      try {
        const userData = await getUserById(user.id);

        if (userData.profilePicture) {
          setProfileImage(`http://localhost:7120/${userData.profilePicture}`);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
      }
    };

    fetchUserProfile();
  }, [user?.id]);
  const handleLogout = () => {
    clearUser();
    router.push("/sign-in");
  };
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
        <img
          src={profileImage || avatar7.src}
          alt="avatar"
          width={40}
          height={40}
          className="avatar-img rounded-2"
        />{" "}
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-animation dropdown-menu-end pt-3 small me-md-n3"
        aria-labelledby="profileDropdown"
      >
        <div className="d-flex align-items-center position-relative px-3">
          <div className="avatar me-3">
            <img
              src={profileImage || avatar7.src}
              alt="avatar"
              width={50}
              height={50}
              className="avatar-img rounded-circle"
            />
          </div>
          <div>
            <Link className="h6" href={`/profile/user/${user.id}`}>
              {user.name || user.email}
            </Link>
            <p className="small m-0">role</p>
          </div>
        </div>
        <DropdownItem
          className="btn btn-primary-soft btn-sm my-2 text-center"
          href={`/profile/user`}
        >
          View profile
        </DropdownItem>
        <DropdownItem href="/settings/account">
          <BsGear className="fa-fw me-2" />
          Settings &amp; Privacy
        </DropdownItem>
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
        <DropdownDivider />
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
