import { getAllUserConnections } from "@/helpers/data";
import clsx from "clsx";
import Image from "next/image";
import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
import LoadMoreButton from "@/shared/components/ui/LoadMoreButton";
import Link from "next/link";
import type { Metadata } from "next";
// PageList.tsx
import { getPages } from "@/features/pages/services/pagesApi";
import FollowButton from "@/shared/components/ui/FollowButton ";
export const metadata: Metadata = { title: "Connections" };

import PageRow from "./PageRow";
import { useAuthRedirect } from "@/features/account/hooks/useAuthRedirect";
import { useAuthStore } from "@/features/account/store/authStore";
type PageType = {
  id: string;
  displayName: string;
  aboutPage: string;
  pageImageUrl?: string;
  isFollowing: boolean;
};
const PageList = async () => {
  const pages = await getPages();

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <CardTitle>Pages</CardTitle>
      </CardHeader>

      <CardBody>
        {(pages ?? []).map((page: PageType) => (
          <PageRow key={page.id} page={page} />
        ))}
      </CardBody>
    </Card>
  );
};

export default PageList;

// import { getAllUserConnections } from "@/helpers/data";
// import clsx from "clsx";
// import Image from "next/image";
// import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
// import LoadMoreButton from "@/shared/components/ui/LoadMoreButton";
// import Link from "next/link";
// import type { Metadata } from "next";
// // PageList.tsx
// import { getPages } from "@/features/pages/services/pagesApi";
// import FollowButton from "@/shared/components/ui/FollowButton ";
// export const metadata: Metadata = { title: "Connections" };

// const PageList = async () => {
//   const pages = await getPages();

//   return (
//     <Card>
//       <CardHeader className="border-0 pb-0">
//         <CardTitle>Pages</CardTitle>
//       </CardHeader>

//       <CardBody>
//         {pages.map((page: any) => (
//           <div
//             key={page.id}
//             className="d-flex align-items-center flex-nowrap gap-2 gap-md-3 py-2 border-bottom"
//           >
//             {/* IMAGE */}
//             <div className="avatar flex-shrink-0">
//               {page.pageImageUrl && (
//                 <Image
//                   className="avatar-img rounded-circle"
//                   src={`http://localhost:7120/${page.pageImageUrl}`}
//                   alt="page"
//                   width={40} // ✅ smaller for compact UI
//                   height={40}
//                   unoptimized
//                 />
//               )}
//             </div>

//             {/* CONTENT (CLICKABLE) */}
//             <Link
//               href={`/pages/${page.id}`}
//               className="flex-grow-1 d-flex align-items-center gap-2 text-decoration-none overflow-hidden"
//             >
//               {/* NAME */}
//               <h6 className="mb-0 text-dark flex-shrink-0">
//                 {page.displayName}
//               </h6>

//               {/* ABOUT (TRUNCATED) */}
//               <p
//                 className="mb-0 text-muted small text-truncate"
//                 style={{
//                   maxWidth: window.innerWidth < 768 ? "140px" : "300px",
//                 }}

//               >
//                 {page.aboutPage}
//               </p>
//             </Link>

//             {/* ACTION */}
//             <div className="flex-shrink-0">
//               <FollowButton page={page} />
//             </div>
//           </div>
//         ))}
//       </CardBody>
//     </Card>
//   );
// };
// export default PageList;
// // import { getAllUserConnections } from "@/helpers/data";
// // import clsx from "clsx";
// // import Image from "next/image";
// // import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
// // import LoadMoreButton from "@/shared/components/ui/LoadMoreButton";
// // import Link from "next/link";
// // import type { Metadata } from "next";
// // // PageList.tsx
// // import { getPages } from "@/features/pages/services/pagesApi";
// // import FollowButton from "@/shared/components/ui/FollowButton ";
// // export const metadata: Metadata = { title: "Connections" };

// // const PageList = async () => {
// //   const pages = await getPages();

// //   return (
// //     <Card>
// //       <CardHeader className="border-0 pb-0">
// //         <CardTitle>Pages</CardTitle>
// //       </CardHeader>

// //       <CardBody>
// //         {pages.map((page: any) => (
// //           <div className="d-md-flex align-items-center mb-4" key={page.id}>
// //             {/* IMAGE */}
// //             <div className="avatar me-3 mb-3 mb-md-0">
// //               {page.pageImageUrl && (
// //                 <Image
// //                   className="avatar-img rounded-circle"
// //                   src={`http://localhost:7120/${page.pageImageUrl}`}
// //                   alt="page"
// //                   width={50}
// //                   height={50}
// //                   unoptimized // ✅ ADD THIS
// //                 />
// //               )}
// //             </div>

// //             {/* CONTENT */}
// //             <div className="w-100">
// //               <h6 className="mb-0">{page.displayName}</h6>
// //               <p className="small mb-1">{page.pageName}</p>

// //               <p className="small text-muted mb-1">{page.category}</p>

// //               <p className="small">{page.aboutPage}</p>

// //               {/* TYPES */}
// //               {/* <div className="d-flex gap-2 flex-wrap">
// //                 {page.types.map((t: string, idx: number) => (
// //                   <span key={idx} className="badge bg-light text-dark">
// //                     {t}
// //                   </span>
// //                 ))}
// //               </div> */}
// //             </div>

// //             {/* ACTION */}
// //             <div className="ms-md-auto">
// //               <FollowButton page={page} />
// //             </div>
// //           </div>
// //         ))}
// //       </CardBody>
// //     </Card>
// //   );
// // };
// // export default PageList;
// // const PageList = async () => {
// //   const allConnections = await getAllUserConnections();
// //   return (
// //     <Card>
// //       <CardHeader className="border-0 pb-0">
// //         <CardTitle> Connections</CardTitle>
// //       </CardHeader>
// //       <CardBody>
// //         {allConnections.map((connection, idx) => (
// //           <div className="d-md-flex align-items-center mb-4" key={idx}>
// //             <div className="avatar me-3 mb-3 mb-md-0">
// //               {connection.user?.avatar && (
// //                 <span role="button">
// //                   {" "}
// //                   <Image
// //                     className="avatar-img rounded-circle"
// //                     src={connection.user.avatar}
// //                     alt=""
// //                   />{" "}
// //                 </span>
// //               )}
// //             </div>
// //             <div className="w-100">
// //               <div className="d-sm-flex align-items-start">
// //                 <h6 className="mb-0">
// //                   <Link href="#">{connection.user?.name}</Link>
// //                 </h6>
// //                 <p className="small ms-sm-2 mb-0">{connection.role}</p>
// //               </div>
// //               <ul className="avatar-group mt-1 list-unstyled align-items-sm-center">
// //                 {connection?.sharedConnectionAvatars && (
// //                   <>
// //                     {connection.sharedConnectionAvatars.map((avatar, idx) => (
// //                       <li className="avatar avatar-xxs" key={idx}>
// //                         <Image
// //                           className="avatar-img rounded-circle"
// //                           src={avatar}
// //                           alt="avatar"
// //                         />
// //                       </li>
// //                     ))}
// //                     <li className="avatar avatar-xxs">
// //                       <div className="avatar-img rounded-circle bg-primary">
// //                         <span className="smaller text-white position-absolute top-50 start-50 translate-middle">
// //                           {/* ✅ FIX: Removed Math.random() from render (impure function)
// //                              Now using precomputed value from data layer (SSR-safe) */}
// //                           +{connection.sharedConnectionCount ?? 0}
// //                           {/* +{Math.floor(Math.random() * 10)} */}
// //                         </span>
// //                       </div>
// //                     </li>
// //                   </>
// //                 )}
// //                 <li
// //                   className={clsx("small", {
// //                     "ms-3": connection.sharedConnectionAvatars,
// //                   })}
// //                 >
// //                   {connection.description}
// //                 </li>
// //               </ul>
// //             </div>
// //             <div className="ms-md-auto d-flex">
// //               <Button variant="danger-soft" size="sm" className="mb-0 me-2">
// //                 {" "}
// //                 Remove{" "}
// //               </Button>
// //               <Button variant="primary-soft" size="sm" className="mb-0">
// //                 {" "}
// //                 Message{" "}
// //               </Button>
// //             </div>
// //           </div>
// //         ))}
// //         <div className="d-grid">
// //           <LoadMoreButton />
// //         </div>
// //       </CardBody>
// //     </Card>
// //   );
// // };
// // export default PageList;

// "use client";

// import PageCard from "./PageCard";

// const dummyPages = [
//   { id: 1, name: "Tech World", followers: 1200 },
//   { id: 2, name: "Travel Diaries", followers: 800 },
// ];

// const PageList = () => {
//   return (
//     <div className="vstack gap-3">
//       {dummyPages.map((page) => (
//         <PageCard key={page.id} page={page} />
//       ))}
//     </div>
//   );
// };

// export default PageList;
