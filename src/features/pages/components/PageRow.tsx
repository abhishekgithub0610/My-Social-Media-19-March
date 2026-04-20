"use client";

import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/shared/components/ui/FollowButton ";
import { useAuthRedirect } from "@/features/account/hooks/useAuthRedirect";
import { useAuthStore } from "@/features/account/store/authStore";
type PageType = {
  id: string;
  displayName: string;
  aboutPage: string;
  pageImageUrl?: string;
  isFollowing: boolean;
};
const PageRow = ({ page }: { page: PageType }) => {
  useAuthRedirect();

  return (
    <div className="d-flex flex-column gap-2 py-2 border-bottom">
      {/* 🔹 ROW 1 */}
      <div className="d-flex align-items-center gap-2">
        {/* IMAGE */}
        <div className="avatar">
          {page.pageImageUrl && (
            <Image
              className="avatar-img rounded-circle"
              src={`http://localhost:7120/${page.pageImageUrl}`}
              alt="page"
              width={62}
              height={62}
              unoptimized
            />
          )}
        </div>

        {/* NAME */}
        <Link
          href={`/profile/page?pageId=${page.id}`}
          className="text-decoration-none flex-grow-1"
        >
          {/* <Link
          href={`/profile/pages/${page.id}`}
          className="text-decoration-none flex-grow-1"
        > */}
          <h6 className="mb-0 text-dark fw-semibold">{page.displayName}</h6>
        </Link>

        {/* FOLLOW */}
        <FollowButton page={page} />
      </div>

      {/* 🔹 ROW 2 */}
      <Link
        href={`/profile/page?pageId=${page.id}`}
        className="text-decoration-none"
      >
        {/* <Link href={`/profile/pages/${page.id}`} className="text-decoration-none"> */}
        <p
          className="mb-0 text-muted small text-truncate"
          title={page.aboutPage}
        >
          {page.aboutPage}
        </p>
      </Link>
    </div>
  );
};

export default PageRow;

// // "use client";

// // import Link from "next/link";
// // import Image from "next/image";
// // import FollowButton from "@/shared/components/ui/FollowButton ";

// // const PageRow = ({ page }: { page: any }) => {
// //   return (
// //     <div className="d-flex flex-column flex-md-row gap-2 py-2 border-bottom">
// //       {/* 🔹 ROW 1: IMAGE + DROPDOWN + FOLLOW */}
// //       <div className="d-flex align-items-center justify-content-between gap-2">
// //         {/* IMAGE */}
// //         <div className="avatar flex-shrink-0">
// //           {page.pageImageUrl && (
// //             <Image
// //               className="avatar-img rounded-circle"
// //               src={`http://localhost:7120/${page.pageImageUrl}`}
// //               alt="page"
// //               width={40}
// //               height={40}
// //               unoptimized
// //             />
// //           )}
// //         </div>

// //         {/* RIGHT SIDE (Dropdown + Button) */}
// //         <div className="d-flex align-items-center gap-2 ms-auto">
// //           <FollowButton page={page} />
// //         </div>
// //       </div>

// //       {/* 🔹 ROW 2: NAME + ABOUT */}
// //       <Link
// //         href={`/pages/${page.id}`}
// //         className="text-decoration-none d-flex flex-column overflow-hidden"
// //       >
// //         {/* NAME (FULL) */}
// //         <h6 className="mb-0 text-dark fw-semibold">{page.displayName}</h6>

// //         {/* ABOUT (TRUNCATED) */}
// //         <p
// //           className="mb-0 text-muted small text-truncate"
// //           style={{ maxWidth: "100%" }}
// //           title={page.aboutPage}
// //         >
// //           {page.aboutPage}
// //         </p>
// //       </Link>
// //     </div>
// //   );
// // };

// // export default PageRow;
