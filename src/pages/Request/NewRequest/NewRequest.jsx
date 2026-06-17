import React, { useMemo, useState, useRef } from "react";
import "../../styles/pages.css";
import "../../../forms/styles/forms.css";
import "./NewRequest.css";

import FloorDrawing from "../FloorDrawing/FloorDrawing";

import { BUILDINGS } from "../../../data/buildings";
import { FLOOR_MAPPING } from "../../../data/floors";
import { FLOOR_PDFS } from "../../../data/pdfMapping";
import { ZONE_MAPPING } from "../../../data/zones";

// Mock data lists
const SUB_CONTRACTORS = [
  { id: "S1", name: "Alpha Construction Ltd" },
  { id: "S2", name: "Beta Mechanical Systems" },
  { id: "S3", name: "Delta Electrical Corp" },
  { id: "S4", name: "Omega Fire & Safety" },
];

const ACTIVITY_TYPES = [
  { id: "A1", name: "Cable Pulling" },
  { id: "A2", name: "Equipment Installation" },
  { id: "A3", name: "Welding / Hotwork" },
  { id: "A4", name: "Pressure Testing" },
  { id: "A5", name: "General Maintenance" },
];

const ELECTRICAL_WORKS = [
  {
    module: "Module 1 - Distribution Boards",
    items: [
      { id: "E1", name: "DB-01 installation" },
      { id: "E2", name: "DB-02 wiring" }
    ]
  },
  {
    module: "Module 2 - Lighting & Power",
    items: [
      { id: "E3", name: "Lighting circuit installation" },
      { id: "E4", name: "Socket outlet installation" }
    ]
  }
];

const MECHANICAL_WORKS = [
  { id: "M1", name: "Piping installation" },
  { id: "M2", name: "Ductwork installation" },
  { id: "M3", name: "Equipment alignment" },
  { id: "M4", name: "Valves installation" }
];

function NewRequest() {
  const [building, setBuilding] = useState("");
  const [level, setLevel] = useState("");
  const [isnewrequestcreated, setIsnewrequestcreated] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({ name: f.name }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const [formData, setFormData] = useState({
    Requestdate: new Date().toLocaleDateString("en-GB"),
    Companyname: "M3 North",
    SubContractor: "",
    newSubContractor: "",
    Foreman: "",
    ForemanPhone: "",
    Activity: "",
    TypeActivity: "",
    RAMSNumber: "",
    permit_type: "Construction",
    descriptActivity: "",
    Startdate: "",
    StartTime: "",
    EndTime: "",
    night_shift: false,
    newWorkDate: "",
    new_end_time: "",
    Site: "M3 North",
    Tools: "",
    Machinery: "",
    work_type: "",
    electrical_works: [],
    mechanical_works: [],
    // General Safety Questions (Yes=1, No=0, N/A=2)
    floatLabel11: "",
    floatLabel12: "",
    other_conditions_input: "",
    floatLabel13: "",
    floatLabel14: "",
    floatLabel15: "",
    floatLabel16: "",
    // Hot Work Section
    HOTWORK: "0",
    floatLabel1: "",
    floatLabel3: "",
    floatLabel4: "",
    floatLabel5: "",
    floatLabel6: "",
    floatLabel7: "",
    floatLabel8: "",
    floatLabel9: "",
    floatLabel10: "",
    NEWHOTWORK: "0",
    NEWHOTWORK1: "",
    NEWHOTWORK2: "",
    // Temporary Electrical Systems
    electricalSystem: "0",
    floatLabel17: "",
    floatLabel18: "",
    floatLabel19: "",
    floatLabel20: "",
    floatLabel22: "",
    // Hazardous Substances
    HAZARDOUS: "0",
    floatLabel24: "",
    floatLabel25: "",
    floatLabel26: "",
    floatLabel27: "",
    floatLabel28: "",
    floatLabel29: "",
    floatLabel30: "",
    floatLabel31: "",
    // Working at Height
    workingAtHeight: "0",
    segragated_demarkated: "",
    floatLabel39: "",
    floatLabel40: "",
    floatLabel41: "",
    floatLabel42: "",
    floatLabel43: "",
    floatLabel44: "",
    floatLabel45: "",
    floatLabel46: "",
    floatLabel47: "",
    floatLabel48: "",
    floatLabel49: "",
    floatLabel50: "",
    // Working in Confined Spaces
    confinedSpaces: "0",
    floatLabel51: "",
    floatLabel52: "",
    floatLabel53: "",
    floatLabel54: "",
    floatLabel55: "",
    floatLabel56: "",
    floatLabel57: "",
    floatLabel58: "",
    // Excavation Works
    excavationWorks: "0",
    floatLabel71: "",
    floatLabel72: "",
    excavation_shoring: "",
    floatLabel74: "",
    floatLabel75: "",
    floatLabel76: "",
    floatLabel77: "",
    floatLabel78: "",
    floatLabel79: "",
    // Using Crane or Lifting
    craneLifting: "0",
    floatLabel80: "",
    floatLabel81: "",
    floatLabel82: "",
    floatLabel83: "",
    floatLabel84: "",
    floatLabel85: "",
    floatLabel86: "",
    floatLabel87: "",
    // Pressure Testing
    TESTINGs: "0",
    floatLabel102: "",
    floatLabel103: "",
    floatLabel104: "",
    floatLabel105: "",
    floatLabel106: "",
    floatLabel107: "",
    pressure_pneumatic: "",
    floatLabel108: "",
    pressure_hydrostatic: "",
    floatLabel109: "",
    // Task Specific PPE
    eye_protection: "",
    fall_protection: "",
    hearing_protection: "",
    respiratory_protection: "",
    other_ppe: "",
    peopleinvalidcount: "",
    notes: "",
  });

  const levels = building ? FLOOR_MAPPING[building] || [] : [];

  const selectedPdf = useMemo(() => {
    return FLOOR_PDFS[building]?.[level] || "";
  }, [building, level]);

  const selectedZones = useMemo(() => {
    return ZONE_MAPPING[level] || [];
  }, [level]);

  const zonesToDisplay = useMemo(() => {
    // Find all zones that have at least one room selected
    const active = selectedZones.filter(zone =>
      zone.rooms.some(room => {
        const roomName = typeof room === "object" ? room.name : room;
        return selectedRooms.includes(roomName);
      })
    );

    // If active is empty but we have a selectedZone, make sure selectedZone is shown
    if (active.length === 0 && selectedZone) {
      const current = selectedZones.find(z => z.id === selectedZone.id || z.name === selectedZone.name);
      return current ? [current] : [selectedZone];
    }

    return active;
  }, [selectedZones, selectedRooms, selectedZone]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoomsSelected = (rooms, zone) => {
    const zoneRoomNames = zone.rooms.map(r => typeof r === "object" ? r.name : r);
    setSelectedRooms(prev => {
      const filtered = prev.filter(r => !zoneRoomNames.includes(r));
      return [...filtered, ...rooms];
    });
    setSelectedZone(zone);
  };

  const selectedBuildingName = useMemo(() => {
    const b = BUILDINGS.find((x) => x.id === building);
    return b ? b.name : "";
  }, [building]);

  const handleSubmit = (e, status) => {
    e.preventDefault();
    alert(`Work Permit Request saved as [${status}] successfully (Simulation)!`);
    setIsnewrequestcreated(false);
    setBuilding("");
    setLevel("");
    setSelectedRooms([]);
    setSelectedZone(null);
  };

  const toggleRoomSelection = (roomName) => {
    setSelectedRooms(prev =>
      prev.includes(roomName)
        ? prev.filter(r => r !== roomName)
        : [...prev, roomName]
    );
  };

  if (isnewrequestcreated) {
    return (
      <div className="dept-page">
        <div className="dept-page-header">
          <div className="dept-page-header__left">
            <h1 className="dept-page-title">New Work Permit Request Form</h1>
          </div>
          <div className="butns-grp-back">
            <button
              type="button"
              className="nr-btn nr-btn--ghost"
              onClick={() => setIsnewrequestcreated(false)}
            >
              Back to Drawing
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="df-form premium-form-container">
          {/* Main Form Section */}
          <div className="form-card">
            <h2 className="form-card-title">General Information</h2>
            <div className="df-grid">
              <div className="df-field">
                <label className="df-label">Request Date</label>
                <input
                  type="text"
                  className="df-input df-readonly"
                  value={formData.Requestdate}
                  readOnly
                />
              </div>
              <div className="df-field">
                <label className="df-label">Project Name</label>
                <input
                  type="text"
                  className="df-input df-readonly"
                  value={formData.Companyname}
                  readOnly
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Contractor</label>
                <select
                  className="df-select"
                  value={formData.SubContractor}
                  onChange={(e) => handleFieldChange("SubContractor", e.target.value)}
                >
                  <option value="">Select Contractor</option>
                  {SUB_CONTRACTORS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="df-field">
                <label className="df-label">Sub Contractor</label>
                <input
                  type="text"
                  className="df-input"
                  placeholder="Enter Sub Contractor Name"
                  value={formData.newSubContractor}
                  onChange={(e) => handleFieldChange("newSubContractor", e.target.value)}
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Permit Type</label>
                <select
                  className="df-select"
                  value={formData.permit_type}
                  onChange={(e) => handleFieldChange("permit_type", e.target.value)}
                >
                  <option value="Construction">Construction</option>
                  <option value="Commissioning">Commissioning</option>
                </select>
              </div>
              <div className="df-field">
                <label className="df-label">Foreman-Supervisor</label>
                <input
                  type="text"
                  className="df-input"
                  placeholder="Enter Foreman Supervisor Name"
                  value={formData.Foreman}
                  onChange={(e) => handleFieldChange("Foreman", e.target.value)}
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Foreman Phone</label>
                <input
                  type="text"
                  className="df-input"
                  placeholder="Enter Foreman Phone"
                  value={formData.ForemanPhone}
                  onChange={(e) => handleFieldChange("ForemanPhone", e.target.value)}
                />
              </div>
              <div className="df-field">
                <label className="df-label">Activity</label>
                <input
                  type="text"
                  className="df-input"
                  placeholder="Enter Activity"
                  value={formData.Activity}
                  onChange={(e) => handleFieldChange("Activity", e.target.value)}
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Type of Activity</label>
                <select
                  className="df-select"
                  value={formData.TypeActivity}
                  onChange={(e) => handleFieldChange("TypeActivity", e.target.value)}
                >
                  <option value="">Select Activity Type</option>
                  {ACTIVITY_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="df-field">
                <label className="df-label">RAMS Number</label>
                <input
                  type="text"
                  className="df-input"
                  placeholder="Enter RAMS Number"
                  value={formData.RAMSNumber}
                  onChange={(e) => handleFieldChange("RAMSNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="df-field" style={{ marginTop: "16px" }}>
              <label className="df-label">Description of Activity</label>
              <textarea
                className="df-textarea"
                rows={3}
                placeholder="Enter Description of Activity"
                value={formData.descriptActivity}
                onChange={(e) => handleFieldChange("descriptActivity", e.target.value)}
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="form-card">
            <h2 className="form-card-title">Schedule & Location</h2>
            <div className="df-grid">
              <div className="df-field">
                <label className="df-label">Date</label>
                <input
                  type="date"
                  className="df-input"
                  value={formData.Startdate}
                  onChange={(e) => handleFieldChange("Startdate", e.target.value)}
                />
              </div>
              <div className="df-field">
                <label className="df-label">Start Time</label>
                <input
                  type="time"
                  className="df-input"
                  value={formData.StartTime}
                  onChange={(e) => handleFieldChange("StartTime", e.target.value)}
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">End Time</label>
                <input
                  type="time"
                  className="df-input"
                  value={formData.EndTime}
                  onChange={(e) => handleFieldChange("EndTime", e.target.value)}
                />
              </div>
              <div className="df-field night-shift-field" style={{ display: "flex", alignItems: "center" }}>
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={formData.night_shift}
                    onChange={(e) => handleFieldChange("night_shift", e.target.checked)}
                  />
                  <span className="checkbox-label">Is this a night shift?</span>
                </label>
              </div>
            </div>

            {formData.night_shift && (
              <div className="df-grid night-shift-subform" style={{ marginTop: "16px" }}>
                <div className="df-field">
                  <label className="df-label">New Date (Night Shift)</label>
                  <input
                    type="date"
                    className="df-input"
                    value={formData.newWorkDate}
                    onChange={(e) => handleFieldChange("newWorkDate", e.target.value)}
                  />
                </div>
                <div className="df-field">
                  <label className="df-label">New End Time (Night Shift)</label>
                  <input
                    type="time"
                    className="df-input"
                    value={formData.new_end_time}
                    onChange={(e) => handleFieldChange("new_end_time", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Site</label>
                <input
                  type="text"
                  className="df-input df-readonly"
                  value={formData.Site}
                  readOnly
                />
              </div>
              <div className="df-field">
                <label className="df-label">Building</label>
                <input
                  type="text"
                  className="df-input df-readonly"
                  value={selectedBuildingName}
                  readOnly
                />
              </div>
            </div>

            <div className="df-grid" style={{ marginTop: "16px" }}>
              <div className="df-field">
                <label className="df-label">Level</label>
                <input
                  type="text"
                  className="df-input df-readonly"
                  value={level}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Selected Area / Rooms Card */}
          <div className="form-card" style={{ position: "relative" }}>
            <h2 className="form-card-title">Selected Area / Rooms</h2>

            <div className="df-field">
              <label className="df-label">Rooms Selection</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="df-input"
                  style={{ cursor: "pointer", background: "rgba(255, 255, 255, 0.02)" }}
                  placeholder="Click to select rooms..."
                  value={selectedRooms.length > 0 ? selectedRooms.join(", ") : ""}
                  readOnly
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", fontSize: "10px" }}>
                  ▼
                </span>
              </div>
            </div>

            {isDropdownOpen && zonesToDisplay.length > 0 && (
              <div className="zone-rooms-dropdown" style={{ background: "#111827", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", padding: "16px", marginTop: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)", zIndex: 100 }}>
                {zonesToDisplay.map((zoneToDraw) => (
                  <div key={zoneToDraw.name} style={{ marginBottom: "20px" }}>
                    <div style={{ fontWeight: "bold", color: "#00e5a0", marginBottom: "12px", fontSize: "14px" }}>
                      Zone {zoneToDraw.name}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "8px" }}>
                      {zoneToDraw.rooms.map((room) => {
                        const roomName = typeof room === "object" ? room.name : room;
                        const isChecked = selectedRooms.includes(roomName);
                        return (
                          <label key={roomName} className="custom-checkbox-label" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input
                              type="checkbox"
                              className="custom-checkbox-input"
                              checked={isChecked}
                              onChange={() => toggleRoomSelection(roomName)}
                            />
                            <span>{roomName}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tools & Equipment */}
          <div className="form-card">
            <h2 className="form-card-title">Tools & Machinery</h2>
            <div className="df-grid">
              <div className="df-field">
                <label className="df-label">Tools Used</label>
                <textarea
                  className="df-textarea"
                  rows={2}
                  placeholder="Enter tools to be used..."
                  value={formData.Tools}
                  onChange={(e) => handleFieldChange("Tools", e.target.value)}
                />
              </div>
              <div className="df-field">
                <label className="df-label">Machinery Used</label>
                <textarea
                  className="df-textarea"
                  rows={2}
                  placeholder="Enter machinery to be used..."
                  value={formData.Machinery}
                  onChange={(e) => handleFieldChange("Machinery", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="form-card">
            <h2 className="form-card-title">Attachments</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }}>
              <div>
                <button
                  type="button"
                  className="logo-btn-sty"
                  onClick={triggerFileInput}
                >
                  Add Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  multiple
                />
              </div>
              <div className="file-list-container">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="file-remove-btn"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {uploadedFiles.length === 0 && (
                  <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "13px" }}>No files uploaded yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Type of Work - ONLY shown if permit_type is Commissioning */}
          {formData.permit_type === "Commissioning" && (
            <div className="form-card">
              <h2 className="form-card-title">Type of Work</h2>
              <div className="df-grid">
                <div className="df-field">
                  <label className="df-label">Type of Work</label>
                  <select
                    className="df-select"
                    value={formData.work_type}
                    onChange={(e) => handleFieldChange("work_type", e.target.value)}
                  >
                    <option value="">Select Type of Work</option>
                    <option value="Electrical Works">Electrical Works</option>
                    <option value="Mechanical Works">Mechanical Works</option>
                  </select>
                </div>

                {formData.work_type === "Electrical Works" && (
                  <div className="df-field">
                    <label className="df-label">Electrical Works</label>
                    <select
                      multiple
                      className="df-select df-select-multiple"
                      value={formData.electrical_works}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, (option) => option.value);
                        handleFieldChange("electrical_works", values);
                      }}
                    >
                      {ELECTRICAL_WORKS.map((g) => (
                        <optgroup key={g.module} label={g.module}>
                          {g.items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}

                {formData.work_type === "Mechanical Works" && (
                  <div className="df-field">
                    <label className="df-label">Mechanical Works</label>
                    <select
                      multiple
                      className="df-select df-select-multiple"
                      value={formData.mechanical_works}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, (option) => option.value);
                        handleFieldChange("mechanical_works", values);
                      }}
                    >
                      {MECHANICAL_WORKS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* General Safety Checklist */}
          <div className="form-card">
            <h2 className="form-card-title">General Safety Checklist</h2>

            <div className="checklist-item">
              <p className="checklist-question">
                1. Can you confirm that your work not affecting with other contractors working in this area before starting the work?
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel11" value="1" checked={formData.floatLabel11 === "1"} onChange={(e) => handleFieldChange("floatLabel11", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel11" value="0" checked={formData.floatLabel11 === "0"} onChange={(e) => handleFieldChange("floatLabel11", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel11" value="2" checked={formData.floatLabel11 === "2"} onChange={(e) => handleFieldChange("floatLabel11", e.target.value)} /> N/A</label>
              </div>
            </div>

            <div className="checklist-item">
              <p className="checklist-question">
                2. Are there other conditions that must be taken into account during the work? If Yes, note in 'Other conditions'
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel12" value="1" checked={formData.floatLabel12 === "1"} onChange={(e) => handleFieldChange("floatLabel12", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel12" value="0" checked={formData.floatLabel12 === "0"} onChange={(e) => handleFieldChange("floatLabel12", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel12" value="2" checked={formData.floatLabel12 === "2"} onChange={(e) => handleFieldChange("floatLabel12", e.target.value)} /> N/A</label>
              </div>
              {formData.floatLabel12 === "1" && (
                <div className="df-field" style={{ marginTop: "8px" }}>
                  <label className="df-label">Note the Other Condition</label>
                  <input
                    type="text"
                    className="df-input"
                    placeholder="Enter other conditions..."
                    value={formData.other_conditions_input}
                    onChange={(e) => handleFieldChange("other_conditions_input", e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="checklist-item">
              <p className="checklist-question">
                3. Can you confirm that there will be enough work lighting to begin the work?
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel13" value="1" checked={formData.floatLabel13 === "1"} onChange={(e) => handleFieldChange("floatLabel13", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel13" value="0" checked={formData.floatLabel13 === "0"} onChange={(e) => handleFieldChange("floatLabel13", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel13" value="2" checked={formData.floatLabel13 === "2"} onChange={(e) => handleFieldChange("floatLabel13", e.target.value)} /> N/A</label>
              </div>
            </div>

            <div className="checklist-item">
              <p className="checklist-question">
                4. Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel14" value="1" checked={formData.floatLabel14 === "1"} onChange={(e) => handleFieldChange("floatLabel14", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel14" value="0" checked={formData.floatLabel14 === "0"} onChange={(e) => handleFieldChange("floatLabel14", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel14" value="2" checked={formData.floatLabel14 === "2"} onChange={(e) => handleFieldChange("floatLabel14", e.target.value)} /> N/A</label>
              </div>
            </div>

            <div className="checklist-item">
              <p className="checklist-question">
                5. Is the work environment safety ensured? Have the necessary warning signs been placed?
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel15" value="1" checked={formData.floatLabel15 === "1"} onChange={(e) => handleFieldChange("floatLabel15", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel15" value="0" checked={formData.floatLabel15 === "0"} onChange={(e) => handleFieldChange("floatLabel15", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel15" value="2" checked={formData.floatLabel15 === "2"} onChange={(e) => handleFieldChange("floatLabel15", e.target.value)} /> N/A</label>
              </div>
            </div>

            <div className="checklist-item">
              <p className="checklist-question">
                6. Have the team been informed about the course of action in any emergency situation?
              </p>
              <div className="radio-group">
                <label><input type="radio" name="floatLabel16" value="1" checked={formData.floatLabel16 === "1"} onChange={(e) => handleFieldChange("floatLabel16", e.target.value)} /> Yes</label>
                <label><input type="radio" name="floatLabel16" value="0" checked={formData.floatLabel16 === "0"} onChange={(e) => handleFieldChange("floatLabel16", e.target.value)} /> No</label>
                <label><input type="radio" name="floatLabel16" value="2" checked={formData.floatLabel16 === "2"} onChange={(e) => handleFieldChange("floatLabel16", e.target.value)} /> N/A</label>
              </div>
            </div>
          </div>

          {/* Safety Options dropdowns with logos on the left */}
          <div className="form-card">
            <h2 className="form-card-title">Safety Precautions & Tasks</h2>

            {/* Hotwork dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", flexShrink: 0, background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/src/assets/images/logos/HotWorks.png" alt="HotWorks" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
              </div>
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">Is Hotwork Required?</label>
                <select
                  className="df-select"
                  value={formData.HOTWORK}
                  onChange={(e) => handleFieldChange("HOTWORK", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.HOTWORK === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Are there other tasks in progress in the area?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel1" value="1" checked={formData.floatLabel1 === "1"} onChange={(e) => handleFieldChange("floatLabel1", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel1" value="0" checked={formData.floatLabel1 === "0"} onChange={(e) => handleFieldChange("floatLabel1", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel1" value="2" checked={formData.floatLabel1 === "2"} onChange={(e) => handleFieldChange("floatLabel1", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have you considered any alternative methods to the hot work method?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel3" value="1" checked={formData.floatLabel3 === "1"} onChange={(e) => handleFieldChange("floatLabel3", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel3" value="0" checked={formData.floatLabel3 === "0"} onChange={(e) => handleFieldChange("floatLabel3", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel3" value="2" checked={formData.floatLabel3 === "2"} onChange={(e) => handleFieldChange("floatLabel3", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have the team been informed about the specific risks based on task?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel4" value="1" checked={formData.floatLabel4 === "1"} onChange={(e) => handleFieldChange("floatLabel4", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel4" value="0" checked={formData.floatLabel4 === "0"} onChange={(e) => handleFieldChange("floatLabel4", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel4" value="2" checked={formData.floatLabel4 === "2"} onChange={(e) => handleFieldChange("floatLabel4", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is the work environment safety ensured? Have the necessary warning signs been placed?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel5" value="1" checked={formData.floatLabel5 === "1"} onChange={(e) => handleFieldChange("floatLabel5", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel5" value="0" checked={formData.floatLabel5 === "0"} onChange={(e) => handleFieldChange("floatLabel5", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel5" value="2" checked={formData.floatLabel5 === "2"} onChange={(e) => handleFieldChange("floatLabel5", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have the team been informed about the course of action in emergencies?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel6" value="1" checked={formData.floatLabel6 === "1"} onChange={(e) => handleFieldChange("floatLabel6", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel6" value="0" checked={formData.floatLabel6 === "0"} onChange={(e) => handleFieldChange("floatLabel6", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel6" value="2" checked={formData.floatLabel6 === "2"} onChange={(e) => handleFieldChange("floatLabel6", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Should a fire watch be established?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel7" value="1" checked={formData.floatLabel7 === "1"} onChange={(e) => handleFieldChange("floatLabel7", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel7" value="0" checked={formData.floatLabel7 === "0"} onChange={(e) => handleFieldChange("floatLabel7", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel7" value="2" checked={formData.floatLabel7 === "2"} onChange={(e) => handleFieldChange("floatLabel7", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Can you confirm that the flammable material are removed from the work area?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel8" value="1" checked={formData.floatLabel8 === "1"} onChange={(e) => handleFieldChange("floatLabel8", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel8" value="0" checked={formData.floatLabel8 === "0"} onChange={(e) => handleFieldChange("floatLabel8", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel8" value="2" checked={formData.floatLabel8 === "2"} onChange={(e) => handleFieldChange("floatLabel8", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Should safety measures implemented to stop sparks from splattering on a flooring or other surfaces?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel9" value="1" checked={formData.floatLabel9 === "1"} onChange={(e) => handleFieldChange("floatLabel9", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel9" value="0" checked={formData.floatLabel9 === "0"} onChange={(e) => handleFieldChange("floatLabel9", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel9" value="2" checked={formData.floatLabel9 === "2"} onChange={(e) => handleFieldChange("floatLabel9", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are fire extinguishers and fire blanket ready for use in the area?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel10" value="1" checked={formData.floatLabel10 === "1"} onChange={(e) => handleFieldChange("floatLabel10", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel10" value="0" checked={formData.floatLabel10 === "0"} onChange={(e) => handleFieldChange("floatLabel10", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel10" value="2" checked={formData.floatLabel10 === "2"} onChange={(e) => handleFieldChange("floatLabel10", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="df-field" style={{ marginTop: "16px" }}>
                  <label className="df-label">Is there any welding activity?</label>
                  <select
                    className="df-select"
                    value={formData.NEWHOTWORK}
                    onChange={(e) => handleFieldChange("NEWHOTWORK", e.target.value)}
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>

                {formData.NEWHOTWORK === "1" && (
                  <div className="welding-subform" style={{ marginTop: "12px", paddingLeft: "16px", borderLeft: "3px solid #2563eb" }}>
                    <div className="checklist-item">
                      <p className="checklist-question">The people who will do heat treatment, had welder certificates?</p>
                      <div className="radio-group">
                        <label><input type="radio" name="NEWHOTWORK1" value="1" checked={formData.NEWHOTWORK1 === "1"} onChange={(e) => handleFieldChange("NEWHOTWORK1", e.target.value)} /> Yes</label>
                        <label><input type="radio" name="NEWHOTWORK1" value="0" checked={formData.NEWHOTWORK1 === "0"} onChange={(e) => handleFieldChange("NEWHOTWORK1", e.target.value)} /> No</label>
                        <label><input type="radio" name="NEWHOTWORK1" value="2" checked={formData.NEWHOTWORK1 === "2"} onChange={(e) => handleFieldChange("NEWHOTWORK1", e.target.value)} /> N/A</label>
                      </div>
                    </div>
                    <div className="checklist-item">
                      <p className="checklist-question">Should air extraction be established?</p>
                      <div className="radio-group">
                        <label><input type="radio" name="NEWHOTWORK2" value="1" checked={formData.NEWHOTWORK2 === "1"} onChange={(e) => handleFieldChange("NEWHOTWORK2", e.target.value)} /> Yes</label>
                        <label><input type="radio" name="NEWHOTWORK2" value="0" checked={formData.NEWHOTWORK2 === "0"} onChange={(e) => handleFieldChange("NEWHOTWORK2", e.target.value)} /> No</label>
                        <label><input type="radio" name="NEWHOTWORK2" value="2" checked={formData.NEWHOTWORK2 === "2"} onChange={(e) => handleFieldChange("NEWHOTWORK2", e.target.value)} /> N/A</label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Temporary Electrical Systems dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", flexShrink: 0, background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/src/assets/images/logos/ElectricalSystems.png" alt="ElectricalSystems" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
              </div>
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">Working on Site Temporary Electrical Systems?</label>
                <select
                  className="df-select"
                  value={formData.electricalSystem}
                  onChange={(e) => handleFieldChange("electricalSystem", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.electricalSystem === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Is the responsible for the area informed?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel17" value="1" checked={formData.floatLabel17 === "1"} onChange={(e) => handleFieldChange("floatLabel17", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel17" value="0" checked={formData.floatLabel17 === "0"} onChange={(e) => handleFieldChange("floatLabel17", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel17" value="2" checked={formData.floatLabel17 === "2"} onChange={(e) => handleFieldChange("floatLabel17", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Check if the board is de-energized - is it de-energized?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel18" value="1" checked={formData.floatLabel18 === "1"} onChange={(e) => handleFieldChange("floatLabel18", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel18" value="0" checked={formData.floatLabel18 === "0"} onChange={(e) => handleFieldChange("floatLabel18", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel18" value="2" checked={formData.floatLabel18 === "2"} onChange={(e) => handleFieldChange("floatLabel18", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a padlock.</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel19" value="1" checked={formData.floatLabel19 === "1"} onChange={(e) => handleFieldChange("floatLabel19", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel19" value="0" checked={formData.floatLabel19 === "0"} onChange={(e) => handleFieldChange("floatLabel19", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel19" value="2" checked={formData.floatLabel19 === "2"} onChange={(e) => handleFieldChange("floatLabel19", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Do you have risk assessment done (RAMS)?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel20" value="1" checked={formData.floatLabel20 === "1"} onChange={(e) => handleFieldChange("floatLabel20", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel20" value="0" checked={formData.floatLabel20 === "0"} onChange={(e) => handleFieldChange("floatLabel20", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel20" value="2" checked={formData.floatLabel20 === "2"} onChange={(e) => handleFieldChange("floatLabel20", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Do appliances/devices that run on electricity have insulation?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel22" value="1" checked={formData.floatLabel22 === "1"} onChange={(e) => handleFieldChange("floatLabel22", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel22" value="0" checked={formData.floatLabel22 === "0"} onChange={(e) => handleFieldChange("floatLabel22", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel22" value="2" checked={formData.floatLabel22 === "2"} onChange={(e) => handleFieldChange("floatLabel22", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Hazardous Substances dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <div style={{ width: "64px", height: "64px", flexShrink: 0, background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/src/assets/images/logos/substanceChemical.png" alt="Chemicals" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
              </div>
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">Working with Hazardous Substances/Chemicals?</label>
                <select
                  className="df-select"
                  value={formData.HAZARDOUS}
                  onChange={(e) => handleFieldChange("HAZARDOUS", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.HAZARDOUS === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Relevant MAL-codes and safety datasheets for hazardous medias have been presented?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel24" value="1" checked={formData.floatLabel24 === "1"} onChange={(e) => handleFieldChange("floatLabel24", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel24" value="0" checked={formData.floatLabel24 === "0"} onChange={(e) => handleFieldChange("floatLabel24", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel24" value="2" checked={formData.floatLabel24 === "2"} onChange={(e) => handleFieldChange("floatLabel24", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is MSDS (Material Safety Data Sheet) submitted?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel25" value="1" checked={formData.floatLabel25 === "1"} onChange={(e) => handleFieldChange("floatLabel25", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel25" value="0" checked={formData.floatLabel25 === "0"} onChange={(e) => handleFieldChange("floatLabel25", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel25" value="2" checked={formData.floatLabel25 === "2"} onChange={(e) => handleFieldChange("floatLabel25", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Has the use of protective equipment been taken into account - and are they present?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel26" value="1" checked={formData.floatLabel26 === "1"} onChange={(e) => handleFieldChange("floatLabel26", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel26" value="0" checked={formData.floatLabel26 === "0"} onChange={(e) => handleFieldChange("floatLabel26", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel26" value="2" checked={formData.floatLabel26 === "2"} onChange={(e) => handleFieldChange("floatLabel26", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Has the use of ventilation been taken into account?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel27" value="1" checked={formData.floatLabel27 === "1"} onChange={(e) => handleFieldChange("floatLabel27", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel27" value="0" checked={formData.floatLabel27 === "0"} onChange={(e) => handleFieldChange("floatLabel27", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel27" value="2" checked={formData.floatLabel27 === "2"} onChange={(e) => handleFieldChange("floatLabel27", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Will the hazardous substances affect people outside the working area? (fumes)</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel28" value="1" checked={formData.floatLabel28 === "1"} onChange={(e) => handleFieldChange("floatLabel28", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel28" value="0" checked={formData.floatLabel28 === "0"} onChange={(e) => handleFieldChange("floatLabel28", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel28" value="2" checked={formData.floatLabel28 === "2"} onChange={(e) => handleFieldChange("floatLabel28", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are there means for safe storage and disposal? Is it mapped on the site plan?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel29" value="1" checked={formData.floatLabel29 === "1"} onChange={(e) => handleFieldChange("floatLabel29", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel29" value="0" checked={formData.floatLabel29 === "0"} onChange={(e) => handleFieldChange("floatLabel29", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel29" value="2" checked={formData.floatLabel29 === "2"} onChange={(e) => handleFieldChange("floatLabel29", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the spill kits in place and reachable in case of a leak or spill?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel30" value="1" checked={formData.floatLabel30 === "1"} onChange={(e) => handleFieldChange("floatLabel30", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel30" value="0" checked={formData.floatLabel30 === "0"} onChange={(e) => handleFieldChange("floatLabel30", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel30" value="2" checked={formData.floatLabel30 === "2"} onChange={(e) => handleFieldChange("floatLabel30", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is RAMS covering chemicals risk assessment for working with the substance?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel31" value="1" checked={formData.floatLabel31 === "1"} onChange={(e) => handleFieldChange("floatLabel31", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel31" value="0" checked={formData.floatLabel31 === "0"} onChange={(e) => handleFieldChange("floatLabel31", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel31" value="2" checked={formData.floatLabel31 === "2"} onChange={(e) => handleFieldChange("floatLabel31", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Working at Height dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <img src="/src/assets/images/logos/WorkingAtHight.png" alt="Working at Height" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">WORKING AT HEIGHT?</label>
                <select
                  className="df-select"
                  value={formData.workingAtHeight}
                  onChange={(e) => handleFieldChange("workingAtHeight", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.workingAtHeight === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Has the working area been segregated or demarkated with hand barriers?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="segragated_demarkated" value="1" checked={formData.segragated_demarkated === "1"} onChange={(e) => handleFieldChange("segragated_demarkated", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="segragated_demarkated" value="0" checked={formData.segragated_demarkated === "0"} onChange={(e) => handleFieldChange("segragated_demarkated", e.target.value)} /> No</label>
                    <label><input type="radio" name="segragated_demarkated" value="2" checked={formData.segragated_demarkated === "2"} onChange={(e) => handleFieldChange("segragated_demarkated", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are suitable anchor points in place for lanyard attachments?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel39" value="1" checked={formData.floatLabel39 === "1"} onChange={(e) => handleFieldChange("floatLabel39", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel39" value="0" checked={formData.floatLabel39 === "0"} onChange={(e) => handleFieldChange("floatLabel39", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel39" value="2" checked={formData.floatLabel39 === "2"} onChange={(e) => handleFieldChange("floatLabel39", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">In case of emergency is there a rescue plan in place?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel40" value="1" checked={formData.floatLabel40 === "1"} onChange={(e) => handleFieldChange("floatLabel40", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel40" value="0" checked={formData.floatLabel40 === "0"} onChange={(e) => handleFieldChange("floatLabel40", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel40" value="2" checked={formData.floatLabel40 === "2"} onChange={(e) => handleFieldChange("floatLabel40", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have the work been planned and coordinated to avoid hazards like (falling objects/materials onto other workers, interference between the machines etc.)?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel41" value="1" checked={formData.floatLabel41 === "1"} onChange={(e) => handleFieldChange("floatLabel41", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel41" value="0" checked={formData.floatLabel41 === "0"} onChange={(e) => handleFieldChange("floatLabel41", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel41" value="2" checked={formData.floatLabel41 === "2"} onChange={(e) => handleFieldChange("floatLabel41", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have the team had certified working at height training?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel42" value="1" checked={formData.floatLabel42 === "1"} onChange={(e) => handleFieldChange("floatLabel42", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel42" value="0" checked={formData.floatLabel42 === "0"} onChange={(e) => handleFieldChange("floatLabel42", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel42" value="2" checked={formData.floatLabel42 === "2"} onChange={(e) => handleFieldChange("floatLabel42", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Will this work be carried out by, and under the supervision of personnel who have received 'Working at Height' training?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel43" value="1" checked={formData.floatLabel43 === "1"} onChange={(e) => handleFieldChange("floatLabel43", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel43" value="0" checked={formData.floatLabel43 === "0"} onChange={(e) => handleFieldChange("floatLabel43", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel43" value="2" checked={formData.floatLabel43 === "2"} onChange={(e) => handleFieldChange("floatLabel43", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Full body harness with fall-preventing system deployed & twin lanyard provided?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel44" value="1" checked={formData.floatLabel44 === "1"} onChange={(e) => handleFieldChange("floatLabel44", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel44" value="0" checked={formData.floatLabel44 === "0"} onChange={(e) => handleFieldChange("floatLabel44", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel44" value="2" checked={formData.floatLabel44 === "2"} onChange={(e) => handleFieldChange("floatLabel44", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the working at height equipments (Safety harness and lanyard) inspected and suitable to carry out the task?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel45" value="1" checked={formData.floatLabel45 === "1"} onChange={(e) => handleFieldChange("floatLabel45", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel45" value="0" checked={formData.floatLabel45 === "0"} onChange={(e) => handleFieldChange("floatLabel45", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel45" value="2" checked={formData.floatLabel45 === "2"} onChange={(e) => handleFieldChange("floatLabel45", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Horizontal or vertical life line systems in place?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel46" value="1" checked={formData.floatLabel46 === "1"} onChange={(e) => handleFieldChange("floatLabel46", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel46" value="0" checked={formData.floatLabel46 === "0"} onChange={(e) => handleFieldChange("floatLabel46", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel46" value="2" checked={formData.floatLabel46 === "2"} onChange={(e) => handleFieldChange("floatLabel46", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are all tools secured from falling from height?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel47" value="1" checked={formData.floatLabel47 === "1"} onChange={(e) => handleFieldChange("floatLabel47", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel47" value="0" checked={formData.floatLabel47 === "0"} onChange={(e) => handleFieldChange("floatLabel47", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel47" value="2" checked={formData.floatLabel47 === "2"} onChange={(e) => handleFieldChange("floatLabel47", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have protective measures for dropped objects been established (e.g. lanyards, demarcated working area, nets)?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel48" value="1" checked={formData.floatLabel48 === "1"} onChange={(e) => handleFieldChange("floatLabel48", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel48" value="0" checked={formData.floatLabel48 === "0"} onChange={(e) => handleFieldChange("floatLabel48", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel48" value="2" checked={formData.floatLabel48 === "2"} onChange={(e) => handleFieldChange("floatLabel48", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Has proper and safe access and egress been ensured?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel49" value="1" checked={formData.floatLabel49 === "1"} onChange={(e) => handleFieldChange("floatLabel49", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel49" value="0" checked={formData.floatLabel49 === "0"} onChange={(e) => handleFieldChange("floatLabel49", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel49" value="2" checked={formData.floatLabel49 === "2"} onChange={(e) => handleFieldChange("floatLabel49", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the weather conditions acceptable?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel50" value="1" checked={formData.floatLabel50 === "1"} onChange={(e) => handleFieldChange("floatLabel50", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel50" value="0" checked={formData.floatLabel50 === "0"} onChange={(e) => handleFieldChange("floatLabel50", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel50" value="2" checked={formData.floatLabel50 === "2"} onChange={(e) => handleFieldChange("floatLabel50", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Working in Confined Spaces dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <img src="/src/assets/images/logos/ConfinedSpace.png" alt="Confined Spaces" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">WORKING IN CONFINED SPACES?</label>
                <select
                  className="df-select"
                  value={formData.confinedSpaces}
                  onChange={(e) => handleFieldChange("confinedSpaces", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.confinedSpaces === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Is the tank/container cleaned so that the task can take place without risk from vapours, gases etc.?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel51" value="1" checked={formData.floatLabel51 === "1"} onChange={(e) => handleFieldChange("floatLabel51", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel51" value="0" checked={formData.floatLabel51 === "0"} onChange={(e) => handleFieldChange("floatLabel51", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel51" value="2" checked={formData.floatLabel51 === "2"} onChange={(e) => handleFieldChange("floatLabel51", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are oxygen measurement and LEL measurement done before starting the work?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel52" value="1" checked={formData.floatLabel52 === "1"} onChange={(e) => handleFieldChange("floatLabel52", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel52" value="0" checked={formData.floatLabel52 === "0"} onChange={(e) => handleFieldChange("floatLabel52", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel52" value="2" checked={formData.floatLabel52 === "2"} onChange={(e) => handleFieldChange("floatLabel52", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the container and all equipment on the container, including agitator properly secured?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel53" value="1" checked={formData.floatLabel53 === "1"} onChange={(e) => handleFieldChange("floatLabel53", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel53" value="0" checked={formData.floatLabel53 === "0"} onChange={(e) => handleFieldChange("floatLabel53", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel53" value="2" checked={formData.floatLabel53 === "2"} onChange={(e) => handleFieldChange("floatLabel53", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are there safe entry and exit conditions? (e.g. ladder)</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel54" value="1" checked={formData.floatLabel54 === "1"} onChange={(e) => handleFieldChange("floatLabel54", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel54" value="0" checked={formData.floatLabel54 === "0"} onChange={(e) => handleFieldChange("floatLabel54", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel54" value="2" checked={formData.floatLabel54 === "2"} onChange={(e) => handleFieldChange("floatLabel54", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are means of communication for emergency rescue determined? (Siren, radio or telephone options for emergency rescue?)</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel55" value="1" checked={formData.floatLabel55 === "1"} onChange={(e) => handleFieldChange("floatLabel55", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel55" value="0" checked={formData.floatLabel55 === "0"} onChange={(e) => handleFieldChange("floatLabel55", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel55" value="2" checked={formData.floatLabel55 === "2"} onChange={(e) => handleFieldChange("floatLabel55", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are rescue equipments in place and ready for use?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel56" value="1" checked={formData.floatLabel56 === "1"} onChange={(e) => handleFieldChange("floatLabel56", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel56" value="0" checked={formData.floatLabel56 === "0"} onChange={(e) => handleFieldChange("floatLabel56", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel56" value="2" checked={formData.floatLabel56 === "2"} onChange={(e) => handleFieldChange("floatLabel56", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are space and ventilation adequate?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel57" value="1" checked={formData.floatLabel57 === "1"} onChange={(e) => handleFieldChange("floatLabel57", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel57" value="0" checked={formData.floatLabel57 === "0"} onChange={(e) => handleFieldChange("floatLabel57", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel57" value="2" checked={formData.floatLabel57 === "2"} onChange={(e) => handleFieldChange("floatLabel57", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is an oxygen meter provided for the work?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel58" value="1" checked={formData.floatLabel58 === "1"} onChange={(e) => handleFieldChange("floatLabel58", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel58" value="0" checked={formData.floatLabel58 === "0"} onChange={(e) => handleFieldChange("floatLabel58", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel58" value="2" checked={formData.floatLabel58 === "2"} onChange={(e) => handleFieldChange("floatLabel58", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Excavation Works dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <img src="/src/assets/images/logos/ExcavationWorks.png" alt="Excavation Works" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">EXCAVATION WORKS?</label>
                <select
                  className="df-select"
                  value={formData.excavationWorks}
                  onChange={(e) => handleFieldChange("excavationWorks", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.excavationWorks === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Is the excavation area segregated (1 meter from edge with hard barriers or 2 meters with soft barriers) before the work begins?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel71" value="1" checked={formData.floatLabel71 === "1"} onChange={(e) => handleFieldChange("floatLabel71", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel71" value="0" checked={formData.floatLabel71 === "0"} onChange={(e) => handleFieldChange("floatLabel71", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel71" value="2" checked={formData.floatLabel71 === "2"} onChange={(e) => handleFieldChange("floatLabel71", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Has the digging permit been obtained in accordance with Danish regulations and NN standards?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel72" value="1" checked={formData.floatLabel72 === "1"} onChange={(e) => handleFieldChange("floatLabel72", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel72" value="0" checked={formData.floatLabel72 === "0"} onChange={(e) => handleFieldChange("floatLabel72", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel72" value="2" checked={formData.floatLabel72 === "2"} onChange={(e) => handleFieldChange("floatLabel72", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Does excavation require shoring?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="excavation_shoring" value="1" checked={formData.excavation_shoring === "1"} onChange={(e) => handleFieldChange("excavation_shoring", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="excavation_shoring" value="0" checked={formData.excavation_shoring === "0"} onChange={(e) => handleFieldChange("excavation_shoring", e.target.value)} /> No</label>
                    <label><input type="radio" name="excavation_shoring" value="2" checked={formData.excavation_shoring === "2"} onChange={(e) => handleFieldChange("excavation_shoring", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is the sloping correct in relation to the depth of the dig as per Danish regulations?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel74" value="1" checked={formData.floatLabel74 === "1"} onChange={(e) => handleFieldChange("floatLabel74", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel74" value="0" checked={formData.floatLabel74 === "0"} onChange={(e) => handleFieldChange("floatLabel74", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel74" value="2" checked={formData.floatLabel74 === "2"} onChange={(e) => handleFieldChange("floatLabel74", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have proper and safe access and egress been provided?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel75" value="1" checked={formData.floatLabel75 === "1"} onChange={(e) => handleFieldChange("floatLabel75", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel75" value="0" checked={formData.floatLabel75 === "0"} onChange={(e) => handleFieldChange("floatLabel75", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel75" value="2" checked={formData.floatLabel75 === "2"} onChange={(e) => handleFieldChange("floatLabel75", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are correctly positioned ladders or correctly sloped stairways accessible?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel76" value="1" checked={formData.floatLabel76 === "1"} onChange={(e) => handleFieldChange("floatLabel76", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel76" value="0" checked={formData.floatLabel76 === "0"} onChange={(e) => handleFieldChange("floatLabel76", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel76" value="2" checked={formData.floatLabel76 === "2"} onChange={(e) => handleFieldChange("floatLabel76", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Do all machines have valid inspection dates?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel77" value="1" checked={formData.floatLabel77 === "1"} onChange={(e) => handleFieldChange("floatLabel77", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel77" value="0" checked={formData.floatLabel77 === "0"} onChange={(e) => handleFieldChange("floatLabel77", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel77" value="2" checked={formData.floatLabel77 === "2"} onChange={(e) => handleFieldChange("floatLabel77", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have clearly marked drawings been submitted?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel78" value="1" checked={formData.floatLabel78 === "1"} onChange={(e) => handleFieldChange("floatLabel78", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel78" value="0" checked={formData.floatLabel78 === "0"} onChange={(e) => handleFieldChange("floatLabel78", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel78" value="2" checked={formData.floatLabel78 === "2"} onChange={(e) => handleFieldChange("floatLabel78", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the underground areas cleared from all electrical, piping and other services?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel79" value="1" checked={formData.floatLabel79 === "1"} onChange={(e) => handleFieldChange("floatLabel79", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel79" value="0" checked={formData.floatLabel79 === "0"} onChange={(e) => handleFieldChange("floatLabel79", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel79" value="2" checked={formData.floatLabel79 === "2"} onChange={(e) => handleFieldChange("floatLabel79", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Using Crane or Lifting dropdown */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center" }}>
              <img src="/src/assets/images/logos/Craneslifting.png" alt="Crane Lifting" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">USING CRANE OR LIFTING?</label>
                <select
                  className="df-select"
                  value={formData.craneLifting}
                  onChange={(e) => handleFieldChange("craneLifting", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.craneLifting === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Is there an appointed person in charge of the lifting/crane operation?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel80" value="1" checked={formData.floatLabel80 === "1"} onChange={(e) => handleFieldChange("floatLabel80", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel80" value="0" checked={formData.floatLabel80 === "0"} onChange={(e) => handleFieldChange("floatLabel80", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel80" value="2" checked={formData.floatLabel80 === "2"} onChange={(e) => handleFieldChange("floatLabel80", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Are the details of load (dimensions, SWL) and the loading/unloading requirements provided from vendor or supplier?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel81" value="1" checked={formData.floatLabel81 === "1"} onChange={(e) => handleFieldChange("floatLabel81", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel81" value="0" checked={formData.floatLabel81 === "0"} onChange={(e) => handleFieldChange("floatLabel81", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel81" value="2" checked={formData.floatLabel81 === "2"} onChange={(e) => handleFieldChange("floatLabel81", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is lift plan submitted?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel82" value="1" checked={formData.floatLabel82 === "1"} onChange={(e) => handleFieldChange("floatLabel82", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel82" value="0" checked={formData.floatLabel82 === "0"} onChange={(e) => handleFieldChange("floatLabel82", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel82" value="2" checked={formData.floatLabel82 === "2"} onChange={(e) => handleFieldChange("floatLabel82", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Has the correct crane/lifting equipment as stated in the lift plan been supplied and inspected?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel83" value="1" checked={formData.floatLabel83 === "1"} onChange={(e) => handleFieldChange("floatLabel83", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel83" value="0" checked={formData.floatLabel83 === "0"} onChange={(e) => handleFieldChange("floatLabel83", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel83" value="2" checked={formData.floatLabel83 === "2"} onChange={(e) => handleFieldChange("floatLabel83", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Do the crane operators have the legal required certificates?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel84" value="1" checked={formData.floatLabel84 === "1"} onChange={(e) => handleFieldChange("floatLabel84", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel84" value="0" checked={formData.floatLabel84 === "0"} onChange={(e) => handleFieldChange("floatLabel84", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel84" value="2" checked={formData.floatLabel84 === "2"} onChange={(e) => handleFieldChange("floatLabel84", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is laydown area suitable and prepared for lifting?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel85" value="1" checked={formData.floatLabel85 === "1"} onChange={(e) => handleFieldChange("floatLabel85", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel85" value="0" checked={formData.floatLabel85 === "0"} onChange={(e) => handleFieldChange("floatLabel85", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel85" value="2" checked={formData.floatLabel85 === "2"} onChange={(e) => handleFieldChange("floatLabel85", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is the entire area of the lifting task fenced off?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel86" value="1" checked={formData.floatLabel86 === "1"} onChange={(e) => handleFieldChange("floatLabel86", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel86" value="0" checked={formData.floatLabel86 === "0"} onChange={(e) => handleFieldChange("floatLabel86", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel86" value="2" checked={formData.floatLabel86 === "2"} onChange={(e) => handleFieldChange("floatLabel86", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Have all overhead risks (cables, adjacent structures etc.) been identified and suitable precautions implemented?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel87" value="1" checked={formData.floatLabel87 === "1"} onChange={(e) => handleFieldChange("floatLabel87", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel87" value="0" checked={formData.floatLabel87 === "0"} onChange={(e) => handleFieldChange("floatLabel87", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel87" value="2" checked={formData.floatLabel87 === "2"} onChange={(e) => handleFieldChange("floatLabel87", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}

            {/* Pressure Testing dropdown */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <img src="/src/assets/images/logos/testingequipment.png" alt="testingequipment" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "contain", flexShrink: 0 }} />
              <div className="df-field" style={{ flex: 1 }}>
                <label className="df-label">PRESSURE TESTING OF EQUIPMENT REQUIRED?</label>
                <select
                  className="df-select"
                  value={formData.TESTINGs}
                  onChange={(e) => handleFieldChange("TESTINGs", e.target.value)}
                >
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
            </div>

            {formData.TESTINGs === "1" && (
              <div className="conditional-fields-block" style={{ marginBottom: "20px", marginTop: "20px" }}>
                <div className="checklist-item">
                  <p className="checklist-question">Linewalk of the pipework/equipment done?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel102" value="1" checked={formData.floatLabel102 === "1"} onChange={(e) => handleFieldChange("floatLabel102", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel102" value="0" checked={formData.floatLabel102 === "0"} onChange={(e) => handleFieldChange("floatLabel102", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel102" value="2" checked={formData.floatLabel102 === "2"} onChange={(e) => handleFieldChange("floatLabel102", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Pressure test is coordinated with NNE C&Q?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel103" value="1" checked={formData.floatLabel103 === "1"} onChange={(e) => handleFieldChange("floatLabel103", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel103" value="0" checked={formData.floatLabel103 === "0"} onChange={(e) => handleFieldChange("floatLabel103", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel103" value="2" checked={formData.floatLabel103 === "2"} onChange={(e) => handleFieldChange("floatLabel103", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is the pipework/equipment MIC? (Mechanical Installation Complete)?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel104" value="1" checked={formData.floatLabel104 === "1"} onChange={(e) => handleFieldChange("floatLabel104", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel104" value="0" checked={formData.floatLabel104 === "0"} onChange={(e) => handleFieldChange("floatLabel104", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel104" value="2" checked={formData.floatLabel104 === "2"} onChange={(e) => handleFieldChange("floatLabel104", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">LOTO plan attached to the work permit?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel105" value="1" checked={formData.floatLabel105 === "1"} onChange={(e) => handleFieldChange("floatLabel105", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel105" value="0" checked={formData.floatLabel105 === "0"} onChange={(e) => handleFieldChange("floatLabel105", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel105" value="2" checked={formData.floatLabel105 === "2"} onChange={(e) => handleFieldChange("floatLabel105", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Is the exclusion zone calculated and layout attached to work permit?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel106" value="1" checked={formData.floatLabel106 === "1"} onChange={(e) => handleFieldChange("floatLabel106", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel106" value="0" checked={formData.floatLabel106 === "0"} onChange={(e) => handleFieldChange("floatLabel106", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel106" value="2" checked={formData.floatLabel106 === "2"} onChange={(e) => handleFieldChange("floatLabel106", e.target.value)} /> N/A</label>
                  </div>
                </div>

                <div className="checklist-item">
                  <p className="checklist-question">Pneumatic Test?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel107" disabled={formData.floatLabel108 === "1"} value="1" checked={formData.floatLabel107 === "1"} onChange={(e) => handleFieldChange("floatLabel107", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel107" value="0" checked={formData.floatLabel107 === "0"} onChange={(e) => handleFieldChange("floatLabel107", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel107" value="2" checked={formData.floatLabel107 === "2"} onChange={(e) => handleFieldChange("floatLabel107", e.target.value)} /> N/A</label>
                  </div>
                </div>

                {formData.floatLabel107 === "1" && (
                  <div className="df-field" style={{ marginTop: "8px", marginBottom: "16px" }}>
                    <label className="df-label">Pressure of Pneumatic Test (in BarG)</label>
                    <input
                      type="text"
                      className="df-input"
                      placeholder="Provide the pressure value"
                      value={formData.pressure_pneumatic}
                      onChange={(e) => handleFieldChange("pressure_pneumatic", e.target.value)}
                    />
                  </div>
                )}

                <div className="checklist-item">
                  <p className="checklist-question">Hydrostatic test?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel108" disabled={formData.floatLabel107 === "1"} value="1" checked={formData.floatLabel108 === "1"} onChange={(e) => handleFieldChange("floatLabel108", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel108" value="0" checked={formData.floatLabel108 === "0"} onChange={(e) => handleFieldChange("floatLabel108", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel108" value="2" checked={formData.floatLabel108 === "2"} onChange={(e) => handleFieldChange("floatLabel108", e.target.value)} /> N/A</label>
                  </div>
                </div>

                {formData.floatLabel108 === "1" && (
                  <div className="df-field" style={{ marginTop: "8px", marginBottom: "16px" }}>
                    <label className="df-label">Pressure of Hydrostatic Test (in BarG)</label>
                    <input
                      type="text"
                      className="df-input"
                      placeholder="Provide the pressure value"
                      value={formData.pressure_hydrostatic}
                      onChange={(e) => handleFieldChange("pressure_hydrostatic", e.target.value)}
                    />
                  </div>
                )}

                <div className="checklist-item">
                  <p className="checklist-question">Safety Valves are calibrated and attached to the Pressure testing rig?</p>
                  <div className="radio-group">
                    <label><input type="radio" name="floatLabel109" value="1" checked={formData.floatLabel109 === "1"} onChange={(e) => handleFieldChange("floatLabel109", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="floatLabel109" value="0" checked={formData.floatLabel109 === "0"} onChange={(e) => handleFieldChange("floatLabel109", e.target.value)} /> No</label>
                    <label><input type="radio" name="floatLabel109" value="2" checked={formData.floatLabel109 === "2"} onChange={(e) => handleFieldChange("floatLabel109", e.target.value)} /> N/A</label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PPE Section */}
          <div className="form-card">
            <h2 className="form-card-title">PPE Requirements</h2>

            <div style={{ marginBottom: "20px" }}>
              <label className="df-label" style={{ marginBottom: "12px" }}>Mandatory PPE Required:</label>
              <div className="ppe-mandatory-row">
                <img src="/src/assets/images/safetyIcons/HardHat.png" alt="HardHat" className="ppe-mandatory-icon" />
                <img src="/src/assets/images/safetyIcons/SpecificGloves.png" alt="SpecificGloves" className="ppe-mandatory-icon" />
                <img src="/src/assets/images/safetyIcons/Safetyshoes.png" alt="Safety Shoes" className="ppe-mandatory-icon" />
                <img src="/src/assets/images/safetyIcons/HighVisibility.png" alt="High Visibility" className="ppe-mandatory-icon" />
                <img src="/src/assets/images/safetyIcons/Longpants.png" alt="Long Pants" className="ppe-mandatory-icon" />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label className="df-label" style={{ marginBottom: "16px" }}>Task Specific PPE Required:</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src="/src/assets/images/safetyIcons/Eyeprotection.png" alt="Eye Protection" style={{ width: "64px", height: "64px", marginBottom: "8px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Eye Protection</span>
                  <div className="radio-group">
                    <label><input type="radio" name="eye_protection" value="1" checked={formData.eye_protection === "1"} onChange={(e) => handleFieldChange("eye_protection", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="eye_protection" value="0" checked={formData.eye_protection === "0"} onChange={(e) => handleFieldChange("eye_protection", e.target.value)} /> No</label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src="/src/assets/images/safetyIcons/Fallprotection.png" alt="Fall Protection" style={{ width: "64px", height: "64px", marginBottom: "8px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Fall Protection</span>
                  <div className="radio-group">
                    <label><input type="radio" name="fall_protection" value="1" checked={formData.fall_protection === "1"} onChange={(e) => handleFieldChange("fall_protection", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="fall_protection" value="0" checked={formData.fall_protection === "0"} onChange={(e) => handleFieldChange("fall_protection", e.target.value)} /> No</label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src="/src/assets/images/safetyIcons/Hearingprotection.png" alt="Hearing Protection" style={{ width: "64px", height: "64px", marginBottom: "8px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Hearing Protection</span>
                  <div className="radio-group">
                    <label><input type="radio" name="hearing_protection" value="1" checked={formData.hearing_protection === "1"} onChange={(e) => handleFieldChange("hearing_protection", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="hearing_protection" value="0" checked={formData.hearing_protection === "0"} onChange={(e) => handleFieldChange("hearing_protection", e.target.value)} /> No</label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src="/src/assets/images/safetyIcons/Respiratoryprotection.png" alt="Respiratory Protection" style={{ width: "64px", height: "64px", marginBottom: "8px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "bold", color: "#fff", marginBottom: "8px" }}>Respiratory Protection</span>
                  <div className="radio-group">
                    <label><input type="radio" name="respiratory_protection" value="1" checked={formData.respiratory_protection === "1"} onChange={(e) => handleFieldChange("respiratory_protection", e.target.value)} /> Yes</label>
                    <label><input type="radio" name="respiratory_protection" value="0" checked={formData.respiratory_protection === "0"} onChange={(e) => handleFieldChange("respiratory_protection", e.target.value)} /> No</label>
                  </div>
                </div>

              </div>
            </div>

            <div className="df-field" style={{ marginTop: "16px" }}>
              <label className="df-label">Other PPE</label>
              <textarea
                className="df-textarea"
                rows={2}
                placeholder="Enter other PPE details..."
                value={formData.other_ppe}
                onChange={(e) => handleFieldChange("other_ppe", e.target.value)}
              />
            </div>

            <div className="df-field" style={{ marginTop: "16px" }}>
              <label className="df-label">Number of workers involved</label>
              <input
                type="number"
                className="df-input"
                placeholder="Enter number of workers"
                value={formData.peopleinvalidcount}
                onChange={(e) => handleFieldChange("peopleinvalidcount", e.target.value)}
              />
            </div>

            <div className="df-field" style={{ marginTop: "16px" }}>
              <label className="df-label">Note</label>
              <textarea
                className="df-textarea"
                rows={3}
                placeholder="Notes...."
                value={formData.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="df-footer" style={{ marginTop: "24px" }}>
            <button
              type="button"
              className="nr-btn nr-btn--ghost"
              onClick={() => setIsnewrequestcreated(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="nr-btn nr-btn--ghost"
              style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb", boxShadow: "0 0 18px rgba(37, 99, 235, 0.2)" }}
              onClick={(e) => handleSubmit(e, "Hold")}
            >
              Change to Hold
            </button>
            <button
              type="button"
              className="nr-btn nr-btn--primary"
              onClick={(e) => handleSubmit(e, "Saved")}
            >
              Save
            </button>
          </div>
        </form>
      </div>

    );
  }

  return (
    <div className="dept-page">
      <div className="dept-page-header">
        <div className="dept-page-header__left">
          <h1 className="dept-page-title">New Work Permit Request</h1>
        </div>
        {selectedRooms.length > 0 && (
          <div className="butns-grp-back">
            <button
              className="nr-btn nr-btn--primary"
              onClick={() => setIsnewrequestcreated(true)}
            >
              Continue to Form →
            </button>
          </div>
        )}
      </div>

      <div className="dept-table-card">
        <div className="df-form">
          <div className="df-grid">
            <div className="df-field">
              <label className="df-label">Building</label>
              <select
                className="df-select"
                value={building}
                onChange={(e) => {
                  setBuilding(e.target.value);
                  setLevel("");
                  setSelectedRooms([]);
                  setSelectedZone(null);
                }}
              >
                <option value="">Select Building</option>
                {BUILDINGS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="df-field">
              <label className="df-label">Level</label>
              <select
                className="df-select"
                value={level}
                disabled={!building}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setSelectedRooms([]);
                  setSelectedZone(null);
                }}
              >
                <option value="">Select Level</option>
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {selectedPdf && (
        <div style={{ position: "relative" }}>
          <FloorDrawing
            pdf={selectedPdf}
            zones={selectedZones}
            level={level}
            selectedRooms={selectedRooms}
            onRoomsSelected={handleRoomsSelected}
          />
          {selectedRooms.length > 0 && (
            <div className="drawing-floating-action" style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
              <button
                className="nr-btn nr-btn--primary"
                style={{ height: "46px", padding: "0 32px", fontSize: "15px" }}
                onClick={() => setIsnewrequestcreated(true)}
              >
                Continue with {selectedRooms.length} Room{selectedRooms.length > 1 ? "s" : ""} selected →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NewRequest;