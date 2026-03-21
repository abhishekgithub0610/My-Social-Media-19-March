import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardBody, CardFooter } from "react-bootstrap";
import {
  currentYear,
  developedBy,
  developedByLink,
} from "@/shared/constants/appConstants";
import type { ProfilePanelLink } from "@/features/profile/types/profile";
import avatar7 from "@/assets/images/avatar/07.jpg";
import bgBannerImg from "@/assets/images/bg/01.jpg";

type ProfilePanelProps = {
  links: ProfilePanelLink[];
};

const ProfilePanel = ({ links }: ProfilePanelProps) => {
  return (
    <>
      <Card className="overflow-hidden h-100">
        <div
          className="h-50px"
          style={{
            backgroundImage: `url(${bgBannerImg.src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        <CardBody className="pt-0">
          <div className="text-center">
            <div className="avatar avatar-lg mt-n5 mb-3">
              <span role="button">
                <Image
                  height={64}
                  width={64}
                  src={avatar7}
                  alt="avatar"
                  className="avatar-img rounded border border-white border-3"
                />
              </span>
            </div>

            <h5 className="mb-0">
              {" "}
              <Link href="#">Sam Lanson </Link>{" "}
            </h5>
            <small>Web Developer at StackBros</small>
            <p className="mt-3">
              I&apos;d love to change the world, but they won’t give me the
              source code.
            </p>

            <div className="hstack gap-2 gap-xl-3 justify-content-center">
              <div>
                <h6 className="mb-0">256</h6>
                <small>Post</small>
              </div>
              <div className="vr" />
              <div>
                <h6 className="mb-0">2.5K</h6>
                <small>Followers</small>
              </div>
              <div className="vr" />
              <div>
                <h6 className="mb-0">365</h6>
                <small>Following</small>
              </div>
            </div>
          </div>

          <hr />

          <ul className="nav nav-link-secondary flex-column fw-bold gap-2">
            {links.map((item, idx) => (
              <li key={item.name + idx} className="nav-item">
                <Link className="nav-link" href={item.link}>
                  <Image
                    src={item.image}
                    alt="icon"
                    height={20}
                    width={20}
                    className="me-2 h-20px fa-fw"
                  />
                  <span>{item.name} </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>

        <CardFooter className="text-center py-2">
          <Button variant="link" size="sm" href="/profile/feed">
            View Profile{" "}
          </Button>
        </CardFooter>
      </Card>
      <ul className="nav small mt-4 justify-content-center lh-1">
        <li className="nav-item">
          <Link className="nav-link" href="/profile/about">
            About
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/settings/account">
            Settings
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            target="_blank"
            rel="noreferrer"
            href={developedByLink}
          >
            Support{" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" target="_blank" rel="noreferrer" href="#">
            Docs{" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/help">
            Help
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" href="/privacy-terms">
            Privacy &amp; terms
          </Link>
        </li>
      </ul>

      <p className="small text-center mt-1">
        ©{currentYear}{" "}
        <a
          className="text-reset"
          target="_blank"
          rel="noreferrer"
          href={developedByLink}
        >
          {" "}
          {developedBy}{" "}
        </a>
      </p>
    </>
  );
};

export default ProfilePanel;
