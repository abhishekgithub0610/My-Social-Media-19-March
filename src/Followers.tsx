import {
  getFollowingPages,
  getPages,
  getSuggestedPages,
} from "@/features/pages/services/pagesApi";
import Image from "next/image";
import { PageType } from "@/shared/types/PageType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
import { BsPersonCheckFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { getImageUrl } from "./helpers/common-helper";

const Followers = () => {
  //const Followers = async () => {
  //const pages = await getPages();
  const [pages, setPages] = useState<PageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const result = await getPages();
      setPages(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-0 border-0">
        <CardTitle className="mb-0">Pages to Follow</CardTitle>
      </CardHeader>

      <CardBody>
        {pages.slice(0, 5).map((page) => (
          <div key={page.id} className="hstack gap-2 mb-3">
            <div className="avatar">
              <Image
                src={getImageUrl(page.pageImageUrl)}
                // src={
                //   page.pageImageUrl
                //     ? `${process.env.NEXT_PUBLIC_API_URL}/${page.pageImageUrl}`
                //     : "/assets/images/avatar/placeholder.jpg"
                // }
                alt={page.displayName}
                width={48}
                height={48}
                className="avatar-img rounded-circle"
                unoptimized
              />
            </div>

            <div className="overflow-hidden">
              <Link href={`/pages/${page.pageName}`} className="h6 mb-0">
                {page.displayName}
              </Link>

              <p className="mb-0 small text-truncate">{page.category}</p>
            </div>

            <Button
              variant={page.isFollowing ? "primary" : "primary-soft"}
              className="rounded-circle icon-md ms-auto flex-centered"
            >
              {page.isFollowing ? <BsPersonCheckFill /> : <FaPlus size={12} />}
            </Button>
          </div>
        ))}

        <div className="d-grid mt-3">
          <Link href="/pages">
            <Button variant="primary-soft" size="sm" className="w-100">
              View More
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default Followers;

// import { getAllUsers } from "@/helpers/data";
// import clsx from "clsx";
// import Image from "next/image";
// import Link from "next/link";
// import { Button, Card, CardBody, CardHeader, CardTitle } from "react-bootstrap";
// import { BsPersonCheckFill } from "react-icons/bs";
// import { FaPlus } from "react-icons/fa";

// const Followers = () => {
//   const allFollowers = getAllUsers();
//   return (
//     <Card>
//       <CardHeader className="pb-0 border-0">
//         <CardTitle className="mb-0">Who to follow</CardTitle>
//       </CardHeader>

//       <CardBody>
//         {allFollowers.slice(0, 5).map((follower, idx) => (
//           <div className="hstack gap-2 mb-3" key={idx}>
//             <div
//               className={clsx("avatar", { "avatar-story": follower.isStory })}
//             >
//               <span role="button">
//                 <Image
//                   className="avatar-img rounded-circle"
//                   src={follower.avatar}
//                   alt="image"
//                 />
//               </span>
//             </div>

//             <div className="overflow-hidden">
//               <Link className="h6 mb-0" href="#">
//                 {follower.name}{" "}
//               </Link>
//               <p className="mb-0 small text-truncate">{follower.role}</p>
//             </div>

//             <Button
//               variant={follower.hasRequested ? "primary" : "primary-soft"}
//               className="rounded-circle icon-md ms-auto flex-centered"
//             >
//               <span>
//                 {follower.hasRequested ? (
//                   <BsPersonCheckFill />
//                 ) : (
//                   <FaPlus size={12} />
//                 )}
//               </span>{" "}
//             </Button>
//           </div>
//         ))}

//         <div className="d-grid mt-3">
//           <Button variant="primary-soft" size="sm">
//             View more
//           </Button>
//         </div>
//       </CardBody>
//     </Card>
//   );
// };
// export default Followers;
