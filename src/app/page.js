"use client";
import { useState, useMemo, useEffect, useRef } from "react";

// ─── Constants ──────────────────────────────────────────────────────────────
const ERAS = [
  { value: "1.0", label: "1.0 (1983-2000)" },
  { value: "2.0", label: "2.0 (2002-2004)" },
  { value: "3.0", label: "3.0 (2009-2020)" },
  { value: "4.0", label: "4.0 (2021-)" },
];
const VIBES = ["raging","funky","dark","blissful","exploratory","ambient","melodic","celebratory","transcendent"];
const ENERGY_LEVELS = [
  { value: "low-and-slow", label: "Low & Slow" },
  { value: "steady-groove", label: "Steady Groove" },
  { value: "building", label: "Building" },
  { value: "high-octane", label: "High Octane" },
  { value: "rageface", label: "Rageface" },
];
const STYLES = [
  { value: "type-ii-heavy", label: "Type II Heavy" },
  { value: "segue-fest", label: "Segue Fest" },
  { value: "tension-release", label: "Tension & Release" },
  { value: "groove-based", label: "Groove-Based" },
  { value: "peak-and-soar", label: "Peak & Soar" },
  { value: "ambient-space", label: "Ambient Space" },
  { value: "power-rock", label: "Power Rock" },
  { value: "composed-tight", label: "Composed & Tight" },
];
const FEATURES_LIST = [
  { value: "marathon-jams", label: "20+ Min Jams" },
  { value: "halloween", label: "Halloween" },
  { value: "nye", label: "New Year's Eve" },
  { value: "festival", label: "Festival" },
  { value: "cover-heavy", label: "Cover Heavy" },
  { value: "guest", label: "Guest Sit-In" },
];
const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "jamCharts", label: "Most Jam Charts" },
  { value: "reviews", label: "Most Reviews" },
  { value: "date-desc", label: "Most Recent" },
  { value: "date-asc", label: "Earliest" },
  { value: "energy", label: "Highest Energy" },
];
const VC = {
  raging:"#ff4444", funky:"#d4a017", dark:"#7b3fa0", blissful:"#4ecdc4",
  exploratory:"#3b82f6", ambient:"#06b6d4", melodic:"#f472b6",
  celebratory:"#f59e0b", transcendent:"#a78bfa",
};
const EC = {
  "low-and-slow":"#06b6d4", "steady-groove":"#22c55e", "building":"#eab308",
  "high-octane":"#f97316", "rageface":"#ef4444",
};
const SC = {
  "type-ii-heavy":"#8b5cf6", "segue-fest":"#ec4899", "tension-release":"#f43f5e",
  "groove-based":"#d4a017", "peak-and-soar":"#3b82f6", "ambient-space":"#06b6d4",
  "power-rock":"#ef4444", "composed-tight":"#22c55e",
};

function getEra(d) {
  const y = parseInt(d.substring(0,4));
  return y <= 2000 ? "1.0" : y <= 2004 ? "2.0" : y <= 2020 ? "3.0" : "4.0";
}

// ─── Curated Shows (always available) ───────────────────────────────────────
const CURATED = [
  { date:"1993-02-20", venue:"Roxy Theatre", city:"Atlanta", state:"GA", rating:4.62, jamCharts:3, reviews:52, energy:5, vibes:["raging","melodic"], energyLevel:["rageface"], style:["power-rock","peak-and-soar"], features:["marathon-jams"], notableJams:["Split Open and Melt","YEM"], songs:["Split Open and Melt","You Enjoy Myself","Fluffhead","Maze","Possum"], description:"Early '93 rager. Raw energy and tight playing." },
  { date:"1993-08-13", venue:"Murat Theatre", city:"Indianapolis", state:"IN", rating:4.70, jamCharts:4, reviews:67, energy:5, vibes:["raging","melodic","exploratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["YEM (30 min)","David Bowie"], songs:["You Enjoy Myself","David Bowie","Fluffhead","Split Open and Melt","Chalk Dust Torture"], description:"Classic '93 with a titanic YEM and peak-era Bowie." },
  { date:"1994-06-22", venue:"Veterans Memorial Auditorium", city:"Columbus", state:"OH", rating:4.82, jamCharts:5, reviews:89, energy:5, vibes:["raging","funky","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","groove-based"], features:["marathon-jams"], notableJams:["Tweezer (34 min)","Bowie (28 min)"], songs:["Tweezer","David Bowie","Divided Sky","Stash","Suzy Greenberg"], description:"Legendary '94 with a genre-defining Tweezer and monstrous Bowie." },
  { date:"1994-12-31", venue:"Boston Garden", city:"Boston", state:"MA", rating:4.85, jamCharts:5, reviews:134, energy:5, vibes:["raging","celebratory","melodic"], energyLevel:["rageface","high-octane"], style:["peak-and-soar","power-rock"], features:["nye","marathon-jams"], notableJams:["Bowie (25 min)","Slave"], songs:["Auld Lang Syne","David Bowie","Slave to the Traffic Light","Divided Sky","Possum"], description:"The Gamehendge NYE with devastating Bowie." },
  { date:"1995-10-31", venue:"Rosemont Horizon", city:"Chicago", state:"IL", rating:4.72, jamCharts:3, reviews:118, energy:4, vibes:["melodic","blissful","celebratory"], energyLevel:["steady-groove","building"], style:["composed-tight"], features:["halloween","cover-heavy"], notableJams:["Reba","Slave"], songs:["Quadrophenia (full album)","Reba","Slave to the Traffic Light"], description:"The Quadrophenia Halloween." },
  { date:"1995-12-31", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.88, jamCharts:4, reviews:156, energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["nye","marathon-jams"], notableJams:["Runaway Jim (25 min)"], songs:["Auld Lang Syne","Runaway Jim","Mike's Song","Weekapaug Groove","YEM"], description:"The time machine NYE with a massive Jim." },
  { date:"1996-10-31", venue:"The Omni", city:"Atlanta", state:"GA", rating:4.68, jamCharts:4, reviews:110, energy:4, vibes:["funky","dark","exploratory"], energyLevel:["building","high-octane"], style:["groove-based","type-ii-heavy"], features:["halloween","cover-heavy"], notableJams:["Crosseyed and Painless","Antelope"], songs:["Remain in Light (full album)","Crosseyed and Painless","Antelope","Simple"], description:"Remain in Light Halloween. Catalyzed the funk era." },
  { date:"1997-11-17", venue:"McNichols Sports Arena", city:"Denver", state:"CO", rating:4.90, jamCharts:6, reviews:143, energy:5, vibes:["dark","funky","exploratory"], energyLevel:["rageface","building"], style:["type-ii-heavy","groove-based","tension-release"], features:["marathon-jams"], notableJams:["Tweezer (35 min)","Ghost (22 min)"], songs:["Tweezer","Ghost","Jesus Just Left Chicago","Maze","Character Zero"], description:"Peak fall '97. The Denver Tweezer is endlessly deep cow-funk." },
  { date:"1997-11-22", venue:"Hampton Coliseum", city:"Hampton", state:"VA", rating:4.95, jamCharts:7, reviews:201, energy:5, vibes:["dark","funky","exploratory","raging"], energyLevel:["rageface"], style:["type-ii-heavy","segue-fest","tension-release"], features:["marathon-jams"], notableJams:["Halley's>Tweezer (40+ min)","Ghost"], songs:["Halley's Comet","Tweezer","Ghost","Piper","Dirt","Black-Eyed Katy"], description:"'Phish Destroys America' Hampton. One of the greatest shows ever." },
  { date:"1997-12-31", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.80, jamCharts:4, reviews:178, energy:5, vibes:["funky","celebratory","exploratory"], energyLevel:["high-octane"], style:["type-ii-heavy","groove-based"], features:["nye"], notableJams:["Runaway Jim (22 min)","DWD"], songs:["Runaway Jim","Down with Disease","Harry Hood","Bohemian Rhapsody"], description:"NYE '97. Smoking Jim, transcendent Hood." },
  { date:"1998-04-02", venue:"Nassau Coliseum", city:"Uniondale", state:"NY", rating:4.75, jamCharts:5, reviews:95, energy:4, vibes:["ambient","exploratory","blissful"], energyLevel:["building"], style:["ambient-space","type-ii-heavy"], features:["marathon-jams"], notableJams:["Roses Are Free (20 min)","Bathtub Gin"], songs:["Roses Are Free","Bathtub Gin","Ghost","Reba","Harry Hood"], description:"Island Tour night 2. Roses Are Free goes to outer space." },
  { date:"1998-04-03", venue:"Nassau Coliseum", city:"Uniondale", state:"NY", rating:4.78, jamCharts:4, reviews:102, energy:5, vibes:["dark","raging","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release"], features:["marathon-jams"], notableJams:["Tweezer (30 min)","Piper"], songs:["Tweezer","Piper","Wolfman's Brother","Limb by Limb","Possum"], description:"Island Tour night 3. One of the nastiest Tweezers ever." },
  { date:"1999-12-31", venue:"Big Cypress", city:"Big Cypress", state:"FL", rating:4.97, jamCharts:8, reviews:312, energy:5, vibes:["blissful","exploratory","celebratory","transcendent"], energyLevel:["building","high-octane"], style:["type-ii-heavy","ambient-space","peak-and-soar"], features:["festival","nye","marathon-jams"], notableJams:["Runaway Jim (60+ min sunrise)","Rock and Roll"], songs:["Runaway Jim","Rock and Roll","Mike's Song","Weekapaug Groove","Bug"], description:"The millennium show. Sunrise Jim is the most iconic moment in Phish history." },
  { date:"2003-02-28", venue:"Nassau Coliseum", city:"Uniondale", state:"NY", rating:4.60, jamCharts:5, reviews:102, energy:5, vibes:["raging","dark","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release","power-rock"], features:["marathon-jams"], notableJams:["Piper (25 min)","Tweezer"], songs:["Piper","Tweezer","Wolfman's Brother","Seven Below","46 Days"], description:"IT-era Nassau heater. Piper goes nuclear." },
  { date:"2012-08-31", venue:"Dick's Sporting Goods Park", city:"Commerce City", state:"CO", rating:4.55, jamCharts:4, reviews:92, energy:5, vibes:["raging","exploratory","blissful"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Rock and Roll (24 min)","Light (22 min)"], songs:["Rock and Roll","Light","Tweezer","Carini","Hood"], description:"Legendary Dick's 2012. Rock and Roll hits escape velocity." },
  { date:"2015-08-22", venue:"Magnaball Festival", city:"Watkins Glen", state:"NY", rating:4.78, jamCharts:6, reviews:134, energy:5, vibes:["blissful","exploratory","transcendent","raging"], energyLevel:["building","rageface"], style:["type-ii-heavy","peak-and-soar","segue-fest"], features:["festival","marathon-jams"], notableJams:["Tweezer>Caspian (50+ min)","No Men (20 min)"], songs:["Tweezer","Prince Caspian","No Men In No Man's Land","Blaze On"], description:"Magnaball Saturday. Tweezer>Caspian is a top-5 all-time jam." },
  { date:"2017-07-25", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.65, jamCharts:5, reviews:98, energy:5, vibes:["exploratory","dark","blissful"], energyLevel:["building"], style:["type-ii-heavy","ambient-space"], features:["marathon-jams"], notableJams:["Lawn Boy (18 min)","Everything's Right (20 min)"], songs:["Everything's Right","Lawn Boy","No Men","Soul Planet","Blaze On"], description:"Baker's Dozen Jimmies Night. Lawn Boy goes type 2 for the first time." },
  { date:"2017-08-06", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.72, jamCharts:5, reviews:112, energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["high-octane","rageface"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Soul Planet (22 min)","Simple (25 min)"], songs:["Soul Planet","Simple","Tweezer","Mr. Completely","SANTOS"], description:"Baker's Dozen finale. Simple reaches transcendence." },
  { date:"2021-08-07", venue:"Deer Creek", city:"Noblesville", state:"IN", rating:4.50, jamCharts:4, reviews:78, energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Simple (28 min)","Tweezer"], songs:["Simple","Tweezer","Soul Planet","Disease","Slave"], description:"Comeback from the pandemic. Simple goes 28 minutes." },
  { date:"2022-04-22", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.58, jamCharts:5, reviews:82, energy:5, vibes:["raging","exploratory","dark"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release"], features:["marathon-jams"], notableJams:["Carini (25 min)","Everything's Right (20 min)"], songs:["Carini","Everything's Right","Tweezer","Simple","Possum"], description:"Spring MSG heater. Carini goes to the darkest places." },
  { date:"2023-12-31", venue:"Madison Square Garden", city:"New York", state:"NY", rating:4.55, jamCharts:4, reviews:90, energy:5, vibes:["celebratory","blissful","raging"], energyLevel:["high-octane","rageface"], style:["type-ii-heavy","peak-and-soar"], features:["nye","marathon-jams"], notableJams:["Tweezer (30 min)","Ghost (22 min)"], songs:["Tweezer","Ghost","YEM","Auld Lang Syne","First Tube"], description:"NYE 2023. Titanic Tweezer and Ghost for the ages." },
].map(s => ({ ...s, era: getEra(s.date), source: "curated" }));

// ─── Small Components ───────────────────────────────────────────────────────
function Chip({ label, active, color, onClick }) {
  return <button onClick={onClick} style={{
    display:"inline-flex", padding:"5px 12px", borderRadius:20,
    border: active ? `2px solid ${color||"#e8a849"}` : "1px solid #444",
    background: active ? (color||"#e8a849")+"22" : "transparent",
    color: active ? (color||"#e8a849") : "#999",
    fontSize:13, cursor:"pointer", transition:"all .2s",
    fontWeight: active ? 600 : 400, whiteSpace:"nowrap",
  }}>{label}</button>;
}

function ShowCard({ show, expanded, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      background:"#1a1a2e", border:`1px solid ${expanded?"#e8a84955":"#2a2a3e"}`, borderRadius:12,
      padding:20, marginBottom:12, cursor:"pointer", transition:"all .25s",
      boxShadow: expanded ? "0 0 30px #e8a84922" : "none",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:18, color:"#e8a849", fontWeight:700 }}>{show.date}</span>
            <span style={{ background:"#e8a84933", color:"#e8a849", fontSize:11, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>ERA {show.era}</span>
            {show.source === "live" && <span style={{ background:"#4ecdc422", color:"#4ecdc4", fontSize:10, padding:"2px 6px", borderRadius:8, fontWeight:600 }}>LIVE</span>}
          </div>
          <div style={{ color:"#ccc", fontSize:14, marginTop:4 }}>{show.venue}</div>
          <div style={{ color:"#888", fontSize:13 }}>{show.city}{show.state ? `, ${show.state}` : ""}</div>
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          {show.rating > 0 && <div style={{ textAlign:"center" }}><div style={{ fontSize:22, fontWeight:700, color:"#4ecdc4", fontFamily:"'Space Mono',monospace" }}>{show.rating.toFixed(2)}</div><div style={{ fontSize:10, color:"#888" }}>RATING</div></div>}
          {show.jamCharts > 0 && <div style={{ textAlign:"center" }}><div style={{ fontSize:22, fontWeight:700, color:"#f59e0b", fontFamily:"'Space Mono',monospace" }}>{show.jamCharts}</div><div style={{ fontSize:10, color:"#888" }}>JAMS</div></div>}
          {show.reviews > 0 && <div style={{ textAlign:"center" }}><div style={{ fontSize:22, fontWeight:700, color:"#a78bfa", fontFamily:"'Space Mono',monospace" }}>{show.reviews}</div><div style={{ fontSize:10, color:"#888" }}>REVIEWS</div></div>}
        </div>
      </div>
      {(show.vibes?.length > 0 || show.energyLevel?.length > 0 || show.style?.length > 0) && (
        <div style={{ display:"flex", gap:6, marginTop:12, flexWrap:"wrap", alignItems:"center" }}>
          {show.vibes?.map(v => <span key={v} style={{ fontSize:11, padding:"3px 10px", borderRadius:12, background:(VC[v]||"#888")+"22", color:VC[v]||"#888", fontWeight:600 }}>{v}</span>)}
          {show.energyLevel?.map(e => <span key={e} style={{ fontSize:11, padding:"3px 10px", borderRadius:12, background:(EC[e]||"#888")+"22", color:EC[e]||"#888", fontWeight:600, border:`1px solid ${(EC[e]||"#888")}33` }}>{ENERGY_LEVELS.find(el => el.value === e)?.label || e}</span>)}
          {show.style?.map(s => <span key={s} style={{ fontSize:11, padding:"3px 10px", borderRadius:12, background:(SC[s]||"#888")+"22", color:SC[s]||"#888", fontWeight:600, fontStyle:"italic" }}>{STYLES.find(st => st.value === s)?.label || s}</span>)}
          {show.energy > 0 && <span style={{ fontSize:13, marginLeft:8 }}>{"🔥".repeat(show.energy)}</span>}
        </div>
      )}
      {show.description && <div style={{ color:"#bbb", fontSize:13, marginTop:10, lineHeight:1.5 }}>{show.description}</div>}
      {expanded && (
        <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid #2a2a3e", animation:"fadeIn .3s" }}>
          {show.notableJams?.length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#e8a849", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Notable Jams</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{show.notableJams.map((j,i) => <span key={i} style={{ background:"#e8a84915", border:"1px solid #e8a84933", color:"#e8a849", padding:"4px 10px", borderRadius:8, fontSize:12, fontFamily:"'Space Mono',monospace" }}>{j}</span>)}</div>
          </div>}
          {show.songs?.length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#4ecdc4", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Setlist</div>
            <div style={{ color:"#aaa", fontSize:13, lineHeight:1.7 }}>{show.songs.join(" · ")}</div>
          </div>}
          {show.features?.length > 0 && <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:"#a78bfa", fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Features</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{show.features.map(f => <span key={f} style={{ background:"#a78bfa15", border:"1px solid #a78bfa33", color:"#a78bfa", padding:"3px 10px", borderRadius:8, fontSize:12 }}>{f.replace(/-/g," ")}</span>)}</div>
          </div>}
          <a href={`https://phish.net/setlists/?d=${show.date}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-block", marginTop:8, color:"#e8a849", fontSize:13, textDecoration:"none", borderBottom:"1px dashed #e8a84966" }}
            onClick={e => e.stopPropagation()}>View on Phish.net →</a>
        </div>
      )}
    </div>
  );
}

// ─── AI Search ──────────────────────────────────────────────────────────────
function AiSearch({ shows, onResults, currentFilters }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  // Build an auto-query from current filter state when no text is typed
  const buildAutoQuery = () => {
    const parts = [];
    if (currentFilters.eras.length) parts.push(`era ${currentFilters.eras.join(" or ")}`);
    if (currentFilters.vibes.length) parts.push(`${currentFilters.vibes.join(", ")} vibes`);
    if (currentFilters.energyLevels.length) parts.push(`${currentFilters.energyLevels.map(e => ENERGY_LEVELS.find(el => el.value === e)?.label || e).join(" or ")} energy`);
    if (currentFilters.styles.length) parts.push(`${currentFilters.styles.map(s => STYLES.find(st => st.value === s)?.label || s).join(" or ")} style`);
    if (currentFilters.features.length) parts.push(`${currentFilters.features.join(", ")}`);
    if (currentFilters.minRating > 0) parts.push(`min rating ${currentFilters.minRating.toFixed(1)}`);
    if (currentFilters.minJamCharts > 0) parts.push(`${currentFilters.minJamCharts}+ jam charts`);
    if (currentFilters.yearRange[0] !== 1983 || currentFilters.yearRange[1] !== 2026) parts.push(`years ${currentFilters.yearRange[0]}-${currentFilters.yearRange[1]}`);
    if (currentFilters.songSearch.trim()) parts.push(`featuring "${currentFilters.songSearch.trim()}"`);
    return parts.length ? `recommend the best Phish shows with ${parts.join(", ")}` : "recommend the top overall Phish shows, the true must-hear nights";
  };

  const search = async () => {
    const effectiveQuery = query.trim() || buildAutoQuery();
    setLoading(true); setResponse("");
    try {
      const summaries = shows.slice(0, 300).map(s =>
        `${s.date}|${s.venue},${s.city}|Era${s.era}|R${s.rating}|E${s.energy}|V:${(s.vibes||[]).join(",")}|F:${(s.features||[]).join(",")}|S:${(s.songs||[]).slice(0,8).join(",")}|${(s.notableJams||[]).join(",")}|${s.description||""}`
      ).join("\n");
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a Phish show expert. Given this database and query, return JSON with: "dates" (array of up to 12 YYYY-MM-DD dates ordered by relevance) and "explanation" (2-3 enthusiastic sentences). DATABASE (${shows.length} shows):\n${summaries}\n\nQUERY: "${effectiveQuery}"\n\nReturn ONLY valid JSON, no backticks.` }]
        })
      });
      const data = await resp.json();
      const text = data.content.map(c => c.text||"").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      onResults(parsed.dates || []);
      setResponse(parsed.explanation || "");
    } catch { setResponse("AI search hit a snag. Try the manual filters!"); }
    setLoading(false);
  };

  const hasFilters = currentFilters.eras.length || currentFilters.vibes.length || currentFilters.energyLevels.length || currentFilters.styles.length || currentFilters.features.length || currentFilters.minRating > 0 || currentFilters.minJamCharts > 0 || (currentFilters.yearRange[0] !== 1983 || currentFilters.yearRange[1] !== 2026) || currentFilters.songSearch.trim();
  const btnLabel = loading ? "Thinking..." : (query.trim() ? "Ask Claude" : hasFilters ? "Ask Claude About These Filters" : "Ask Claude to Recommend Shows");

  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>
        Ask Claude <span style={{ color:"#555", fontWeight:400, textTransform:"none", letterSpacing:0 }}>— type a question or just click the button to use your current filters</span>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key==="Enter" && search()}
          placeholder='Optional: "dark funky 97" · "best NYE with marathon jams" · or just click the button →'
          style={{ flex:1, padding:"12px 16px", borderRadius:10, border:"1px solid #333", background:"#0d0d1a", color:"#eee", fontSize:13, outline:"none" }} />
        <button onClick={search} disabled={loading} style={{
          padding:"12px 20px", borderRadius:10, border:"none",
          background: loading ? "#444" : "linear-gradient(135deg, #e8a849, #d4783a)",
          color:"#111", fontWeight:700, fontSize:13, cursor:loading?"wait":"pointer", whiteSpace:"nowrap",
        }}>{btnLabel}</button>
      </div>
      {response && <div style={{ marginTop:10, padding:12, borderRadius:10, background:"#e8a84911", border:"1px solid #e8a84933", color:"#e8a849", fontSize:13, lineHeight:1.5 }}>{response}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function HelpingPhriendlyBook() {
  const [liveShows, setLiveShows] = useState([]);
  const [loadedYears, setLoadedYears] = useState(new Set());
  // Phase 1: loading year/show metadata
  const [autoLoading, setAutoLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState("Warming up the freezer...");
  const [loadError, setLoadError] = useState("");
  // Phase 2: enriching setlists in background
  const [enriching, setEnriching] = useState(false);
  const [enrichDone, setEnrichDone] = useState(0);
  const [enrichTotal, setEnrichTotal] = useState(0);
  const loadStarted = useRef(false);

  const TOTAL_YEARS = 44; // 1983-2026 inclusive

  useEffect(() => {
    if (loadStarted.current) return;
    loadStarted.current = true;

    const run = async () => {
      // ── Phase 1: load all show metadata ──────────────────────────────────
      const allYears = [];
      for (let y = 1983; y <= 2026; y++) allYears.push(y);

      const allLoadedShows = []; // keep a local copy for phase 2
      let failCount = 0;
      const YEAR_BATCH = 5;

      for (let i = 0; i < allYears.length; i += YEAR_BATCH) {
        const batch = allYears.slice(i, i + YEAR_BATCH);
        setLoadProgress(`Fetching ${batch[0]}-${batch[batch.length-1]}... (${Math.min(i + YEAR_BATCH, allYears.length)}/${allYears.length} years)`);

        const results = await Promise.all(batch.map(async (y) => {
          try {
            const resp = await fetch(`/api/shows?year=${y}`);
            const data = await resp.json();
            if (data.error) return { year: y, shows: [] };
            return { year: y, shows: (data.shows || []).map(s => ({
              date: s.date, venue: s.venue, city: s.city, state: s.state,
              era: getEra(s.date), rating: s.rating, reviews: s.reviews,
              jamCharts: 0, energy: 0, vibes: [], energyLevel: [], style: [],
              features: (s.date?.includes("-10-31") ? ["halloween"] : []).concat(s.date?.includes("-12-31") ? ["nye"] : []),
              notableJams: [], songs: [], description: "", source: "live",
            }))};
          } catch {
            failCount++;
            return { year: y, shows: [] };
          }
        }));

        const batchShows = results.flatMap(r => r.shows);
        allLoadedShows.push(...batchShows);

        setLiveShows(prev => {
          const existing = new Set(prev.map(s => s.date));
          return [...prev, ...batchShows.filter(s => !existing.has(s.date))];
        });
        setLoadedYears(prev => new Set([...prev, ...results.map(r => r.year)]));
      }

      if (failCount > 0) setLoadError(`${failCount} year(s) failed to load.`);
      setAutoLoading(false);

      // ── Phase 2: enrich all live shows with setlist data ──────────────────
      const curatedDates = new Set(CURATED.map(s => s.date));
      // Sort by rating desc so the best shows get setlists first
      const toEnrich = allLoadedShows
        .filter(s => !curatedDates.has(s.date))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0));

      if (!toEnrich.length) return;
      setEnrichTotal(toEnrich.length);
      setEnriching(true);

      const SL_BATCH = 5;
      for (let i = 0; i < toEnrich.length; i += SL_BATCH) {
        const chunk = toEnrich.slice(i, i + SL_BATCH);
        setEnrichDone(i);

        const enriched = await Promise.all(chunk.map(async (show) => {
          try {
            const resp = await fetch(`/api/setlists?date=${show.date}`);
            const data = await resp.json();
            if (!data.songs) return null;
            const songNames = [...new Set(data.songs.map(s => s.song).filter(Boolean))];
            const jc = data.songs.filter(s => s.isjamchart === "1");
            const notableJams = jc.map(s => s.song + (s.jamchart_description ? ` — ${s.jamchart_description.slice(0,60)}` : ""));
            return {
              date: show.date,
              songs: songNames,
              jamCharts: jc.length,
              notableJams,
              features: [...show.features, ...(jc.length >= 4 ? ["marathon-jams"] : [])],
            };
          } catch { return null; }
        }));

        const valid = enriched.filter(Boolean);
        if (valid.length) {
          setLiveShows(prev => {
            const updated = [...prev];
            valid.forEach(es => {
              const idx = updated.findIndex(s => s.date === es.date);
              if (idx >= 0) updated[idx] = { ...updated[idx], ...es };
            });
            return updated;
          });
        }

        // Polite rate-limiting
        await new Promise(r => setTimeout(r, 100));
      }

      setEnrichDone(toEnrich.length);
      setEnriching(false);
    };

    run();
  }, []);

  const allShows = useMemo(() => {
    const curatedDates = new Set(CURATED.map(s => s.date));
    const combined = [...CURATED];
    liveShows.forEach(ls => { if (!curatedDates.has(ls.date)) combined.push(ls); });
    return combined;
  }, [liveShows]);

  const [selectedEras, setSelectedEras] = useState([]);
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedEnergyLevels, setSelectedEnergyLevels] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [yearRange, setYearRange] = useState([1983, 2026]);
  const [minRating, setMinRating] = useState(0);
  const [minJamCharts, setMinJamCharts] = useState(0);
  const [minEnergy, setMinEnergy] = useState(0);
  const [songSearch, setSongSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [expandedShow, setExpandedShow] = useState(null);
  const [aiDates, setAiDates] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  const toggle = (arr, setArr, val) => { setAiDates(null); setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]); };

  const currentFilters = {
    eras: selectedEras, vibes: selectedVibes, energyLevels: selectedEnergyLevels,
    styles: selectedStyles, features: selectedFeatures, yearRange,
    minRating, minJamCharts, songSearch,
  };

  const filtered = useMemo(() => {
    let r = allShows;
    if (aiDates) return aiDates.map(d => allShows.find(s => s.date === d)).filter(Boolean);
    if (selectedEras.length) r = r.filter(s => selectedEras.includes(s.era));
    if (selectedVibes.length) r = r.filter(s => s.vibes && selectedVibes.some(v => s.vibes.includes(v)));
    if (selectedEnergyLevels.length) r = r.filter(s => s.energyLevel && selectedEnergyLevels.some(e => s.energyLevel.includes(e)));
    if (selectedStyles.length) r = r.filter(s => s.style && selectedStyles.some(st => s.style.includes(st)));
    if (selectedFeatures.length) r = r.filter(s => s.features && selectedFeatures.some(f => s.features.includes(f)));
    r = r.filter(s => { const y = parseInt(s.date.substring(0,4)); return y >= yearRange[0] && y <= yearRange[1]; });
    if (minRating > 0) r = r.filter(s => s.rating >= minRating);
    if (minJamCharts > 0) r = r.filter(s => s.jamCharts >= minJamCharts);
    if (minEnergy > 0) r = r.filter(s => s.energy >= minEnergy);
    if (songSearch.trim()) { const q = songSearch.toLowerCase(); r = r.filter(s => (s.songs||[]).some(x => x.toLowerCase().includes(q)) || (s.notableJams||[]).some(x => x.toLowerCase().includes(q))); }
    const sorters = { "rating":(a,b)=>(b.rating||0)-(a.rating||0), "jamCharts":(a,b)=>(b.jamCharts||0)-(a.jamCharts||0), "reviews":(a,b)=>(b.reviews||0)-(a.reviews||0), "date-desc":(a,b)=>b.date.localeCompare(a.date), "date-asc":(a,b)=>a.date.localeCompare(b.date), "energy":(a,b)=>(b.energy||0)-(a.energy||0) };
    r.sort(sorters[sortBy] || sorters.rating);
    return r;
  }, [allShows, selectedEras, selectedVibes, selectedEnergyLevels, selectedStyles, selectedFeatures, yearRange, minRating, minJamCharts, minEnergy, songSearch, sortBy, aiDates]);

  const clearAll = () => { setSelectedEras([]); setSelectedVibes([]); setSelectedEnergyLevels([]); setSelectedStyles([]); setSelectedFeatures([]); setYearRange([1983,2026]); setMinRating(0); setMinJamCharts(0); setMinEnergy(0); setSongSearch(""); setAiDates(null); };
  const hasFilters = selectedEras.length || selectedVibes.length || selectedEnergyLevels.length || selectedStyles.length || selectedFeatures.length || yearRange[0]!==1983 || yearRange[1]!==2026 || minRating>0 || minJamCharts>0 || minEnergy>0 || songSearch || aiDates;

  const enrichPct = enrichTotal > 0 ? Math.round((enrichDone / enrichTotal) * 100) : 0;

  return (
    <div style={{ minHeight:"100vh" }}>
      <div style={{ padding:"24px 24px 0", maxWidth:1000, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Space Mono',monospace", fontSize:28, fontWeight:700, margin:0, background:"linear-gradient(135deg, #e8a849, #d4783a, #e8a849)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"glow 3s ease-in-out infinite" }}>THE HELPING PHRIENDLY BOOK</h1>
          <p style={{ color:"#b8a070", fontSize:15, marginTop:8, fontStyle:"italic", letterSpacing:0.5 }}>Step into the freezer and find a show</p>
          <p style={{ color:"#888", fontSize:12, marginTop:6 }}>{allShows.length} shows loaded · Powered by Phish.net API</p>
        </div>

        {/* Phase 1: Year loading progress */}
        {autoLoading && (
          <div style={{ marginBottom:16, padding:14, background:"#111122", border:"1px solid #1e1e30", borderRadius:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:20, height:20, border:"3px solid #e8a84933", borderTopColor:"#e8a849", borderRadius:"50%", flexShrink:0, animation:"spin 0.8s linear infinite" }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"#e8a849", fontWeight:600 }}>Loading all Phish shows from Phish.net...</div>
                <div style={{ fontSize:11, color:"#888", marginTop:2, animation:"pulse 1s infinite" }}>{loadProgress}</div>
              </div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:"#4ecdc4", whiteSpace:"nowrap" }}>{loadedYears.size} / {TOTAL_YEARS} yrs</div>
            </div>
            <div style={{ marginTop:10, height:4, background:"#1e1e30", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg, #e8a849, #d4783a)", borderRadius:2, transition:"width 0.3s", width:`${(loadedYears.size / TOTAL_YEARS) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Phase 2: Setlist enrichment (background, non-blocking) */}
        {!autoLoading && enriching && (
          <div style={{ marginBottom:16, padding:12, background:"#111122", border:"1px solid #1e1e30", borderRadius:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:14, height:14, border:"2px solid #4ecdc433", borderTopColor:"#4ecdc4", borderRadius:"50%", flexShrink:0, animation:"spin 0.8s linear infinite" }} />
              <div style={{ flex:1, fontSize:12, color:"#4ecdc4" }}>Loading setlists in background... {enrichDone}/{enrichTotal} shows</div>
              <div style={{ fontSize:11, color:"#888", whiteSpace:"nowrap" }}>{enrichPct}%</div>
            </div>
            <div style={{ marginTop:8, height:3, background:"#1e1e30", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg, #4ecdc4, #3b82f6)", borderRadius:2, transition:"width 0.3s", width:`${enrichPct}%` }} />
            </div>
          </div>
        )}

        {loadError && <div style={{ marginBottom:12, padding:10, borderRadius:8, background:"#ff444411", border:"1px solid #ff444433", color:"#ff4444", fontSize:12 }}>{loadError}</div>}

        {/* Filter Toggle */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ background:"none", border:"1px solid #333", color:"#999", padding:"6px 14px", borderRadius:8, fontSize:12, cursor:"pointer" }}>{showFilters ? "▾ Hide Filters" : "▸ Show Filters"}</button>
          {hasFilters && <button onClick={clearAll} style={{ background:"none", border:"1px solid #e8a84933", color:"#e8a849", padding:"6px 14px", borderRadius:8, fontSize:12, cursor:"pointer" }}>Clear All</button>}
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ background:"#111122", borderRadius:12, padding:20, marginBottom:20, border:"1px solid #1e1e30", animation:"fadeIn .3s" }}>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Era</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{ERAS.map(e => <Chip key={e.value} label={e.label} active={selectedEras.includes(e.value)} onClick={() => toggle(selectedEras, setSelectedEras, e.value)} />)}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Vibes</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{VIBES.map(v => <Chip key={v} label={v} active={selectedVibes.includes(v)} color={VC[v]} onClick={() => toggle(selectedVibes, setSelectedVibes, v)} />)}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Energy</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{ENERGY_LEVELS.map(e => <Chip key={e.value} label={e.label} active={selectedEnergyLevels.includes(e.value)} color={EC[e.value]} onClick={() => toggle(selectedEnergyLevels, setSelectedEnergyLevels, e.value)} />)}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Style</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{STYLES.map(s => <Chip key={s.value} label={s.label} active={selectedStyles.includes(s.value)} color={SC[s.value]} onClick={() => toggle(selectedStyles, setSelectedStyles, s.value)} />)}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Features</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{FEATURES_LIST.map(f => <Chip key={f.value} label={f.label} active={selectedFeatures.includes(f.value)} onClick={() => toggle(selectedFeatures, setSelectedFeatures, f.value)} />)}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:16, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Year: <span style={{ color:"#e8a849" }}>{yearRange[0]}-{yearRange[1]}</span></div>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="range" min={1983} max={2026} value={yearRange[0]} onChange={e => { setAiDates(null); setYearRange([Math.min(+e.target.value,yearRange[1]),yearRange[1]]); }} />
                  <input type="range" min={1983} max={2026} value={yearRange[1]} onChange={e => { setAiDates(null); setYearRange([yearRange[0],Math.max(+e.target.value,yearRange[0])]); }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Min Rating: <span style={{ color:"#4ecdc4" }}>{minRating > 0 ? minRating.toFixed(1) : "Any"}</span></div>
                <input type="range" min={0} max={5} step={0.1} value={minRating} onChange={e => { setAiDates(null); setMinRating(+e.target.value); }} />
              </div>
              <div>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Min Jam Charts: <span style={{ color:"#f59e0b" }}>{minJamCharts > 0 ? minJamCharts : "Any"}</span></div>
                <input type="range" min={0} max={8} step={1} value={minJamCharts} onChange={e => { setAiDates(null); setMinJamCharts(+e.target.value); }} />
              </div>
              <div>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Min Energy: <span style={{ color:"#ff4444" }}>{minEnergy > 0 ? "🔥".repeat(minEnergy) : "Any"}</span></div>
                <input type="range" min={0} max={5} step={1} value={minEnergy} onChange={e => { setAiDates(null); setMinEnergy(+e.target.value); }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"#888", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Search by Song</div>
              <input value={songSearch} onChange={e => { setAiDates(null); setSongSearch(e.target.value); }}
                placeholder="e.g. Tweezer, Ghost, Reba..." style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid #333", background:"#0d0d1a", color:"#eee", fontSize:13, outline:"none" }} />
            </div>
          </div>
        )}

        {/* AI Search — below filters so filters set context, then Claude refines */}
        <AiSearch
          shows={allShows}
          currentFilters={currentFilters}
          onResults={(dates) => { setAiDates(dates); setExpandedShow(null); }}
        />

        {/* Sort + Count */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div style={{ color:"#888", fontSize:13 }}>
            {aiDates
              ? <span><span style={{ color:"#e8a849" }}>Claude's Picks</span> · {filtered.length} show{filtered.length!==1?"s":""} <button onClick={() => setAiDates(null)} style={{ marginLeft:8, background:"none", border:"1px solid #444", color:"#888", padding:"2px 8px", borderRadius:6, fontSize:11, cursor:"pointer" }}>✕ clear</button></span>
              : <span><span style={{ color:"#e8a849", fontWeight:600 }}>{filtered.length}</span> show{filtered.length!==1?"s":""}</span>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:11, color:"#888", textTransform:"uppercase", letterSpacing:1 }}>Sort:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background:"#111122", color:"#eee", border:"1px solid #333", borderRadius:8, padding:"6px 12px", fontSize:13, outline:"none", cursor:"pointer" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        <div style={{ paddingBottom:40 }}>
          {!filtered.length ? (
            <div style={{ textAlign:"center", padding:60, color:"#666" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🎣</div>
              <div style={{ fontSize:16 }}>No shows match your filters</div>
              <div style={{ fontSize:13, marginTop:6 }}>Try widening your search or ask Claude</div>
            </div>
          ) : filtered.map(s => <ShowCard key={s.date} show={s} expanded={expandedShow===s.date} onToggle={() => setExpandedShow(expandedShow===s.date?null:s.date)} />)}
        </div>

        <div style={{ textAlign:"center", padding:"20px 0 40px", borderTop:"1px solid #1e1e30", color:"#444", fontSize:11 }}>
          Data from <a href="https://phish.net" target="_blank" rel="noopener noreferrer" style={{ color:"#666", textDecoration:"none" }}>Phish.net</a> · AI by Claude · Built for phans
        </div>
      </div>
    </div>
  );
}
