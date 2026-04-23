"use client";
import GlightBox from "@/shared/components/ui/GlightBox";
import { PageContext } from "@/context/PageContext";
import type { ChildrenType } from "@/types/component";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import Navbar from "@/shared/components/layout/Navbar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from "react-bootstrap";
import {
  BsBookmark,
  BsBriefcase,
  BsCalendar2Plus,
  BsCalendarDate,
  BsChatLeftText,
  BsEnvelope,
  BsFileEarmarkPdf,
  BsGear,
  BsGeoAlt,
  BsHeart,
  BsLock,
  BsPatchCheckFill,
  BsPencilFill,
  BsPersonX,
  BsThreeDots,
} from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { PROFILE_MENU_ITEMS } from "@/assets/data/menu-items";
import { getAllUsers } from "@/helpers/data";
import { experienceData } from "@/experiencedata";
import avatar7 from "@/assets/images/avatar/07.jpg";
import background5 from "@/assets/images/bg/05.jpg";
import album1 from "@/assets/images/albums/01.jpg";
import album2 from "@/assets/images/albums/02.jpg";
import album3 from "@/assets/images/albums/03.jpg";
import album4 from "@/assets/images/albums/04.jpg";
import album5 from "@/assets/images/albums/05.jpg";
import { useEffect, useState } from "react";
import { getUserById } from "@/features/users/services/userApi";
import { UserProfileType } from "@/features/users/types/user";
import { useAuthStore } from "@/features/account/store/authStore";
//import { usePageId } from "@/shared/hooks/usePageId";
//import { PageType } from "@/shared/types/PageType";

const Photos = () => {
  return (
    <Card>
      <CardHeader className="d-sm-flex justify-content-between border-0">
        <CardTitle>Photos (Coming Soon...)</CardTitle>
        <Button variant="primary-soft" size="sm">
          {" "}
          See all photo
        </Button>
      </CardHeader>
      <CardBody className="position-relative pt-0">
        <Row className="g-2">
          <Col xs={6}>
            <GlightBox href={album1.src} data-gallery="image-popup">
              <Image
                className="rounded img-fluid"
                src={album1}
                alt="album-image"
              />
            </GlightBox>
          </Col>
          <Col xs={6}>
            <GlightBox href={album2.src} data-gallery="image-popup">
              <Image
                className="rounded img-fluid"
                src={album2}
                alt="album-image"
              />
            </GlightBox>
          </Col>
          <Col xs={4}>
            <GlightBox href={album3.src} data-gallery="image-popup">
              <Image
                className="rounded img-fluid"
                src={album3}
                alt="album-image"
              />
            </GlightBox>
          </Col>
          <Col xs={4}>
            <GlightBox href={album4.src} data-gallery="image-popup">
              <Image
                className="rounded img-fluid"
                src={album4}
                alt="album-image"
              />
            </GlightBox>
          </Col>
          <Col xs={4}>
            <GlightBox href={album5.src} data-gallery="image-popup">
              <Image
                className="rounded img-fluid"
                src={album5}
                alt="album-image"
              />
            </GlightBox>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const UserProfileLayout = ({ children }: ChildrenType) => {
  const pathName = usePathname();
  //const pageId = usePageId();
  const router = useRouter();
  const [user, setUser] = useState<UserProfileType | null>(null);
  //const [isEditOpen, setIsEditOpen] = useState(false); // ✅ NEW
  const params = useParams();
  //const userId = params?.userId as string;
  const { user: currentuser } = useAuthStore();
  const userId = currentuser?.id as string;

  useEffect(() => {
    if (userId) {
      getUserById(userId).then((data) => {
        setUser(data);
      });
    }
  }, [userId]);
  // ✅ GUARD
  if (!user) {
    return <div className="text-center p-5">Loading profile...</div>;
  }
  // console.log("Page data:", page);
  return (
    <>
      <Navbar />
      <main>
        <Container>
          <Row className="g-4">
            <Col lg={8} className="d-flex flex-column gap-4">
              {/* <Col lg={8} className="vstack gap-4"> */}
              <Card>
                <div
                  className="h-200px rounded-top"
                  style={{
                    backgroundImage: `url(${background5.src})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <CardBody className="py-0">
                  {/* <div className="d-sm-flex align-items-start text-center text-sm-start"> */}
                  <div className="d-sm-flex align-items-start text-center text-sm-start w-100">
                    <div>
                      <div className="avatar avatar-xxl mt-n5 mb-3">
                        {user.profilePicture && (
                          <Image
                            className="avatar-img rounded-circle border border-white border-3"
                            src={`http://localhost:7120/${user.profilePicture}`}
                            alt="avatar"
                            width={120}
                            height={120}
                            unoptimized
                          />
                        )}
                      </div>
                    </div>
                    {/* <div className="ms-sm-4 mt-sm-3"> */}
                    <div className="ms-sm-4 mt-sm-3 flex-grow-1 min-w-0">
                      <h1 className="mb-0 h5 text-nowrap">{user.fullName}</h1>
                      {/* <h1 className="mb-0 h5">
                        {page?.displayName}{" "} */}
                      {/* <BsPatchCheckFill className="text-success small" /> */}
                      {/* </h1> */}
                      {/* <p>250 connections</p> */}
                    </div>
                    <div className="d-flex mt-3 justify-content-center ms-sm-auto">
                      {user.isOwner && (
                        <Button
                          variant="danger-soft"
                          className="me-2"
                          onClick={() => router.push(`/settings/account`)}
                        >
                          <BsPencilFill size={19} className="pe-1" />
                          Edit Profile
                        </Button>
                      )}

                      {/* <Button
                        variant="danger-soft"
                        className="me-2"
                        onClick={() => router.push(`/pages/${page.id}/edit`)}
                      >
                        <BsPencilFill size={19} className="pe-1" /> Edit profile
                      </Button> */}
                      {/* <Button
                        variant="danger-soft"
                        className="me-2"
                        type="button"
                        onClick={() => setIsEditOpen(true)} // ✅ OPEN MODAL
                      >
                        <BsPencilFill size={19} className="pe-1" /> Edit profile
                      </Button> */}
                      {/* <Button
                        variant="danger-soft"
                        className="me-2"
                        type="button"
                      >
                        {" "}
                        <BsPencilFill size={19} className="pe-1" /> Edit
                        profile{" "}
                      </Button> */}
                      <Dropdown>
                        <DropdownToggle
                          as="a"
                          className="icon-md btn btn-light content-none"
                          type="button"
                          id="profileAction2"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            {" "}
                            <BsThreeDots />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu
                          className="dropdown-menu-end"
                          aria-labelledby="profileAction2"
                        >
                          <li>
                            <DropdownItem href="#">
                              <b>Coming Soon...</b>
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {" "}
                              <BsBookmark size={22} className="fa-fw pe-2" />
                              Share profile in a message
                            </DropdownItem>
                          </li>
                          <li>
                            {/* <DropdownItem href="#">
                              {" "}
                              <BsFileEarmarkPdf
                                size={22}
                                className="fa-fw pe-2"
                              />
                              Save your profile to PDF
                            </DropdownItem> */}
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {" "}
                              <BsLock size={22} className="fa-fw pe-2" />
                              Lock profile
                            </DropdownItem>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <DropdownItem href="#">
                              {" "}
                              <BsGear size={22} className="fa-fw pe-2" />
                              Profile settings
                            </DropdownItem>
                          </li>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                  <ul className="list-inline mb-0 text-center text-sm-start mt-3 mt-sm-0">
                    <li className="list-inline-item">
                      <BsBriefcase className="me-1" />
                      User Profile
                    </li>
                    {/* <li className="list-inline-item">
                      <BsGeoAlt className="me-1" /> New Hampshire
                    </li> */}
                    {/* <li className="list-inline-item">
                      <BsCalendar2Plus className="me-1" /> Joined on Nov 26,
                      2019
                    </li> */}
                  </ul>
                </CardBody>
                <CardFooter className="card-footer mt-3 pt-2 pb-0">
                  <ul className="nav nav-bottom-line align-items-center justify-content-center justify-content-md-start mb-0 border-0">
                    {PROFILE_MENU_ITEMS.map((item, idx) => (
                      <li className="nav-item" key={idx}>
                        {" "}
                        <Link
                          className={clsx("nav-link", {
                            active:
                              (item.url && pathName.startsWith(item.url)) ||
                              (pathName === "/profile" &&
                                item.url === "/profile/page"),
                          })}
                          href={item.url ?? ""}
                        >
                          {/* <Link
                          className={clsx("nav-link", {
                            active: pathName === item.url,
                          })}
                          href={item.url ?? ""}
                        > */}{" "}
                          {item.label}{" "}
                          {item.badge && (
                            <span className="badge bg-success bg-opacity-10 text-success small">
                              {" "}
                              {item.badge.text}
                            </span>
                          )}{" "}
                        </Link>{" "}
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </Card>
              {/* <PageContext.Provider value={page}> */}
              {children}
              {/* </PageContext.Provider>{" "} */}
            </Col>
            <Col lg={4}>
              <Row className="g-4">
                <Col md={6} lg={12}>
                  <Card>
                    <CardHeader className="border-0 pb-0">
                      <CardTitle>About (Coming Soon...)</CardTitle>
                    </CardHeader>
                    <CardBody className="position-relative pt-0">
                      <p>
                        He moonlights difficult engrossed it, sportsmen.
                        Interested has all Devonshire difficulty gay assistance
                        joy.
                      </p>
                      <ul className="list-unstyled mt-3 mb-0">
                        <li className="mb-2">
                          {" "}
                          <BsCalendarDate
                            size={18}
                            className="fa-fw pe-1"
                          />{" "}
                          Born: <strong> October 20, 1990 </strong>{" "}
                        </li>
                        <li className="mb-2">
                          {" "}
                          <BsHeart
                            size={18}
                            className="fa-fw pe-1"
                          /> Status: <strong> Single </strong>{" "}
                        </li>
                        <li>
                          {" "}
                          <BsEnvelope
                            size={18}
                            className="fa-fw pe-1"
                          /> Email: <strong> {user.email} </strong>{" "}
                        </li>
                      </ul>
                    </CardBody>
                  </Card>
                </Col>
                {/* <Col md={6} lg={12}>
                  <Experience />
                </Col> */}
                <Col md={6} lg={12}>
                  <Photos />
                </Col>
                {/* <Col md={6} lg={12}>
                  <Friends />
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default UserProfileLayout;
