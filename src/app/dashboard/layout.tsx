"use client";

import type { ChildrenType } from "@/types/component";
import Navbar from "@/shared/components/layout/Navbar";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import { useLayoutContext } from "@/context/useLayoutContext";
import useViewPort from "@/useViewPort";
import {
  Col,
  Container,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
} from "react-bootstrap";
import { FaSlidersH } from "react-icons/fa";

const DashboardLayout = ({ children }: ChildrenType) => {
  const { width } = useViewPort();
  const { startOffcanvas } = useLayoutContext();

  return (
    <>
      <Navbar />
      <main>
        <Container>
          <div className="mb-4">
            <h1 className="h3 mb-1">Welcome to your dashboard</h1>
            <p className="text-body-secondary mb-0">
              Your activity, audience, and page performance at a glance.
            </p>
          </div>
          <Row className="g-4">
            <Col lg={3}>
              <div className="d-flex align-items-center mb-3 d-lg-none">
                <button
                  onClick={startOffcanvas.toggle}
                  className="border-0 bg-transparent p-0"
                  type="button"
                  aria-label="Open dashboard navigation"
                >
                  <span className="btn btn-primary">
                    <FaSlidersH />
                  </span>
                  <span className="h6 mb-0 ms-2">Dashboard menu</span>
                </button>
              </div>
              <nav className="navbar navbar-light navbar-expand-lg mx-0">
                {width >= 992 ? (
                  <DashboardSidebar />
                ) : (
                  <Offcanvas
                    show={startOffcanvas.open}
                    onHide={startOffcanvas.toggle}
                    placement="start"
                    tabIndex={-1}
                    id="dashboardNavigation"
                    className="w-75"
                  >
                    <OffcanvasHeader closeButton />
                    <OffcanvasBody className="p-0">
                      <DashboardSidebar />
                    </OffcanvasBody>
                  </Offcanvas>
                )}
              </nav>
            </Col>
            <Col lg={9} className="vstack gap-4">
              {children}
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default DashboardLayout;