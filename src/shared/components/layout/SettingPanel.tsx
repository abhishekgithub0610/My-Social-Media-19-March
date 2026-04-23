import {
  currentYear,
  developedBy,
  developedByLink,
} from "@/shared/constants/appConstants";
import type { ProfilePanelLink } from "@/features/profile/types/profile";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Card, CardBody, CardFooter } from "react-bootstrap";
import { useAuthStore } from "@/features/account/store/authStore";
type settingPanelProps = {
  links: ProfilePanelLink[];
};
const SettingPanel = ({ links }: settingPanelProps) => {
  const pathName = usePathname();
  const { user } = useAuthStore();

  return (
    <>
      <Card className="w-100">
        <CardBody>
          <ul className="nav nav-tabs nav-pills nav-pills-soft flex-column fw-bold gap-2 border-0">
            {links.map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link
                  className={clsx("nav-link d-flex mb-0", {
                    active: pathName === item.link,
                  })}
                  href={item.link}
                >
                  {" "}
                  <Image
                    height={20}
                    width={19}
                    className="me-2 h-20px fa-fw"
                    src={item.image}
                    alt="image"
                  />
                  <span>{item.name} </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="text-center py-2">
          <Link
            href={`/profile/user`}
            className="text-secondary btn btn-link btn-sm"
          >
            View Profile
          </Link>
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
          <Link className="nav-link" target="_blank" href={developedByLink}>
            Support{" "}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" target="_blank" href="#">
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
        <Link className="text-reset" target="_blank" href={developedByLink}>
          {developedBy}{" "}
        </Link>
      </p>
    </>
  );
};
export default SettingPanel;
