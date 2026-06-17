import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import ZoneModal from "../ZoneModal";

import "./FloorDrawing.css";
import "../ZonePositions.css";

// Configure PDFJS worker path locally in Vite to prevent CORS/CDN errors
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function FloorDrawing({
  pdf,
  zones = [],
  level,
  selectedRooms = [],
  onRoomsSelected,
}) {
  const [selectedZone, setSelectedZone] = useState(null);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);

  const containerRef = useRef(null);
  const [renderedWidth, setRenderedWidth] = useState(800);

  // Measure the width of the parent container to scale PDF page responsively
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const width = entries[0].contentRect.width;
      if (width > 0) {
        setRenderedWidth(width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="floor-drawing-console">

        {/* --- Left Panel: Drawing Viewer --- */}
        <div className="floor-drawing-viewer-card">
          <div className="floor-viewer-header">
            <h4>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
              Floor Plan Viewer
            </h4>
            {level && <span className="floor-viewer-badge">{level}</span>}
          </div>

          <div
            className="main-section"
            ref={containerRef}
            style={{
              position: "relative",
              overflow: "auto",
              background: "#151d30",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Wrapper matching exact size of rendered PDF page canvas */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <Document file={pdf} onLoadError={(err) => console.error("Main PDF Load error:", err)}>
                <Page
                  pageNumber={1}
                  width={renderedWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>

              {/* Render overlays relative to the PDF Page wrapper */}
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`zone-overlay ${zone.className} ${hoveredZoneId === zone.id ? "hovered" : ""
                    }`}
                  onClick={() => setSelectedZone(zone)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  title={`View Zone ${zone.name}`}
                >
                  <span className="zone-overlay-badge">{zone.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Right Panel: Zones Directory --- */}
        <div className="floor-drawing-sidebar-card">
          <div className="floor-sidebar-header">
            <h4>Zones Directory</h4>
            <p>Select a zone to allocate work rooms</p>
          </div>

          <div className="zones-list-container">
            {zones.map((zone) => {
              const roomsCount = zone.rooms ? zone.rooms.length : 0;
              return (
                <div
                  key={zone.id}
                  className={`zone-card ${hoveredZoneId === zone.id ? "hovered" : ""
                    }`}
                  onClick={() => setSelectedZone(zone)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                >
                  <div className="zone-card-top">
                    <span className="zone-card-name">{zone.name}</span>
                    <span className="zone-card-rooms-count">
                      {roomsCount} Room{roomsCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {zone.rooms && zone.rooms.length > 0 && (
                    <div className="zone-card-rooms-list">
                      {zone.rooms.slice(0, 4).map((room, idx) => {
                        const roomName = typeof room === "object" ? room.name : room;
                        return (
                          <span key={idx} className="zone-card-room-tag">
                            {roomName}
                          </span>
                        );
                      })}
                      {zone.rooms.length > 4 && (
                        <span className="zone-card-room-tag" style={{ background: "rgba(37,99,235,0.1)", color: "#3b82f6" }}>
                          +{zone.rooms.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {selectedZone && (
        <ZoneModal
          zone={selectedZone}
          selectedRooms={selectedRooms}
          onClose={() => setSelectedZone(null)}
          onConfirm={(rooms) => {
            if (onRoomsSelected) {
              onRoomsSelected(rooms, selectedZone);
            }
            setSelectedZone(null);
          }}
        />
      )}
    </>
  );
}

export default FloorDrawing;