"use client";

import { useEffect, useState } from "react";
import "./dashboard.css";

type Tender = {
  id: number;
  title: string;
  tenderNumber: string;
  closingDate: string | null;
  sourceUrl: string | null;
  isCorrigendum: boolean;
};

export default function Home() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function fetchTenders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/tenders");

      if (!response.ok) {
        throw new Error("Failed to fetch tenders");
      }

      const result = await response.json();
      setTenders(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load tenders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTenders();
  }, []);

  const filteredTenders = tenders.filter((tender) => {
    const text = `${tender.title} ${tender.tenderNumber}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <main className="dashboard">

      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">OT</div>

          <div>
            <h1>Odisha Tender Monitor</h1>
            <p>Government Tender Monitoring System</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="live-status">
            <span className="status-dot"></span>
            System Online
          </div>

          <button className="refresh-btn" onClick={fetchTenders}>
            ↻ Refresh
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="content">

        {/* Welcome */}
        <div className="welcome">
          <div>
            <span className="eyebrow">MONITORING DASHBOARD</span>

            <h2>
              Tender Overview
            </h2>

            <p>
              Monitor the latest government tenders from the Odisha portal.
            </p>
          </div>

          <div className="last-sync">
            <span>●</span>
            Live database connection
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">

          <div className="stat-card blue">
            <div className="stat-icon">📋</div>

            <div>
              <span>Total Tenders</span>
              <strong>{tenders.length}</strong>
              <small>Stored in database</small>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">🔔</div>

            <div>
              <span>New Tenders</span>
              <strong>0</strong>
              <small>Detected recently</small>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">🏢</div>

            <div>
              <span>Organisations</span>
              <strong>—</strong>
              <small>Government departments</small>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">⚡</div>

            <div>
              <span>System Status</span>
              <strong className="healthy">Healthy</strong>
              <small>All services running</small>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="toolbar">

          <div>
            <h3>Latest Tenders</h3>
            <p>Recently collected tender information</p>
          </div>

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tender or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        {/* Table */}
        <div className="table-card">

          {loading && (
            <div className="empty-state">
              <div className="loader"></div>
              <p>Loading tenders...</p>
            </div>
          )}

          {error && (
            <div className="empty-state error">
              <div>⚠️</div>
              <p>{error}</p>

              <button onClick={fetchTenders}>
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            filteredTenders.length === 0 && (
              <div className="empty-state">
                <div>📭</div>
                <h3>No tenders found</h3>
                <p>
                  {search
                    ? "Try a different search."
                    : "No tender records are available yet."}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredTenders.length > 0 && (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>TENDER</th>
                      <th>REFERENCE</th>
                      <th>CLOSING DATE</th>
                      <th>TYPE</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredTenders.map((tender) => (
                      <tr key={tender.id}>

                        <td>
                          <div className="tender-title">
                            <div className="document-icon">
                              📄
                            </div>

                            <div>
                              <strong>
                                {tender.title}
                              </strong>

                              <span>
                                Tender ID #{tender.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="reference">
                            {tender.tenderNumber}
                          </span>
                        </td>

                        <td>
                          <div className="date">
                            📅{" "}
                            {tender.closingDate
                              ? new Date(
                                  tender.closingDate
                                ).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "Not available"}
                          </div>
                        </td>

                        <td>
                          <span className="badge active">
                            {tender.isCorrigendum
                              ? "Corrigendum"
                              : "Tender"}
                          </span>
                        </td>

                        <td>
                          {tender.sourceUrl ? (
                            <a
                              href={tender.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="view-btn"
                            >
                              View →
                            </a>
                          ) : (
                            <span className="no-link">
                              —
                            </span>
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <span>
            Odisha Tender Monitor
          </span>

          <span>
            Database Connected ●
          </span>

          <span>
            API Status: Healthy
          </span>
        </footer>

      </section>
    </main>
  );
}