import Link from "next/link";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import ErrorMessage from "../../../components/ErrorMessage";
import Icon from "../../../components/Icon";
import LoadingSpinner from "../../../components/LoadingSpinner";
import fetch from "../../../utils/fetch";
import { Column, useSortBy, useTable, usePagination } from "react-table";
import { Template } from "../../../entities/Template";
import { Card, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import DataTable from "../../../components/DataTable";

const CertificatesTable = ({ data }) => {
  type Data = {
    id: string;
    name: string;
    email: string;
    template: Template;
    link: string;
  };

  const columns = useMemo<Column<Data>[]>(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Template",
        accessor: (row) => row.template.name,
        id: "templateName",
      },
      {
        Header: "View",
        accessor: "link",
        disableSortBy: true,
        disableGlobalFilter: true,
        Cell: ({ cell: {}, row: { original } }) => (
          <Link href={`/view/${original.id}`}>
            <a href={`/view/${original.id}`} target="_blank">
              View
            </a>
          </Link>
        ),
      },
    ],
    []
  );

  const tableData = useMemo<Data[]>(() => data, []);

  return <DataTable<Data> columns={columns} data={tableData} />;
};

const Certificates = () => {
  const { data, error } = useSWR("/api/certificates", fetch);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Certificates</h1>
        <Link href="/admin/certificates/new">
          <a
            href="/admin/certificates/new"
            className="d-flex align-items-center btn btn-primary"
          >
            New Batch
            <Icon name="add-line" style={{ fontSize: "1rem" }} />
          </a>
        </Link>
      </div>
      {!data && !error && <LoadingSpinner />}
      {error && <ErrorMessage message="Failed to load Templates" />}
      {!error && data && (
        <Card>
          <CertificatesTable data={data.certificates} />
        </Card>
      )}
    </>
  );
};

export default Certificates;
