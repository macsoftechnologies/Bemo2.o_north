import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDFJS worker path locally in Vite to prevent CORS/CDN errors
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function ZoneModal({
  zone,
  selectedRooms: globalSelectedRooms = [],
  onClose,
  onConfirm,
}) {
  const [selectedRooms, setSelectedRooms] = useState(() => {
    const zoneRoomNames = zone.rooms.map(r => typeof r === "object" ? r.name : r);
    return globalSelectedRooms.filter(r => zoneRoomNames.includes(r));
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [dimensions, setDimensions] = useState(null);
  const [renderedPageWidth, setRenderedPageWidth] = useState(600);
  const [modalStyle, setModalStyle] = useState({
    width: "95vw",
    height: "90vh",
    maxWidth: "1400px",
    maxHeight: "90vh",
  });

  const toggleRoom = (roomName) => {
    setSelectedRooms((prev) =>
      prev.includes(roomName)
        ? prev.filter((item) => item !== roomName)
        : [...prev, roomName]
    );
  };

  // Fallback helper to generate coordinates in grid layout if class is missing
  const getRoomPosition = (index, total) => {
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    const r = Math.floor(index / cols);
    const c = index % cols;

    const widthVal = 80 / cols;
    const heightVal = 60 / rows;
    const leftVal = 10 + c * (80 / cols);
    const topVal = 15 + r * (70 / rows);

    return {
      left: `${leftVal}%`,
      top: `${topVal}%`,
      width: `${widthVal}%`,
      height: `${heightVal}%`,
    };
  };

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onPageLoadSuccess = (page) => {
    const { originalWidth, originalHeight } = page;
    setDimensions({
      width: originalWidth,
      height: originalHeight,
    });
  };

  // Recalculate size dynamically on dimensions ready or window resize
  useEffect(() => {
    if (!dimensions) return;

    const calculateModalSize = () => {
      const maxWidth = window.innerWidth * 0.95;
      const maxHeight = window.innerHeight * 0.9;

      const reservedHeight = 150; // Header (65px) + Footer (70px) is ~135px
      const availableHeightForImage = Math.max(maxHeight - reservedHeight, 200);

      let imgWidth = dimensions.width;
      let imgHeight = dimensions.height;

      const imageRatio = dimensions.width / dimensions.height;

      // Fit inside viewport limits (leaving 350px space for the right sidebar directory)
      const maxPdfWidth = maxWidth - 350;

      if (imgWidth > maxPdfWidth) {
        imgWidth = maxPdfWidth;
        imgHeight = imgWidth / imageRatio;
      }
      if (imgHeight > availableHeightForImage) {
        imgHeight = availableHeightForImage;
        imgWidth = imgHeight * imageRatio;
      }

      const modalWidth = Math.min(imgWidth + 350, maxWidth);
      const modalHeight = Math.min(imgHeight + reservedHeight, maxHeight);

      setModalStyle({
        width: `${modalWidth}px`,
        height: `${modalHeight}px`,
        maxWidth: "95vw",
        maxHeight: "90vh",
      });

      setRenderedPageWidth(imgWidth);
    };

    calculateModalSize();
    window.addEventListener("resize", calculateModalSize);
    return () => window.removeEventListener("resize", calculateModalSize);
  }, [dimensions]);

  return ReactDOM.createPortal(
    <div
      className="zone-modal"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 20000000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="zone-modal-content"
        style={{
          ...modalStyle,
          backgroundColor: "#111827",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="zone-modal-header"
          style={{
            height: "65px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
            Zone {zone.name} - Select Rooms
          </h3>
          <button
            onClick={onClose}
            className="close-btn"
            style={{
              border: "none",
              background: "transparent",
              fontSize: "32px",
              cursor: "pointer",
              color: "#9ca3af",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Two-Column Content Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 350px",
            flex: 1,
            overflow: "hidden",
            background: "#151d30",
          }}
        >
          {/* Left Panel: PDF Viewer */}
          <div
            className="zone-pdf-container"
            style={{
              position: "relative",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#151d30",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Relative wrapper holding the rendered canvas and checkbox overlays together */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <Document file={zone.pdf} onLoadError={(err) => console.error("PDF Load error:", err)}>
                <Page
                  pageNumber={1}
                  width={renderedPageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                />
              </Document>

              {/* Render overlay checkboxes relative to the PDF Page wrapper */}
              {zone.rooms.map((room, index) => {
                const isObject = typeof room === "object";
                const roomName = isObject ? room.name : room;
                const hasClassName = isObject && !!room.className;
                const roomClass = isObject ? room.className : "";

                const position = hasClassName ? {} : getRoomPosition(index, zone.rooms.length);

                return (
                  <div
                    key={roomName}
                    className={`room-overlay ${roomClass} ${selectedRooms.includes(roomName) ? "selected" : ""
                      }`}
                    style={
                      hasClassName
                        ? {}
                        : {
                          top: position.top,
                          left: position.left,
                          width: position.width,
                          height: position.height,
                        }
                    }
                    onClick={() => toggleRoom(roomName)}
                    title={`Toggle ${roomName}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(roomName)}
                      onChange={() => { }} /* Click handled by parent div */
                      className="room-overlay-checkbox"
                    />
                    <span className="room-overlay-label">{roomName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Rooms Directory Sidebar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#111827",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <h4 style={{ margin: 0, color: "#fff", fontSize: "1.05rem", fontWeight: 700 }}>
                Rooms Directory
              </h4>
              <p style={{ margin: "4px 0 0 0", color: "#9ca3af", fontSize: "11px" }}>
                Select rooms to allocate permit work
              </p>
              <div style={{ marginTop: "12px", position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    paddingLeft: "32px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "#1f2937",
                    color: "#fff",
                    fontSize: "13px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: "13px",
                    pointerEvents: "none",
                  }}
                >
                  🔍
                </span>
              </div>
            </div>

            <div
              className="modal-room-list"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                overflowY: "auto",
                flex: 1,
                background: "#111827",
              }}
            >
              {zone.rooms
                .filter((room) => {
                  const roomName = typeof room === "object" ? room.name : room;
                  return roomName.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map((room) => {
                  const roomName = typeof room === "object" ? room.name : room;
                  const isSelected = selectedRooms.includes(roomName);
                return (
                  <label
                    key={roomName}
                    className={`room-item ${isSelected ? "checked" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      background: isSelected ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                      border: "1px solid",
                      borderColor: isSelected ? "#10b981" : "rgba(255, 255, 255, 0.06)",
                      color: isSelected ? "#4ade80" : "#fff",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      userSelect: "none",
                      margin: 0,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRoom(roomName)}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        accentColor: "#10b981",
                      }}
                    />
                    <span className="room-item-label" style={{ fontSize: "13px" }}>{roomName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="zone-modal-footer"
          style={{
            padding: "16px 24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "#111827",
            flexShrink: 0,
          }}
        >
          <button
            className="df-btn df-btn-secondary"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="df-btn df-btn-primary"
            onClick={() => onConfirm && onConfirm(selectedRooms)}
            style={{
              background: "#2563eb",
              border: "none",
              color: "#fff",
              padding: "8px 24px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ZoneModal;