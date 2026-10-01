"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Form, Pagination } from "react-bootstrap";
import { BsPencilSquare, BsSearch, BsStar, BsStarFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/queryKeys";
import { useSetPageFeatured } from "@/features/pages/hooks/usePages";
import { getMyPages } from "@/features/pages/services/pagesApi";
import { PageType } from "@/shared/types/PageType";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import { toast } from "react-toastify";

type SortField = "displayName" | "category" | "isFeatured";
const PAGE_SIZE = 5;

const MyPages = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("displayName");
  const [sortAscending, setSortAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...queryKeys.pages, "mine", currentPage, search, sortField, sortAscending],
    queryFn: () =>
      getMyPages({
        page: currentPage,
        pageSize: PAGE_SIZE,
        search,
        sortBy: sortField,
        sortDirection: sortAscending ? "asc" : "desc",
      }),
  });
  const featuredMutation = useSetPageFeatured();
  const visiblePages = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageCount = data?.totalPages ?? 0;

  const changeSort = (field: SortField) => {
    if (sortField === field) {
      setSortAscending((ascending) => !ascending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  const setFeatured = (page: PageType) => {
    featuredMutation.mutate(
      { id: page.id, isFeatured: !page.isFeatured },
      {
        onSuccess: () => toast.success("Featured status updated."),
        onError: (mutationError) => toast.error(getErrorMessage(mutationError)),
      },
    );
  };

  return (
    <div>
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">My Pages</h2>
          <p className="text-body-secondary mb-0">Manage pages you created.</p>
        </div>
        <div className="d-flex gap-4">
          <div>
            <div className="small text-body-secondary">Pages</div>
            <strong>{totalCount}</strong>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-transparent d-flex flex-wrap align-items-center justify-content-between gap-3">
          <h3 className="h6 mb-0">Pages you manage</h3>
          <Form role="search" className="position-relative" style={{ width: "min(100%, 280px)" }}>
            <BsSearch aria-hidden="true" className="position-absolute top-50 start-0 translate-middle-y ms-3 text-body-secondary" />
            <Form.Control
              aria-label="Search your pages"
              className="ps-5"
              placeholder="Search pages"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </Form>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-3">
                    <button className="btn btn-link p-0 text-body fw-semibold text-decoration-none" onClick={() => changeSort("displayName")}>
                      Page{sortField === "displayName" ? (sortAscending ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                  <th>
                    <button className="btn btn-link p-0 text-body fw-semibold text-decoration-none" onClick={() => changeSort("category")}>
                      Category{sortField === "category" ? (sortAscending ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                  <th>About</th>
                  <th>
                    <button className="btn btn-link p-0 text-body fw-semibold text-decoration-none" onClick={() => changeSort("isFeatured")}>
                      Featured{sortField === "isFeatured" ? (sortAscending ? " ↑" : " ↓") : ""}
                    </button>
                  </th>
                  <th className="text-end pe-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-5">Loading your pages...</td></tr>
                ) : isError ? (
                  <tr><td colSpan={5} className="text-center text-danger py-5">{getErrorMessage(error)}</td></tr>
                ) : visiblePages.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-body-secondary py-5">{search ? "No pages match your search." : "You have not created any pages yet."}</td></tr>
                ) : (
                  visiblePages.map((page) => (
                    <tr key={page.id}>
                      <th scope="row" className="ps-3 fw-semibold">
                        <Link href={`/profile/page?pageId=${page.id}`} className="d-flex align-items-center gap-2 text-body text-decoration-none">
                          {page.pageImageUrl ? (
                            <Image
                              src={`http://localhost:7120/${page.pageImageUrl}`}
                              alt=""
                              width={40}
                              height={40}
                              className="rounded-circle object-fit-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="avatar avatar-sm rounded-circle bg-body-secondary d-inline-flex align-items-center justify-content-center">
                              {(page.displayName || page.pageName).slice(0, 1).toUpperCase()}
                            </span>
                          )}
                          <span>{page.displayName || page.pageName}</span>
                        </Link>
                      </th>
                      <td>{page.category || "—"}</td>
                      <td className="text-body-secondary" style={{ minWidth: 220, maxWidth: 360 }}>
                        <span className="d-block text-truncate" title={page.aboutPage}>{page.aboutPage}</span>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-1 text-warning"
                          aria-label={`${page.isFeatured ? "Remove" : "Mark"} ${page.displayName} ${page.isFeatured ? "as featured" : "as featured"}`}
                          title={page.isFeatured ? "Remove featured status" : "Mark as featured"}
                          disabled={featuredMutation.isPending}
                          onClick={() => setFeatured(page)}
                        >
                          {page.isFeatured ? <BsStarFill aria-hidden="true" /> : <BsStar aria-hidden="true" />}
                        </Button>
                      </td>
                      <td className="text-end pe-3">
                        <Link
                          href={`/pages/${page.id}/edit`}
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={`Edit ${page.displayName}`}
                        >
                          <BsPencilSquare aria-hidden="true" className="me-1" /> Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!isLoading && !isError && totalCount > 0 && (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-3 py-3 border-top">
              <small className="text-body-secondary">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
              </small>
              <Pagination className="mb-0">
                <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} />
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                ))}
                <Pagination.Next disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)} />
              </Pagination>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyPages;
