import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages.css";

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const BUILDINGS = [
  { id: "B001", name: "Tower A — City Complex" },
  { id: "B002", name: "Tower B — City Complex" },
  { id: "B003", name: "Block 1 — Harbor View" },
];

const LEVELS = {
  B001: [{ id: "L001", name: "Ground Floor" }, { id: "L002", name: "Level 1" }, { id: "L003", name: "Level 2" }],
  B002: [{ id: "L004", name: "Ground Floor" }, { id: "L005", name: "Level 1" }],
  B003: [{ id: "L006", name: "Ground Floor" }, { id: "L007", name: "Level 1" }],
};

const FLOOR_ZONES = [
  { id: "Z_50_1A", label: "50.1A", x: 22,  y: 120, w: 88,  h: 62,  color: "#3b82f6", a: .28, desc: "Office Area A",     subZones: ["Workstation Block","Storage Corner","Entry Lobby","Print Station"] },
  { id: "Z_50_1B", label: "50.1B", x: 22,  y: 38,  w: 88,  h: 78,  color: "#06b6d4", a: .28, desc: "Meeting & Break",   subZones: ["Meeting Room","Break Room","Storage Area"] },
  { id: "Z_50_1C", label: "50.1C", x: 112, y: 38,  w: 175, h: 20,  color: "#94a3b8", a: .20, desc: "Main Corridor",     subZones: ["Corridor North","Corridor South"] },
  { id: "Z_50_1D", label: "50.1D", x: 112, y: 58,  w: 98,  h: 60,  color: "#8b5cf6", a: .30, desc: "Tech Lab",          subZones: ["Lab Section 1","Lab Section 2","Equipment Bay","Server Room"] },
  { id: "Z_50_1E", label: "50.1E", x: 212, y: 132, w: 72,  h: 52,  color: "#f59e0b", a: .28, desc: "Spray Dryer",       subZones: ["Spray Zone","Control Station"] },
  { id: "Z_50_1F", label: "50.1F", x: 212, y: 100, w: 72,  h: 30,  color: "#10b981", a: .28, desc: "Process Area F",    subZones: ["Sub-zone F1","Sub-zone F2","Utility Room"] },
  { id: "Z_50_1G", label: "50.1G", x: 286, y: 154, w: 108, h: 32,  color: "#a855f7", a: .28, desc: "Production G",      subZones: ["Line G1","Line G2","QC Station"] },
  { id: "Z_50_1H", label: "50.1H", x: 347, y: 38,  w: 90,  h: 58,  color: "#f97316", a: .28, desc: "Meeting Rooms H",   subZones: ["MR H1 (117m²)","MR H2","Ante Room"] },
  { id: "Z_50_1I", label: "50.1I", x: 522, y: 108, w: 90,  h: 80,  color: "#14b8a6", a: .28, desc: "Workshop",          subZones: ["Workshop Bay","Tool Store","Office Annex"] },
  { id: "Z_50_1J", label: "50.1J", x: 453, y: 108, w: 66,  h: 60,  color: "#fb923c", a: .28, desc: "Corridor & EL",     subZones: ["Elevator Lobby","Service Corridor"] },
  { id: "Z_50_1K", label: "50.1K", x: 357, y: 98,  w: 92,  h: 64,  color: "#ec4899", a: .28, desc: "Process Area K",    subZones: ["X-Pelt Unit","Wash Station","Tech Zone"] },
  { id: "Z_50_1L", label: "50.1L", x: 290, y: 98,  w: 54,  h: 48,  color: "#22d3ee", a: .28, desc: "Area L",            subZones: ["Sub-zone L1","Sub-zone L2"] },
  { id: "Z_60_1P", label: "60.1P", x: 522, y: 38,  w: 90,  h: 66,  color: "#60a5fa", a: .28, desc: "Ship Arrival",      subZones: ["Receiving Bay","Inspection Zone","Staging Area"] },
  { id: "Z_FS30",  label: "FS3.0", x: 22,  y: 228, w: 112, h: 202, color: "#f43f5e", a: .18, desc: "Frontstage 1",      subZones: ["Stage Zone A","Stage Zone B","Production Floor","Rigging Area"] },
  { id: "Z_BS31",  label: "BS3.1", x: 138, y: 228, w: 112, h: 202, color: "#2dd4bf", a: .18, desc: "Back Stage",        subZones: ["Backstage North","Backstage South","Storage Bay"] },
  { id: "Z_FS40",  label: "FS4.0", x: 254, y: 228, w: 112, h: 202, color: "#818cf8", a: .18, desc: "Frontstage 2",      subZones: ["FS4 Zone A","FS4 Zone B","Control Room","Loading Dock"] },
  { id: "Z_80_1A", label: "80.1A", x: 370, y: 316, w: 118, h: 114, color: "#f472b6", a: .22, desc: "Office Block 1A",   subZones: ["Office Suite 1","Meeting Room","Lounge","Print Room"] },
  { id: "Z_80_1B", label: "80.1B", x: 370, y: 238, w: 118, h: 74,  color: "#fbbf24", a: .22, desc: "Area 80.1B",        subZones: ["Ante Room","Lab Area","Store"] },
  { id: "Z_80_1C", label: "80.1C", x: 492, y: 298, w: 120, h: 52,  color: "#4ade80", a: .22, desc: "Office Annex 1C",   subZones: ["Office C1","Office C2","Reception"] },
  { id: "Z_80_1E", label: "80.1E", x: 532, y: 408, w: 80,  h: 30,  color: "#34d399", a: .28, desc: "Area 80.1E",        subZones: ["Unit E1","Unit E2"] },
];

const PERMIT_TYPES   = ["Hot Work", "Cold Work", "Confined Space", "Working at Height", "Electrical", "General"];
const ACTIVITY_TYPES = ["Construction", "Maintenance", "Inspection", "Installation", "Demolition"];

const STEPS = ["Building & Level", "Drawing & Zone", "Request Form"];

const EMPTY_FORM = {
  contractor: "", subContractor: "", foreman: "", foremanPhone: "",
  activity: "", activityType: "", ramsNumber: "", permitType: "",
  startDate: "", endDate: "", remarks: "",
};

/* ─── Helpers ─── */
function hexRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ─── Inline styles ─── */
const S = {
  page: { padding: "24px", minHeight: "100vh", color: "var(--text-main, #f9fafb)" },

  header: { marginBottom: "20px" },
  title: { fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: "var(--text-main, #f9fafb)" },
  subtitle: { fontSize: "13px", color: "var(--text-muted, #6b7280)", margin: 0 },

  // breadcrumb
  breadcrumb: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "20px", fontSize: "12px" },
  crumbDone:   { color: "#4ade80", fontWeight: 600 },
  crumbActive: { color: "#00e5a0", fontWeight: 700 },
  crumbIdle:   { color: "var(--text-muted, #6b7280)" },
  crumbSep:    { color: "var(--text-muted, #6b7280)" },

  // selector bar
  selectorBar: {
    display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #1f2937)",
    borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
  },
  selectorTitle: { fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted, #6b7280)" },
  divider: { width: "1px", height: "28px", background: "var(--border-color, #1f2937)" },
  selectorGroup: { display: "flex", flexDirection: "column", gap: "3px" },
  selectorLabel: { fontSize: "11px", color: "var(--text-muted, #6b7280)" },
  select: {
    background: "var(--bg-input, #1f2937)", border: "1px solid var(--border-color, #374151)",
    borderRadius: "6px", color: "var(--text-main, #f9fafb)", fontSize: "13px",
    padding: "5px 10px", outline: "none", cursor: "pointer", minWidth: "160px",
  },
  selectorActions: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" },

  // buttons
  btnPrimary: {
    background: "#00e5a0", color: "#0a1628", border: "none", borderRadius: "7px",
    padding: "7px 16px", fontWeight: 700, fontSize: "13px", cursor: "pointer",
  },
  btnGhost: {
    background: "transparent", color: "var(--text-muted, #6b7280)",
    border: "1px solid var(--border-color, #374151)", borderRadius: "7px",
    padding: "7px 14px", fontSize: "13px", cursor: "pointer",
  },
  btnCancel: {
    background: "transparent", color: "var(--text-muted, #6b7280)",
    border: "1px solid var(--border-color, #374151)", borderRadius: "7px",
    padding: "8px 18px", fontSize: "13px", cursor: "pointer",
  },
  btnSubmit: {
    background: "#00e5a0", color: "#0a1628", border: "none", borderRadius: "7px",
    padding: "8px 22px", fontWeight: 700, fontSize: "13px", cursor: "pointer",
  },

  // zone confirmed tag
  zoneTag: {
    fontSize: "12px", fontWeight: 600, color: "#4ade80",
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: "6px", padding: "4px 10px",
  },

  // empty state
  emptyState: { textAlign: "center", padding: "80px 20px" },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyText: { fontSize: "14px", color: "var(--text-muted, #6b7280)" },

  // zone banner
  zoneBanner: {
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
    background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.18)",
    borderRadius: "8px", padding: "10px 16px", marginBottom: "10px",
  },
  zoneBannerInfo: { display: "flex", flexDirection: "column", gap: "3px", fontSize: "13px" },
  zoneBannerActions: { display: "flex", gap: "8px" },

  // drawing card
  drawingCard: {
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #1f2937)",
    borderRadius: "12px", overflow: "hidden",
  },
  drawingCardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid var(--border-color, #1f2937)",
  },
  drawingCardTitle: { fontSize: "13px", fontWeight: 600, color: "var(--text-main, #f9fafb)", margin: 0 },
  drawingCardHint: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted, #6b7280)" },
  hintDot: { width: "7px", height: "7px", borderRadius: "50%", background: "#00e5a0", display: "inline-block" },
  drawingCanvas: { padding: "12px", height: "360px" },

  // modal
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px",
  },
  modal: {
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #1f2937)",
    borderRadius: "14px", width: "100%", maxWidth: "520px", maxHeight: "90vh",
    overflow: "hidden", display: "flex", flexDirection: "column",
  },
  modalHeader: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    padding: "16px 20px", borderBottom: "1px solid var(--border-color, #1f2937)",
  },
  modalTitle: { fontSize: "16px", fontWeight: 700, color: "var(--text-main, #f9fafb)", margin: "0 0 2px" },
  modalSub: { fontSize: "12px", color: "var(--text-muted, #6b7280)", margin: 0 },
  modalClose: {
    background: "none", border: "none", color: "var(--text-muted, #6b7280)",
    fontSize: "20px", cursor: "pointer", lineHeight: 1, padding: "2px 6px",
  },
  modalPreview: { padding: "12px 20px", height: "140px", borderBottom: "1px solid var(--border-color, #1f2937)" },
  modalPreviewLabel: { fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted, #6b7280)", display: "block", marginBottom: "6px" },
  modalBody: { padding: "16px 20px", overflowY: "auto", flex: 1 },
  modalSectionLabel: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted, #6b7280)", margin: 0 },
  modalError: { fontSize: "12px", color: "#f87171", marginTop: "10px" },
  modalFooter: {
    display: "flex", justifyContent: "flex-end", gap: "10px",
    padding: "14px 20px", borderTop: "1px solid var(--border-color, #1f2937)",
  },

  // subzone grid
  subzoneGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginTop: "10px" },
  subzoneItem: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "var(--bg-input, #1f2937)", border: "1px solid var(--border-color, #374151)",
    borderRadius: "7px", padding: "8px 12px", cursor: "pointer", fontSize: "13px",
    color: "var(--text-muted, #9ca3af)", transition: "all 0.15s",
  },
  subzoneItemSel: {
    background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.35)",
    color: "var(--text-main, #f9fafb)",
  },
  subzoneCheck: {
    width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0, fontSize: "10px",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #374151)",
  },
  subzoneCheckSel: { background: "#00e5a0", border: "1px solid #00e5a0", color: "#0a1628" },

  // form
  form: { marginTop: "20px" },
  formCard: {
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #1f2937)",
    borderRadius: "12px", padding: "24px", marginBottom: "16px",
  },
  sectionDivider: {
    fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px",
    textTransform: "uppercase", color: "var(--text-muted, #6b7280)",
    borderBottom: "1px solid var(--border-color, #1f2937)", paddingBottom: "10px", marginBottom: "16px",
  },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" },
  formFieldFull: { gridColumn: "1 / -1" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted, #9ca3af)", marginBottom: "5px" },
  required: { color: "#f87171", marginLeft: "2px" },
  input: {
    width: "100%", background: "var(--bg-input, #1f2937)", border: "1px solid var(--border-color, #374151)",
    borderRadius: "7px", color: "var(--text-main, #f9fafb)", fontSize: "13px",
    padding: "8px 12px", outline: "none", boxSizing: "border-box",
  },
  inputReadonly: { opacity: 0.55, cursor: "default" },
  textarea: {
    width: "100%", background: "var(--bg-input, #1f2937)", border: "1px solid var(--border-color, #374151)",
    borderRadius: "7px", color: "var(--text-main, #f9fafb)", fontSize: "13px",
    padding: "8px 12px", outline: "none", boxSizing: "border-box", resize: "vertical",
  },
  formFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" },

  // success
  successWrap: { textAlign: "center", padding: "40px 20px" },
  successIcon: {
    width: 64, height: 64, borderRadius: "50%",
    background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, margin: "0 auto 16px",
  },
  successTitle: { fontSize: "20px", fontWeight: 700, color: "var(--text-main, #f9fafb)", margin: "0 0 6px" },
  successSub: { fontSize: "13px", color: "var(--text-muted, #6b7280)", margin: "0 0 24px" },
  summaryTable: {
    background: "var(--bg-card, #111827)", border: "1px solid var(--border-color, #1f2937)",
    borderRadius: "10px", overflow: "hidden", maxWidth: "480px", margin: "0 auto 24px",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "9px 16px", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  summaryKey: { fontSize: "12px", color: "var(--text-muted, #6b7280)", flexShrink: 0 },
  summaryVal: { fontSize: "13px", fontWeight: 600, color: "var(--text-main, #f9fafb)", textAlign: "right" },
};

/* ─────────────────────────────────────────────────────────────────────────────
   SUB COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function Breadcrumb({ current }) {
  return (
    <div style={S.breadcrumb}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <span style={i < current ? S.crumbDone : i === current ? S.crumbActive : S.crumbIdle}>
            {i < current ? `✓ ${s}` : `${i + 1}. ${s}`}
          </span>
          {i < STEPS.length - 1 && <span style={S.crumbSep}>›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function FloorDrawing({ onZoneClick, selectedZoneId, interactive = true }) {
  const [hovered, setHovered] = useState(null);
  return (
    <svg viewBox="0 0 622 445" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="622" height="445" fill="#0a1628" />
      <defs>
        <pattern id="nr-grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M14 0L0 0 0 14" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="622" height="445" fill="url(#nr-grid)" />
      <rect x="14" y="28" width="600" height="172" rx="3" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="14" y="220" width="600" height="217" rx="3" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x="311" y="17" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.2)"
        fontFamily="sans-serif" letterSpacing="1.5">NORTH — GROUND FLOOR LAYOUT</text>

      {FLOOR_ZONES.map((z) => {
        const isHov = interactive && hovered === z.id;
        const isSel = selectedZoneId === z.id;
        const fillA = isSel ? 0.6 : isHov ? 0.48 : z.a;
        return (
          <g key={z.id}
            onClick={() => interactive && onZoneClick && onZoneClick(z)}
            onMouseEnter={() => interactive && setHovered(z.id)}
            onMouseLeave={() => interactive && setHovered(null)}
            style={{ cursor: interactive ? "pointer" : "default" }}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="3"
              fill={hexRgba(z.color, fillA)}
              stroke={isSel ? z.color : isHov ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)"}
              strokeWidth={isSel ? 1.5 : isHov ? 1 : 0.6} />
            <text x={z.x + z.w / 2} y={z.y + z.h / 2 - (z.h > 36 ? 7 : 0)}
              textAnchor="middle" dominantBaseline="central"
              fontSize={z.w < 52 ? "7" : z.w < 80 ? "8" : "9"} fontWeight="700"
              fill={isSel ? "#fff" : "rgba(255,255,255,0.85)"}
              fontFamily="sans-serif" pointerEvents="none" letterSpacing="0.2">{z.label}</text>
            {z.h > 36 && (
              <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 8}
                textAnchor="middle" dominantBaseline="central"
                fontSize="6.5" fill={isSel ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"}
                fontFamily="sans-serif" pointerEvents="none">
                {z.desc.length > 14 ? z.desc.slice(0, 13) + "…" : z.desc}
              </text>
            )}
          </g>
        );
      })}

      {selectedZoneId && (() => {
        const z = FLOOR_ZONES.find(z => z.id === selectedZoneId);
        if (!z) return null;
        return <rect x={z.x - 2} y={z.y - 2} width={z.w + 4} height={z.h + 4} rx="5"
          fill="none" stroke={z.color} strokeWidth="2" strokeDasharray="4 3" opacity="0.9" pointerEvents="none" />;
      })()}

      <g transform="translate(598,434)">
        <circle r="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <text textAnchor="middle" y="-1.5" fontSize="5.5" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">N</text>
        <line y1="-0.5" y2="-5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </g>
    </svg>
  );
}

function ZoneModal({ zone, onClose, onConfirm }) {
  const [selected, setSelected] = useState([]);
  const toggle    = (s) => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const allSel    = selected.length === zone.subZones.length;
  const toggleAll = () => setSelected(allSel ? [] : [...zone.subZones]);

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        {/* Header */}
        <div style={S.modalHeader}>
          <div>
            <p style={S.modalTitle}>Zone {zone.label}</p>
            <p style={S.modalSub}>{zone.desc} — choose sub-zones for the work permit</p>
          </div>
          <button style={S.modalClose} onClick={onClose}>×</button>
        </div>

        {/* Preview */}
        <div style={S.modalPreview}>
          <span style={S.modalPreviewLabel}>Floor Plan Preview</span>
          <FloorDrawing selectedZoneId={zone.id} interactive={false} />
        </div>

        {/* Body */}
        <div style={S.modalBody}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={S.modalSectionLabel}>Select Sub-Zones</p>
            <button onClick={toggleAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#00e5a0", fontWeight: 600, padding: 0 }}>
              {allSel ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div style={S.subzoneGrid}>
            {zone.subZones.map(s => {
              const isSel = selected.includes(s);
              return (
                <div key={s}
                  style={{ ...S.subzoneItem, ...(isSel ? S.subzoneItemSel : {}) }}
                  onClick={() => toggle(s)}>
                  <div style={{ ...S.subzoneCheck, ...(isSel ? S.subzoneCheckSel : {}) }}>
                    {isSel ? "✓" : ""}
                  </div>
                  <span style={{ fontSize: 13 }}>{s}</span>
                </div>
              );
            })}
          </div>

          {selected.length === 0 && (
            <p style={S.modalError}>⚠ Select at least one sub-zone to continue.</p>
          )}
        </div>

        {/* Footer */}
        <div style={S.modalFooter}>
          <button style={S.btnCancel} onClick={onClose}>Cancel</button>
          <button style={{ ...S.btnSubmit, opacity: selected.length === 0 ? 0.4 : 1 }}
            onClick={() => { if (selected.length) onConfirm({ zone, subZones: selected }); }}
            disabled={selected.length === 0}>
            Confirm {selected.length > 0 ? `(${selected.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function NewRequest() {
  const navigate = useNavigate();

  // Step state: "zone" | "form" | "done"
  const [step, setStep] = useState("zone");

  // Zone selection state
  const [building, setBuilding] = useState("");
  const [level,    setLevel]    = useState("");
  const [modal,    setModal]    = useState(null);
  const [zoneCtx,  setZoneCtx]  = useState(null);

  // Form state
  const [f, setF] = useState(EMPTY_FORM);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const selBuilding = BUILDINGS.find(b => b.id === building);
  const selLevel    = (LEVELS[building] || []).find(l => l.id === level);
  const ready       = !!building && !!level;

  const handleZoneConfirm = ({ zone, subZones }) => {
    setZoneCtx({ zone, subZones });
    setModal(null);
  };

  const handleProceed = () => setStep("form");
  const handleBack    = () => setStep("zone");
  const handleSubmit  = (e) => { e.preventDefault(); setStep("done"); };
  const handleReset   = () => { setStep("zone"); setBuilding(""); setLevel(""); setZoneCtx(null); setF(EMPTY_FORM); };

  /* ── Step indicator ── */
  const stepIndex = step === "zone" ? (zoneCtx ? 1 : 0) : step === "form" ? 2 : 2;

  /* ════════════════════════════════════════════════
     STEP: DONE — Success screen
  ════════════════════════════════════════════════ */
  if (step === "done") {
    const rows = [
      ["Building",    selBuilding?.name || "—"],
      ["Level",       selLevel?.name    || "—"],
      ["Zone",        zoneCtx ? `${zoneCtx.zone.label} — ${zoneCtx.zone.desc}` : "—"],
      ["Sub-zones",   zoneCtx?.subZones.join(", ") || "—"],
      ["Contractor",  f.contractor],
      ["Permit Type", f.permitType],
      ["Activity",    f.activity],
      ["Start Date",  f.startDate],
      ["End Date",    f.endDate],
    ];
    return (
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.title}>New Work Permit</h1>
          <p style={S.subtitle}>Submitted successfully</p>
        </div>
        <Breadcrumb current={2} />
        <div style={S.successWrap}>
          <div style={S.successIcon}>✓</div>
          <p style={S.successTitle}>Request Submitted</p>
          <p style={S.successSub}>Your work permit has been sent for review.</p>
          <div style={S.summaryTable}>
            {rows.map(([k, v]) => (
              <div key={k} style={S.summaryRow}>
                <span style={S.summaryKey}>{k}</span>
                <span style={S.summaryVal}>{v || "—"}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button style={S.btnCancel} onClick={() => navigate("/dashboard")}>← Dashboard</button>
            <button style={S.btnSubmit} onClick={handleReset}>+ New Request</button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     STEP: FORM
  ════════════════════════════════════════════════ */
  if (step === "form") {
    return (
      <div style={S.page}>
        <div style={S.header}>
          <h1 style={S.title}>New Work Permit</h1>
          <p style={S.subtitle}>Fill in the request details below</p>
        </div>
        <Breadcrumb current={2} />

        <form onSubmit={handleSubmit} noValidate>

          {/* Location (read-only) */}
          <div style={S.formCard}>
            <div style={S.sectionDivider}>Location</div>
            <div style={S.formGrid}>
              <div>
                <label style={S.label}>Building</label>
                <input style={{ ...S.input, ...S.inputReadonly }} value={selBuilding?.name || "—"} readOnly />
              </div>
              <div>
                <label style={S.label}>Level</label>
                <input style={{ ...S.input, ...S.inputReadonly }} value={selLevel?.name || "—"} readOnly />
              </div>
              <div>
                <label style={S.label}>Zone</label>
                <input style={{ ...S.input, ...S.inputReadonly }} value={zoneCtx ? `${zoneCtx.zone.label} — ${zoneCtx.zone.desc}` : "—"} readOnly />
              </div>
              <div>
                <label style={S.label}>Sub-zones</label>
                <input style={{ ...S.input, ...S.inputReadonly }} value={zoneCtx?.subZones.join(", ") || "—"} readOnly />
              </div>
            </div>
          </div>

          {/* Contractor */}
          <div style={S.formCard}>
            <div style={S.sectionDivider}>Contractor Information</div>
            <div style={S.formGrid}>
              <div>
                <label style={S.label}>Contractor <span style={S.required}>*</span></label>
                <input style={S.input} value={f.contractor} onChange={e => set("contractor", e.target.value)} placeholder="e.g. Alpha Build Co." required />
              </div>
              <div>
                <label style={S.label}>Sub Contractor</label>
                <input style={S.input} value={f.subContractor} onChange={e => set("subContractor", e.target.value)} placeholder="e.g. Beta Services Ltd." />
              </div>
              <div>
                <label style={S.label}>Foreman / Supervisor <span style={S.required}>*</span></label>
                <input style={S.input} value={f.foreman} onChange={e => set("foreman", e.target.value)} placeholder="Full name" required />
              </div>
              <div>
                <label style={S.label}>Foreman Phone <span style={S.required}>*</span></label>
                <input style={S.input} type="tel" value={f.foremanPhone} onChange={e => set("foremanPhone", e.target.value)} placeholder="+60 12-345 6789" required />
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div style={S.formCard}>
            <div style={S.sectionDivider}>Work Details</div>
            <div style={S.formGrid}>
              <div>
                <label style={S.label}>Activity <span style={S.required}>*</span></label>
                <input style={S.input} value={f.activity} onChange={e => set("activity", e.target.value)} placeholder="Describe the work activity" required />
              </div>
              <div>
                <label style={S.label}>Type of Activity <span style={S.required}>*</span></label>
                <select style={S.select} value={f.activityType} onChange={e => set("activityType", e.target.value)} required>
                  <option value="">Select Type</option>
                  {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>RAMS Number</label>
                <input style={S.input} value={f.ramsNumber} onChange={e => set("ramsNumber", e.target.value)} placeholder="e.g. RAMS-2024-001" />
              </div>
              <div>
                <label style={S.label}>Permit Type <span style={S.required}>*</span></label>
                <select style={S.select} value={f.permitType} onChange={e => set("permitType", e.target.value)} required>
                  <option value="">Select Permit</option>
                  {PERMIT_TYPES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div style={S.formCard}>
            <div style={S.sectionDivider}>Schedule</div>
            <div style={S.formGrid}>
              <div>
                <label style={S.label}>Start Date <span style={S.required}>*</span></label>
                <input style={S.input} type="date" value={f.startDate} onChange={e => set("startDate", e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>End Date <span style={S.required}>*</span></label>
                <input style={S.input} type="date" value={f.endDate} onChange={e => set("endDate", e.target.value)} required />
              </div>
              <div style={S.formFieldFull}>
                <label style={S.label}>Remarks</label>
                <textarea style={S.textarea} value={f.remarks} onChange={e => set("remarks", e.target.value)}
                  placeholder="Additional notes or special instructions…" rows={4} />
              </div>
            </div>
          </div>

          <div style={S.formFooter}>
            <button type="button" style={S.btnCancel} onClick={handleBack}>← Back</button>
            <button type="submit" style={S.btnSubmit}>Submit Request</button>
          </div>
        </form>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     STEP: ZONE SELECTION (default)
  ════════════════════════════════════════════════ */
  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>New Work Permit</h1>
        <p style={S.subtitle}>Select a building, level and zone to begin</p>
      </div>

      <Breadcrumb current={stepIndex} />

      {/* Selector bar */}
      <div style={S.selectorBar}>
        <span style={S.selectorTitle}>Location</span>
        <div style={S.divider} />

        <div style={S.selectorGroup}>
          <label style={S.selectorLabel}>Building</label>
          <select style={S.select} value={building} onChange={e => { setBuilding(e.target.value); setLevel(""); setZoneCtx(null); }}>
            <option value="">Select Building</option>
            {BUILDINGS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div style={S.selectorGroup}>
          <label style={S.selectorLabel}>Level</label>
          <select style={S.select} value={level} onChange={e => { setLevel(e.target.value); setZoneCtx(null); }} disabled={!building}>
            <option value="">Select Level</option>
            {(LEVELS[building] || []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        <div style={S.selectorActions}>
          {zoneCtx && (
            <>
              <span style={S.zoneTag}>✓ Zone {zoneCtx.zone.label} · {zoneCtx.subZones.length} sub-zone{zoneCtx.subZones.length > 1 ? "s" : ""}</span>
              <button style={S.btnPrimary} onClick={handleProceed}>Proceed to Form →</button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      {!ready ? (
        <div style={S.emptyState}>
          <div style={S.emptyIcon}>🏗</div>
          <p style={S.emptyText}>Select a Building and Level above to load the floor plan.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {zoneCtx && (
            <div style={S.zoneBanner}>
              <div style={S.zoneBannerInfo}>
                <span><strong>Zone:</strong> {zoneCtx.zone.label} — {zoneCtx.zone.desc}</span>
                <span><strong>Sub-zones:</strong> {zoneCtx.subZones.join(", ")}</span>
              </div>
              <div style={S.zoneBannerActions}>
                <button style={S.btnGhost} onClick={() => setZoneCtx(null)}>Change</button>
                <button style={S.btnPrimary} onClick={handleProceed}>Continue →</button>
              </div>
            </div>
          )}

          <div style={S.drawingCard}>
            <div style={S.drawingCardHeader}>
              <p style={S.drawingCardTitle}>Ground Floor Drawing</p>
              <div style={S.drawingCardHint}>
                <span style={S.hintDot} />
                Click any coloured zone to select it
                {zoneCtx && <span style={{ color: "#4ade80", marginLeft: 6 }}>· Zone {zoneCtx.zone.label} selected</span>}
              </div>
            </div>
            <div style={S.drawingCanvas}>
              <FloorDrawing onZoneClick={setModal} selectedZoneId={zoneCtx?.zone?.id || null} interactive />
            </div>
          </div>
        </div>
      )}

      {modal && <ZoneModal zone={modal} onClose={() => setModal(null)} onConfirm={handleZoneConfirm} />}
    </div>
  );
}