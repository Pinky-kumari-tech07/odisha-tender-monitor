"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tender = {
  id: number;
  organisationId: number;
  externalKey: string;
  title: string;
  tenderNumber: string;
  status: string | null;
  publishedDate: string | null;
  closingDate: string | null;
  sourceUrl: string | null;
  isCorrigendum: boolean;
  rawData?: {
    title?: string;
    tenderId?: string;
    sourceUrl?: string;
    closingDate?: string | null;
    tenderNumber?: string;
    isCorrigendum?: boolean;
    bidOpeningDate?: string | null;
    organisationChain?: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Tender[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOrganisationName(tender: Tender): string {
  return (
    tender.rawData?.organisationChain?.replace(/\|\|/g, " → ") ||
    `Organisation #${tender.organisationId}`
  );
}

export default function CorrigendaPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [organisationFilter, setOrganisationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function fetchCorrigenda() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tenders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tenders");
      }

      const result: ApiResponse = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid API response");
      }

      setTenders(result.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load corrigendums.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCorrigenda();
  }, []);

  /*
   * IMPORTANT:
   * The API uses:
   * isCorrigendum: true
   *
   * So we filter using the boolean field directly.
   */
  const corrigenda = useMemo(() => {
    return tenders.filter((item) => item.isCorrigendum === true);
  }, [tenders]);

  const organisations = useMemo(() => {
    const names = corrigenda.map((item) => getOrganisationName(item));

    return Array.from(new Set(names)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [corrigenda]);

  const filteredCorrigenda = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return corrigenda.filter((item) => {
      const organisation = getOrganisationName(item);

      const matchesSearch =
        searchValue === "" ||
        item.title.toLowerCase().includes(searchValue) ||
        item.tenderNumber.toLowerCase().includes(searchValue) ||
        (item.rawData?.tenderId ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        organisation.toLowerCase().includes(searchValue);

      const matchesOrganisation =
        organisationFilter === "all" ||
        organisation === organisationFilter;

      return matchesSearch && matchesOrganisation;
    });
  }, [corrigenda, search, organisationFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCorrigenda.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCorrigenda = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredCorrigenda.slice(startIndex, endIndex);
  }, [filteredCorrigenda, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, organisationFilter]);

  function clearFilters() {
    setSearch("");
    setOrganisationFilter("all");
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Corrigendums
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              All corrigendums detected by the monitor
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCorrigenda}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label
                htmlFor="corrigendum-search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Search
              </label>

              <input
                id="corrigendum-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, reference, ID..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Organisation */}
            <div>
              <label
                htmlFor="organisation-filter"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Organisation
              </label>

              <select
                id="organisation-filter"
                value={organisationFilter}
                onChange={(event) =>
                  setOrganisationFilter(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="all">All organisations</option>

                {organisations.map((organisation) => (
                  <option key={organisation} value={organisation}>
                    {organisation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter summary */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredCorrigenda.length}
              </span>{" "}
              matching corrigendums
            </p>

            {(search || organisationFilter !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-medium text-gray-700 hover:underline sm:text-right"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading corrigendums...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredCorrigenda.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">📄</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-900">
              No corrigendums found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or organisation filter.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filteredCorrigenda.length > 0 && (
          <>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Corrigendum
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Reference
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Organisation
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Closing Date
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Detected
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedCorrigenda.map((item) => {
                      const organisation = getOrganisationName(item);

                      return (
                        <tr
                          key={item.id}
                          className="transition hover:bg-gray-50"
                        >
                          {/* Title */}
                          <td className="max-w-md px-4 py-4 align-top">
                            <div className="font-medium text-gray-900">
                              {item.title}
                            </div>

                            {item.rawData?.tenderId && (
                              <div className="mt-1 text-xs text-gray-500">
                                Tender ID: {item.rawData.tenderId}
                              </div>
                            )}
                          </td>

                          {/* Reference */}
                          <td className="px-4 py-4 align-top text-sm text-gray-700">
                            {item.tenderNumber || "—"}
                          </td>

                          {/* Organisation */}
                          <td className="max-w-sm px-4 py-4 align-top text-sm text-gray-700">
                            {organisation}
                          </td>

                          {/* Closing */}
                          <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-gray-700">
                            {formatDate(item.closingDate)}
                          </td>

                          {/* Detected */}
                          <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>

                          {/* Action */}
                          <td className="whitespace-nowrap px-4 py-4 text-right align-top">
                            <Link
                              href={`/tenders/${item.id}`}
                              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                              View
                              <span className="ml-1">→</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Page{" "}
                  <span className="font-medium text-gray-900">
                    {safeCurrentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={safeCurrentPage === 1}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={safeCurrentPage === totalPages}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}