"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardBody } from "react-bootstrap";
import {
  BsActivity,
  BsFileEarmarkBarGraph,
  BsFileEarmarkPost,
  BsPeople,
  BsWindowStack,
} from "react-icons/bs";

const dashboardLinks = [
  {
    label: "Insights",
    href: "/dashboard/insights",
    icon: BsFileEarmarkBarGraph,
  },
  { label: "My Pages", href: "/dashboard/my-pages", icon: BsWindowStack },
  { label: "My Posts", href: "/dashboard/my-posts", icon: BsFileEarmarkPost },
  { label: "My Users", href: "/dashboard/my-users", icon: BsPeople },
  { label: "My Activity", href: "/dashboard/my-activity", icon: BsActivity },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Card className="w-100">
      <CardBody>
        <div className="mb-3 px-2">
          <div className="small text-body-secondary">WORKSPACE</div>
          <strong>Dashboard</strong>
        </div>
        <nav aria-label="Dashboard navigation">
          <ul className="nav nav-tabs nav-pills nav-pills-soft flex-column fw-bold gap-2 border-0">
            {dashboardLinks.map(({ label, href, icon: Icon }) => (
              <li className="nav-item" key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={clsx("nav-link d-flex align-items-center mb-0", {
                    active: pathname === href,
                  })}
                >
                  <Icon className="me-2" size={19} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardBody>
    </Card>
  );
};

export default DashboardSidebar;
