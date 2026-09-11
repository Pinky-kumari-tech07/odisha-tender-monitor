"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tender = {
  id: number;
  organisationId: number;
  title: string;
  tenderNumber: string;
  isCorrigendum: boolean;
  closingDate: string | null;
  createdAt: string;
  rawData?: {
    organisationChain?: string | null;
    tenderId?: string | null;
  };
};

type ApiResponse = {
  success: boolean;
  count: number;
  data: Tender[];
};

type Organisation = {
  id: number;
  name: string;
  tenderCount: number;
  corrigendumCount: number;
  totalCount: number;
  latestDetected: string | null;
};

function getOrganisationName(tender: Tender): string {
  return (
    tender.rawData?.organisationChain?.replace(/\|\|/g, " → ") ||
    `Organisation #${tender.organisationId}`
  );
}

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

export default function OrganisationsPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  async function fetchTenders() {
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
      setError("Unable to load organisations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTenders();
  }, []);

  /*
   * Build organisation statistics from persisted tender data.
   *
   * Every tender has an organisationId.
   * Corrigendums are counted separately.
   */
  const organisations = useMemo(() => {
    const organisationMap = new Map<number, Organisation>();

    for (const tender of tenders) {
      const organisationName = getOrganisationName(tender);

      const existing = organisationMap.get(tender.organisationId);

      if (!existing) {
        organisationMap.set(tender.organisationId, {
          id: tender.organisationId,
          name: organisationName,
          tenderCount: tender.isCorrigendum ? 0 : 1,
          corrigendumCount: tender.isCorrigendum ? 1 : 0,
          totalCount: 1,
          latestDetected: tender.createdAt,
        });

        continue;
      }

      if (tender.isCorrigendum) {
        existing.corrigendumCount += 1;
      } else {
        existing.tenderCount += 1;
      }

      existing.totalCount += 1;

      if (
        !existing.latestDetected ||
        new Date(tender.createdAt) >
          new Date(existing.latestDetected)
      ) {
        existing.latestDetected = tender.createdAt;
      }
    }

    return Array.from(organisationMap.values()).sort(
      (a, b) => b.totalCount - a.totalCount
    );
  }, [tenders]);

  const filteredOrganisations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return organisations;
    }

    return organisations.filter((organisation) =>
      organisation.name.toLowerCase().includes(searchValue)
    );
  }, [organisations, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrganisations.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrganisations = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;

    return filteredOrganisations.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredOrganisations, safeCurrentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  function clearSearch() {
    setSearch("");
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Organisations
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Organisations detected by the Odisha Tender Monitor
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTenders}
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

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Organisations
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {organisations.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Tenders
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {organisations.reduce(
                  (total, organisation) =>
                    total + organisation.tenderCount,
                  0
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Corrigendums
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {organisations.reduce(
                  (total, organisation) =>
                    total + organisation.corrigendumCount,
                  0
                )}
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="organisation-search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Search organisation
              </label>

              <input
                id="organisation-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search organisation..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredOrganisations.length}
            </span>{" "}
            organisations
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading organisations...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredOrganisations.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl">🏢</span>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                No organisations found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search.
              </p>
            </div>
          )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredOrganisations.length > 0 && (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Organisation
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Tenders
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Corrigendums
                        </th>

                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Total
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Latest Detected
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginatedOrganisations.map(
                        (organisation) => (
                          <tr
                            key={organisation.id}
                            className="transition hover:bg-gray-50"
                          >
                            {/* Organisation */}
                            <td className="max-w-lg px-4 py-4">
                              <div className="font-medium text-gray-900">
                                {organisation.name}
                              </div>

                              <div className="mt-1 text-xs text-gray-500">
                                Organisation ID:{" "}
                                {organisation.id}
                              </div>
                            </td>

                            {/* Tenders */}
                            <td className="px-4 py-4 text-center">
                              <span className="font-semibold text-gray-900">
                                {organisation.tenderCount}
                              </span>
                            </td>

                            {/* Corrigendums */}
                            <td className="px-4 py-4 text-center">
                              <span className="font-semibold text-gray-900">
                                {organisation.corrigendumCount}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="px-4 py-4 text-center">
                              <span className="font-semibold text-gray-900">
                                {organisation.totalCount}
                              </span>
                            </td>

                            {/* Latest */}
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                              {formatDate(
                                organisation.latestDetected
                              )}
                            </td>

                            {/* Action */}
                            <td className="px-4 py-4 text-right">
                              <Link
                                href={`/organisations/${organisation.id}`}
                                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                View
                                <span className="ml-1">
                                  →
                                </span>
                              </Link>
                            </td>
                          </tr>
                        )
                      )}
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
                        setCurrentPage((page) =>
                          Math.max(1, page - 1)
                        )
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
                      disabled={
                        safeCurrentPage === totalPages
                      }
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