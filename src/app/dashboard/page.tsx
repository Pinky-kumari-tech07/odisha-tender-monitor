"use client";

import { useEffect, useState } from "react";

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
    tenderId?: string | null;
    bidOpeningDate?: string | null;
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

export default function DashboardPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalTenders = tenders.filter(
    (tender) => !tender.isCorrigendum
  ).length;

  const totalCorrigenda = tenders.filter(
    (tender) => tender.isCorrigendum
  ).length;

  const organisations = new Set(
    tenders.map((tender) => tender.organisationId)
  ).size;

  const recentTenders = [...tenders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Odisha Tender Monitor
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Government tender monitoring dashboard
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

        {/* KPI Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Tenders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "—" : totalTenders}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Corrigendums</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "—" : totalCorrigenda}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Organisations</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {loading ? "—" : organisations}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">System Status</p>

            <p className="mt-2 text-xl font-semibold text-green-600">
              {loading ? "Checking..." : "Healthy"}
            </p>
          </div>
        </div>

        {/* Recent Tenders */}
        <div className="mt-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Tenders & Corrigendums
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest items stored in the database
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-gray-500">
              Loading tender data...
            </div>
          ) : recentTenders.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              No tender data available.
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
                  </tr>
                </thead>

                <tbody>
                  {recentTenders.map((tender) => (
                    <tr
                      key={tender.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
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

                      <td className="px-5 py-4 text-gray-700">
                        {tender.tenderNumber || "—"}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {tender.closingDate
                          ? new Date(
                              tender.closingDate
                            ).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {new Date(
                          tender.createdAt
                        ).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}