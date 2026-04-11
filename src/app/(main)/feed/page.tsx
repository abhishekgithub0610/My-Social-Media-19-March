"use client";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
// import Stories from "@/features/post/components/Stories";
import Feeds from "@/features/post/components/Feeds";
import Followers from "@/Followers"; // to be confirmed/deleted
import CreatePostCard from "@/features/post/components/CreatePostCard";
import Link from "next/link";
import LoadContentButton from "@/LoadContentButton"; // to be confirmed/deleted
import type { Metadata } from "next";
import { useAuthStore } from "@/features/account/store/authStore";
import { SocialPostType } from "@/types/data";
import { useState } from "react";

//export const metadata: Metadata = { title: "Default Home" };

const Home = () => {
  const state = useAuthStore.getState();
  const [posts, setPosts] = useState<SocialPostType[]>([]);

  console.log("Zustand AFTER setUser:", {
    user: state.user,
    accessToken: state.accessToken,
  });
  return (
    <>
      <Col md={8} lg={6} className="vstack gap-4">
        {/* <Stories /> */}
        <CreatePostCard />
        <Feeds posts={posts} setPosts={setPosts} />
      </Col>

      <Col lg={3}>
        <Row className="g-4">
          <Col sm={6} lg={12}>
            <Followers />
          </Col>

          <Col sm={6} lg={12}>
            <Card>
              <CardHeader className="pb-0 border-0">
                <CardTitle className="mb-0">Today’s news</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">
                      Ten questions you should answer truthfully
                    </Link>
                  </h6>
                  <small>2hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">
                      Five unbelievable facts about money
                    </Link>
                  </h6>
                  <small>3hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">
                      Best Pinterest Boards for learning about business
                    </Link>
                  </h6>
                  <small>4hr</small>
                </div>

                <div className="mb-3">
                  <h6 className="mb-0">
                    <Link href="/blogs/details">
                      Skills that you can learn from business
                    </Link>
                  </h6>
                  <small>6hr</small>
                </div>

                <LoadContentButton name="View all latest news" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Home;

// // import { Col, Container, Row } from "react-bootstrap";
// // import ContactSidebar from "@/shared/components/layout/ContactSidebar";
// // import LeftSidebar from "@/shared/components/layout/LeftSidebar";
// // import Feeds from "@/features/post/components/Feeds";
// // import Stories from "@/features/post/components/Stories";
// // import CreatePostCard from "@/features/post/components/CreatePostCard";

// // export default function FeedPage() {
// //   return (
// //     <>
// //       <main>
// //         <Container fluid>
// //           <Row className="justify-content-between g-0">
// //             <Col md={2} lg={3} xxl={4} className="mt-n4">
// //               <LeftSidebar />
// //             </Col>

// //             <Col md={8} lg={6} xxl={4} className="vstack gap-4">
// //               <Stories />
// //               <CreatePostCard />
// //               <Feeds />
// //             </Col>

// //             <Col md={2} lg={3} xxl={4}>
// //               <ContactSidebar />
// //             </Col>
// //           </Row>
// //         </Container>
// //       </main>
// //     </>
// //   );
// // }
