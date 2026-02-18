"use client";
import { useState, useMemo, useEffect } from "react";

// ─── Era config ──────────────────────────────────────────────────────────────
const ERAS = [
  { value: "1.0", label: "Era 1.0", years: "1983–2000", color: "#f59e0b", bg: "#f59e0b18" },
  { value: "2.0", label: "Era 2.0", years: "2002–2004", color: "#ef4444", bg: "#ef444418" },
  { value: "3.0", label: "Era 3.0", years: "2009–2020", color: "#22c55e", bg: "#22c55e18" },
  { value: "4.0", label: "Era 4.0", years: "2021–now",  color: "#2dd4bf", bg: "#2dd4bf18" },
];

const ERA_MAP = Object.fromEntries(ERAS.map((e) => [e.value, e]));

const SET_LABELS = { "1": "Set 1", "2": "Set 2", "3": "Set 3", e: "Encore", a: "Acoustic Set" };

// ─── Small helpers ────────────────────────────────────────────────────────────
function eraColor(era) { return ERA_MAP[era]?.color ?? "#94a3b8"; }

// ─── Era Chip ─────────────────────────────────────────────────────────────────
function EraChip({ era, active, onClick }) {
  const { label, years, color, bg } = era;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 20px",
        borderRadius: 12,
        border: active ? `2px solid ${color}` : "2px solid #1e3a4a",
        background: active ? bg : "transparent",
        color: active ? color : "#64748b",
        cursor: "pointer",
        transition: "all .2s",
        minWidth: 110,
        gap: 2,
      }}
    >
      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>{years}</span>
    </button>
  );
}

// ─── Song Pill ────────────────────────────────────────────────────────────────
function SongPill({ song }) {
  const setLabel = SET_LABELS[song.set] ? `${SET_LABELS[song.set]} ·` : "";
  const typeColor = song.type === "cover" ? "#2dd4bf" : "#a78bfa";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 20,
        background: song.type === "cover" ? "#2dd4bf12" : "#a78bfa12",
        border: `1px solid ${typeColor}30`,
        fontSize: 12,
        color: typeColor,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {song.name}
      {setLabel && <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 11 }}>{setLabel}</span>}
    </span>
  );
}

// ─── Show Card ────────────────────────────────────────────────────────────────
function ShowCard({ show, expanded, onToggle }) {
  const ec = eraColor(show.era);
  return (
    <div
      onClick={onToggle}
      style={{
        background: "#0a1a24",
        border: `1px solid ${expanded ? ec + "55" : "#1e3a4a"}`,
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 10,
        cursor: "pointer",
        transition: "all .25s",
        boxShadow: expanded ? `0 0 28px ${ec}18` : "none",
        animation: "slideUp .3s ease",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 17, fontWeight: 700, color: "#e2e8f0" }}>
              {show.date}
            </span>
            <span
              style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 8,
                background: ec + "22", color: ec, letterSpacing: 0.5,
              }}
            >
              ERA {show.era}
            </span>
          </div>
          {show.venue && (
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>
              {show.venue}{show.city ? ` · ${show.city}` : ""}{show.state ? `, ${show.state}` : ""}
            </div>
          )}
        </div>
        {/* Song count badge */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 20, background: "#0d2230", border: "1px solid #1e3a4a",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18 }}>🪕</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: "#2dd4bf" }}>
            {show.bluegrassSongs.length}
          </span>
          <span style={{ fontSize: 11, color: "#64748b" }}>song{show.bluegrassSongs.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Song pills — always visible */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
        {show.bluegrassSongs.map((s) => <SongPill key={s.slug} song={s} />)}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e3a4a", animation: "fadeIn .3s" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {show.bluegrassSongs.map((s) => (
              <div
                key={s.slug}
                style={{
                  flex: "1 1 220px",
                  background: "#0d2230",
                  borderRadius: 10,
                  padding: "10px 14px",
                  border: "1px solid #1e3a4a",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 14 }}>{s.name}</span>
                  <span
                    style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 6, fontWeight: 600,
                      background: s.type === "cover" ? "#2dd4bf18" : "#a78bfa18",
                      color: s.type === "cover" ? "#2dd4bf" : "#a78bfa",
                    }}
                  >
                    {s.type === "cover" ? "COVER" : "ORIGINAL"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{s.origin}</div>
                {s.set && (
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                    {SET_LABELS[s.set] || `Set ${s.set}`}
                    {s.position > 0 ? ` · position ${s.position}` : ""}
                  </div>
                )}
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, lineHeight: 1.4, fontStyle: "italic" }}>
                  {s.description}
                </div>
              </div>
            ))}
          </div>

          <a
            href={`https://phish.net/setlists/?d=${show.date}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: "#2dd4bf", fontSize: 13, textDecoration: "none",
              borderBottom: "1px dashed #2dd4bf55",
            }}
          >
            View full setlist on Phish.net →
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Song Stats Card ─────────────────────────────────────────────────────────
function SongStatCard({ stat, selectedEras }) {
  const activeEras = selectedEras.length ? selectedEras : ERAS.map((e) => e.value);
  const count = activeEras.reduce((sum, era) => sum + (stat.byEra[era] || 0), 0);
  const maxCount = Math.max(stat.total, 1);

  return (
    <div
      style={{
        background: "#0a1a24",
        border: "1px solid #1e3a4a",
        borderRadius: 14,
        padding: "16px 18px",
        marginBottom: 10,
        animation: "slideUp .3s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 16 }}>{stat.name}</span>
            <span
              style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 6, fontWeight: 600,
                background: stat.type === "cover" ? "#2dd4bf18" : "#a78bfa18",
                color: stat.type === "cover" ? "#2dd4bf" : "#a78bfa",
              }}
            >
              {stat.type === "cover" ? "COVER" : "ORIGINAL"}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{stat.origin}</div>
          <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", lineHeight: 1.4 }}>{stat.description}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 26, fontWeight: 700, color: "#2dd4bf" }}>
            {count}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            {selectedEras.length ? "in filter" : "all-time"}
          </div>
        </div>
      </div>

      {/* Era bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {ERAS.map((era) => {
          const n = stat.byEra[era.value] || 0;
          const pct = Math.round((n / maxCount) * 100);
          const isActive = !selectedEras.length || selectedEras.includes(era.value);
          return (
            <div key={era.value} style={{ display: "flex", alignItems: "center", gap: 8, opacity: isActive ? 1 : 0.3 }}>
              <span style={{ fontSize: 10, color: era.color, fontWeight: 700, width: 52, fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                {era.label}
              </span>
              <div style={{ flex: 1, background: "#0d2230", borderRadius: 3, height: 8, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`, height: "100%",
                    background: era.color, borderRadius: 3, transition: "width .4s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "#64748b", width: 28, textAlign: "right", fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                {n}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function Spinner({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#0a1a24", borderRadius: 12, border: "1px solid #1e3a4a", marginBottom: 20 }}>
      <div style={{ width: 20, height: 20, border: "3px solid #1e3a4a", borderTopColor: "#2dd4bf", borderRadius: "50%", flexShrink: 0, animation: "spin .8s linear infinite" }} />
      <span style={{ color: "#2dd4bf", fontSize: 14, fontWeight: 500, animation: "pulse 1.5s infinite" }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function PhishOutOfWater() {
  const [data, setData] = useState(null);         // { shows, songStats, totalShows }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEras, setSelectedEras] = useState([]);
  const [view, setView] = useState("shows");       // "shows" | "songs"
  const [expandedShow, setExpandedShow] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    fetch("/api/bluegrass")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleEra = (val) =>
    setSelectedEras((prev) =>
      prev.includes(val) ? prev.filter((e) => e !== val) : [...prev, val]
    );

  const filteredShows = useMemo(() => {
    if (!data?.shows) return [];
    let r = data.shows;
    if (selectedEras.length) r = r.filter((s) => selectedEras.includes(s.era));
    const sorters = {
      "date-desc": (a, b) => b.date.localeCompare(a.date),
      "date-asc":  (a, b) => a.date.localeCompare(b.date),
      "most-songs": (a, b) => b.bluegrassSongs.length - a.bluegrassSongs.length,
    };
    return [...r].sort(sorters[sortBy] ?? sorters["date-desc"]);
  }, [data, selectedEras, sortBy]);

  const filteredSongStats = useMemo(() => {
    if (!data?.songStats) return [];
    const activeEras = selectedEras.length ? selectedEras : ERAS.map((e) => e.value);
    return [...data.songStats]
      .map((s) => ({ ...s, displayCount: activeEras.reduce((sum, era) => sum + (s.byEra[era] || 0), 0) }))
      .sort((a, b) => b.displayCount - a.displayCount);
  }, [data, selectedEras]);

  const hasFilter = selectedEras.length > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#020d14" }}>
      {/* ── Water shimmer header bar ─────────────────────────────────────── */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #0891b2, #2dd4bf, #0891b2, #2dd4bf)", backgroundSize: "200% 100%", animation: "none" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🎣</div>
          <h1
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(22px, 5vw, 36px)",
              fontWeight: 700,
              letterSpacing: 1,
              background: "linear-gradient(135deg, #2dd4bf, #67e8f9, #0891b2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "waterGlow 4s ease-in-out infinite",
              margin: 0,
            }}
          >
            PHISH OUT OF WATER
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, marginTop: 8, fontStyle: "italic" }}>
            Find bluegrass songs from live Phish shows
          </p>
          {data && (
            <p style={{ color: "#334155", fontSize: 12, marginTop: 6 }}>
              {data.totalShows.toLocaleString()} shows · {data.fetchedSongs} bluegrass songs tracked · Phish.net data
            </p>
          )}
        </div>

        {/* ── Era Filter ──────────────────────────────────────────────────── */}
        <div
          style={{
            background: "#0a1a24",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 20,
            border: "1px solid #1e3a4a",
          }}
        >
          <div
            style={{
              fontSize: 11, color: "#475569", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14,
            }}
          >
            Filter by Era
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {ERAS.map((era) => (
              <EraChip
                key={era.value}
                era={era}
                active={selectedEras.includes(era.value)}
                onClick={() => { toggleEra(era.value); setExpandedShow(null); }}
              />
            ))}
          </div>
          {hasFilter && (
            <button
              onClick={() => { setSelectedEras([]); setExpandedShow(null); }}
              style={{
                marginTop: 14, background: "none", border: "1px solid #1e3a4a",
                color: "#64748b", padding: "5px 14px", borderRadius: 8, fontSize: 12,
                cursor: "pointer", transition: "color .2s",
              }}
            >
              Clear filter
            </button>
          )}
        </div>

        {/* ── Loading / Error ─────────────────────────────────────────────── */}
        {loading && <Spinner label="Loading bluegrass songs from Phish.net..." />}
        {error && (
          <div style={{ padding: 16, background: "#2a0a0a", border: "1px solid #ef444433", borderRadius: 12, color: "#ef4444", fontSize: 13, marginBottom: 20 }}>
            {error} — check that PHISHNET_API_KEY is set in Vercel environment variables.
          </div>
        )}

        {/* ── View Toggle + Sort ──────────────────────────────────────────── */}
        {data && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: "#0a1a24", border: "1px solid #1e3a4a", borderRadius: 10, overflow: "hidden" }}>
              {[{ key: "shows", label: `By Show (${filteredShows.length})` }, { key: "songs", label: `By Song (${data.fetchedSongs})` }].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  style={{
                    padding: "8px 18px", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: view === key ? "#2dd4bf" : "transparent",
                    color: view === key ? "#020d14" : "#64748b",
                    transition: "all .2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Sort — only for show view */}
            {view === "shows" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: "#0a1a24", color: "#e2e8f0", border: "1px solid #1e3a4a",
                    borderRadius: 8, padding: "6px 12px", fontSize: 13, outline: "none", cursor: "pointer",
                  }}
                >
                  <option value="date-desc">Most Recent</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="most-songs">Most Bluegrass Songs</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {data && view === "shows" && (
          <div>
            {filteredShows.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#334155" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎸</div>
                <div style={{ fontSize: 16, marginBottom: 6 }}>No shows found for this era</div>
                <div style={{ fontSize: 13 }}>Try selecting a different era or clearing the filter</div>
              </div>
            ) : (
              filteredShows.map((show) => (
                <ShowCard
                  key={show.date}
                  show={show}
                  expanded={expandedShow === show.date}
                  onToggle={() => setExpandedShow(expandedShow === show.date ? null : show.date)}
                />
              ))
            )}
          </div>
        )}

        {data && view === "songs" && (
          <div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#2dd4bf", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 10, background: "#2dd4bf", display: "inline-block" }} />
                Cover
              </span>
              <span style={{ fontSize: 12, color: "#a78bfa", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 10, background: "#a78bfa", display: "inline-block" }} />
                Phish Original
              </span>
            </div>
            {filteredSongStats.map((stat) => (
              <SongStatCard key={stat.slug} stat={stat} selectedEras={selectedEras} />
            ))}
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", paddingTop: 32, borderTop: "1px solid #0d2230", color: "#334155", fontSize: 12 }}>
          Data from{" "}
          <a href="https://phish.net" target="_blank" rel="noopener noreferrer" style={{ color: "#475569", textDecoration: "none" }}>
            Phish.net
          </a>
          {" "}· Cached daily on Vercel · Built for phans who love banjos
        </div>
      </div>
    </div>
  );
}
