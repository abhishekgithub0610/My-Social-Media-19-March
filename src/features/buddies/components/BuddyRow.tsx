"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthRedirect } from "@/features/account/hooks/useAuthRedirect";
import FollowBuddyButton from "@/shared/components/ui/FollowBuddyButton";
type BuddyType = {
  id: string;
  displayName: string;
  aboutBuddy: string;
  buddyImageUrl?: string;
  isFollowing: boolean;
};
const BuddyRow = ({ buddy }: { buddy: BuddyType }) => {
  useAuthRedirect();

  return (
    <div className="d-flex flex-column gap-2 py-2 border-bottom">
      {/* 🔹 ROW 1 */}
      <div className="d-flex align-items-center gap-2">
        {/* IMAGE */}
        <div className="avatar">
          {buddy.buddyImageUrl && (
            <Image
              className="avatar-img rounded-circle"
              src={`http://localhost:7120/${buddy.buddyImageUrl}`}
              alt="buddy"
              width={62}
              height={62}
              unoptimized
            />
          )}
        </div>

        {/* NAME */}
        <Link
          href={`/profile/buddy?buddyId=${buddy.id}`}
          className="text-decoration-none flex-grow-1"
        >
          {/* <Link
          href={`/profile/pages/${page.id}`}
          className="text-decoration-none flex-grow-1"
        > */}
          <h6 className="mb-0 text-dark fw-semibold">{buddy.displayName}</h6>
        </Link>

        {/* FOLLOW */}
        <FollowBuddyButton buddy={buddy} />
      </div>

      {/* 🔹 ROW 2 */}
      <Link
        href={`/profile/buddy?buddyId=${buddy.id}`}
        className="text-decoration-none"
      >
        {/* <Link href={`/profile/pages/${page.id}`} className="text-decoration-none"> */}
        <p
          className="mb-0 text-muted small text-truncate"
          title={buddy.aboutBuddy}
        >
          {buddy.aboutBuddy}
        </p>
      </Link>
    </div>
  );
};

export default BuddyRow;
