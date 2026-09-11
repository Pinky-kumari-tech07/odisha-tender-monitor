
// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// type Tender = {
//   id: number;
//   title: string;
//   tenderNumber: string | null;
//   closingDate: string | null;
//   bidOpeningDate?: string | null;
//   sourceUrl: string | null;
//   isCorrigendum: boolean;
//   createdAt: string;
//   rawData?: {
//     organisationChain?: string | null;
//   } | null;
// };

// type Organisation = {
//   id: number;
//   name: string;
//   tenderCount: number;
//   lastScrapedAt: string | null;
//   createdAt: string;
//   updatedAt: string;
// };

// export default function OrganisationDetailsPage() {
//   const params = useParams();
//   const id = params.id;

//   const [organisation, setOrganisation] =
//     useState<Organisation | null>(null);

//   const [tenders, setTenders] = useState<Tender[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   async function loadOrganisation() {
//     try {
//       setLoading(true);
//       setError("");

//       // Get organisation details
//       const organisationResponse = await fetch(
//         `/api/organisations/${id}`
//       );

//       const organisationResult = await organisationResponse.json();

//       if (!organisationResponse.ok || !organisationResult.success) {
//         throw new Error(
//           organisationResult.message || "Organisation not found"
//         );
//       }

//       setOrganisation(organisationResult.data);

//       // Get tenders
//       const tendersResponse = await fetch("/api/tenders");
//       const tendersResult = await tendersResponse.json();

//       if (!tendersResponse.ok || !tendersResult.success) {
//         throw new Error("Failed to load tenders");
//       }

//       const allTenders: Tender[] = tendersResult.data ?? [];

//       // Filter tenders belonging to this organisation
//       const organisationTenders = allTenders.filter(
//         (tender) => {
//           const organisationId =
//             tender.rawData?.organisationChain;

//           return (
//             tender.rawData?.organisationId === Number(id) ||
//             organisationId === organisationResult.data.name
//           );
//         }
//       );

//       setTenders(organisationTenders);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (id) {
//       loadOrganisation();
//     }
//   }, [id]);

//   const corrigenda = tenders.filter(
//     (tender) => tender.isCorrigendum
//   );

//   const normalTenders = tenders.filter(
//     (tender) => !tender.isCorrigendum
//   );

//   function formatDate(value: string | null | undefined) {
//     if (!value) return "—";

//     return new Date(value).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-6">
//         <div className="mx-auto max-w-7xl">
//           <p className="text-gray-600">
//             Loading organisation...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !organisation) {
//     return (
//       <main className="min-h-screen bg-gray-50 p-6">
//         <div className="mx-auto max-w-7xl">
//           <Link
//             href="/organisations"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             ← Back to Organisations
//           </Link>

//           <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
//             <h1 className="font-semibold text-red-700">
//               Organisation not found
//             </h1>

//             <p className="mt-2 text-sm text-red-600">
//               {error || "Unable to load organisation details."}
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 p-6">
//       <div className="mx-auto max-w-7xl">

//         {/* Back */}
//         <Link
//           href="/organisations"
//           className="text-sm text-blue-600 hover:underline"
//         >
//           ← Back to Organisations
//         </Link>

//         {/* Header */}
//         <div className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
//           <div className="flex flex-col gap-2">
//             <p className="text-sm text-gray-500">
//               Organisation ID: {organisation.id}
//             </p>

//             <h1 className="text-2xl font-bold text-gray-900">
//               {organisation.name}
//             </h1>

//             <p className="text-sm text-gray-500">
//               Odisha Tender Monitor
//             </p>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="mt-6 grid gap-4 md:grid-cols-4">

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Total Items
//             </p>

//             <p className="mt-2 text-3xl font-bold">
//               {tenders.length}
//             </p>
//           </div>

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Tenders
//             </p>

//             <p className="mt-2 text-3xl font-bold">
//               {normalTenders.length}
//             </p>
//           </div>

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Corrigendums
//             </p>

//             <p className="mt-2 text-3xl font-bold">
//               {corrigenda.length}
//             </p>
//           </div>

//           <div className="rounded-xl border bg-white p-5 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Latest Detected
//             </p>

//             <p className="mt-2 text-sm font-semibold">
//               {formatDate(organisation.lastScrapedAt)}
//             </p>
//           </div>

//         </div>

//         {/* Items */}
//         <div className="mt-6 rounded-xl border bg-white shadow-sm">

//           <div className="border-b p-5">
//             <h2 className="text-lg font-semibold">
//               Detected Items
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Tenders and corrigendums detected for this organisation
//             </p>
//           </div>

//           {tenders.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               No tenders or corrigendums found.
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">

//                 <thead className="border-b bg-gray-50">
//                   <tr>
//                     <th className="px-5 py-3 font-semibold">
//                       Type
//                     </th>

//                     <th className="px-5 py-3 font-semibold">
//                       Title
//                     </th>

//                     <th className="px-5 py-3 font-semibold">
//                       Reference
//                     </th>

//                     <th className="px-5 py-3 font-semibold">
//                       Closing Date
//                     </th>

//                     <th className="px-5 py-3 font-semibold">
//                       Detected
//                     </th>

//                     <th className="px-5 py-3 font-semibold">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {tenders.map((tender) => (
//                     <tr
//                       key={tender.id}
//                       className="border-b last:border-0 hover:bg-gray-50"
//                     >

//                       <td className="px-5 py-4">
//                         {tender.isCorrigendum ? (
//                           <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
//                             Corrigendum
//                           </span>
//                         ) : (
//                           <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
//                             Tender
//                           </span>
//                         )}
//                       </td>

//                       <td className="max-w-md px-5 py-4">
//                         <div className="font-medium text-gray-900">
//                           {tender.title}
//                         </div>
//                       </td>

//                       <td className="px-5 py-4 text-gray-600">
//                         {tender.tenderNumber || "—"}
//                       </td>

//                       <td className="px-5 py-4 text-gray-600">
//                         {formatDate(tender.closingDate)}
//                       </td>

//                       <td className="px-5 py-4 text-gray-600">
//                         {formatDate(tender.createdAt)}
//                       </td>

//                       <td className="px-5 py-4">
//                         <Link
//                           href={`/tenders/${tender.id}`}
//                           className="font-medium text-blue-600 hover:underline"
//                         >
//                           View →
//                         </Link>
//                       </td>

//                     </tr>
//                   ))}
//                 </tbody>

//               </table>
//             </div>
//           )}

//         </div>

//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Organisation = {
  id: number;
  name: string;
  tenderCount?: number | null;
  lastScrapedAt?: string | null;
};

type Tender = {
  id: number;
  organisationId: number;
  title: string;
  tenderNumber: string | null;
  closingDate: string | null;
  bidOpeningDate?: string | null;
  sourceUrl: string | null;
  isCorrigendum: boolean;
  createdAt: string;
  rawData?: {
    organisationChain?: string | null;
  } | null;
};

export default function OrganisationDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [organisation, setOrganisation] =
    useState<Organisation | null>(null);

  const [tenders, setTenders] = useState<Tender[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadOrganisation() {
      try {
        setLoading(true);
        setError("");

        // Get organisation details
        const organisationResponse = await fetch(
          `/api/organisations/${id}`
        );

        const organisationResult = await organisationResponse.json();

        if (!organisationResponse.ok) {
          throw new Error(
            organisationResult.message ||
              "Failed to load organisation"
          );
        }

        setOrganisation(organisationResult.data);

        // Get all tenders
        const tendersResponse = await fetch("/api/tenders");

        const tendersResult = await tendersResponse.json();

        if (!tendersResponse.ok) {
          throw new Error(
            tendersResult.message || "Failed to load tenders"
          );
        }

        const allTenders: Tender[] = tendersResult.data ?? [];

        // Only show tenders belonging to this organisation
        const organisationTenders = allTenders.filter(
          (tender) => tender.organisationId === Number(id)
        );

        setTenders(organisationTenders);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrganisation();
  }, [id]);

  function formatDate(value: string | null | undefined) {
    if (!value) return "—";

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

  const tenderCount = tenders.filter(
    (tender) => !tender.isCorrigendum
  ).length;

  const corrigendumCount = tenders.filter(
    (tender) => tender.isCorrigendum
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border bg-white p-8 text-center">
            <p className="text-gray-600">
              Loading organisation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/organisations"
            className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Organisations
          </Link>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load organisation
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!organisation) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/organisations"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Organisations
          </Link>

          <div className="mt-6 rounded-xl border bg-white p-8 text-center">
            <h1 className="text-xl font-semibold">
              Organisation not found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href="/organisations"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Organisations
        </Link>

        {/* Organisation Header */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Organisation
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {organisation.name}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Organisation ID: {organisation.id}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              Last scraped:{" "}
              <span className="font-medium text-gray-700">
                {formatDate(organisation.lastScrapedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Items
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {tenders.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Tenders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {tenderCount}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Corrigendums
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {corrigendumCount}
            </p>
          </div>

        </div>

        {/* Tender List */}
        <div className="mt-6 rounded-xl border bg-white shadow-sm">

          <div className="border-b p-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Organisation Items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tenders and corrigendums detected for this organisation.
            </p>
          </div>

          {tenders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                No tenders or corrigendums found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Type
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Title
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Reference
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Closing Date
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Detected
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">

                  {tenders.map((tender) => (
                    <tr
                      key={tender.id}
                      className="hover:bg-gray-50"
                    >

                      {/* Type */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {tender.isCorrigendum ? (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                            Corrigendum
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Tender
                          </span>
                        )}
                      </td>

                      {/* Title */}
                      <td className="max-w-md px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {tender.title}
                        </div>
                      </td>

                      {/* Reference */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {tender.tenderNumber || "—"}
                      </td>

                      {/* Closing */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {formatDate(tender.closingDate)}
                      </td>

                      {/* Detected */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {formatDate(tender.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-5 py-4 text-right">

                        <Link
                          href={`/tenders/${tender.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          View →
                        </Link>

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

