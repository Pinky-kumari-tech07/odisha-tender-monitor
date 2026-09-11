"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tender = {
  id: number;
  organisationId: number;
  externalKey: string;
  title: string;
  tenderNumber: string | null;
  status: string | null;
  publishedDate: string | null;
  closingDate: string | null;
  sourceUrl: string | null;
  isCorrigendum: boolean;
  rawData?: {
    organisationChain?: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

type TenderResponse = {
  success: boolean;
  count: number;
  data: Tender[];
};

const ITEMS_PER_PAGE = 10;

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  async function loadTenders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tenders");

      if (!response.ok) {
        throw new Error("Failed to load tenders");
      }

      const result: TenderResponse = await response.json();

      if (!result.success) {
        throw new Error("API returned an error");
      }

      setTenders(result.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load tender data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenders();
  }, []);

  const filteredTenders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return tenders.filter((tender) => {
      const matchesSearch =
        !searchValue ||
        tender.title.toLowerCase().includes(searchValue) ||
        (tender.tenderNumber ?? "").toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "tender" && !tender.isCorrigendum) ||
        (typeFilter === "corrigendum" && tender.isCorrigendum);

      return matchesSearch && matchesType;
    });
  }, [tenders, search, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTenders.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedTenders = filteredTenders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function formatDate(value: string | null) {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeFilter(value: string) {
    setTypeFilter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tenders
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              All tenders and corrigendums detected by the monitor
            </p>
          </div>

          <button
            onClick={loadTenders}
            disabled={loading}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Search
              </label>

              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search title or reference number..."
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Type
              </label>

              <select
                id="type"
                value={typeFilter}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-black"
              >
                <option value="all">All</option>
                <option value="tender">Tenders</option>
                <option value="corrigendum">Corrigendums</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Tender History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredTenders.length} matching items
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading tender data...
            </div>
          ) : paginatedTenders.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No tenders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Type
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Title
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Reference
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Closing Date
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Detected
                    </th>

                    <th className="px-5 py-3 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTenders.map((tender) => (
                    <tr
                      key={tender.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {/* Type */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            tender.isCorrigendum
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tender.isCorrigendum
                            ? "Corrigendum"
                            : "Tender"}
                        </span>
                      </td>

                      {/* Title */}
                      <td className="max-w-md px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {tender.title}
                        </p>

                        {tender.rawData?.organisationChain && (
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {tender.rawData.organisationChain}
                          </p>
                        )}
                      </td>

                      {/* Reference */}
                      <td className="px-5 py-4 text-gray-700">
                        {tender.tenderNumber || "—"}
                      </td>

                      {/* Closing */}
                      <td className="px-5 py-4 text-gray-700">
                        {formatDate(tender.closingDate)}
                      </td>

                      {/* Detected */}
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(tender.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/tenders/${tender.id}`}
                          className="inline-block rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredTenders.length > 0 && (
            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(totalPages, previous + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}