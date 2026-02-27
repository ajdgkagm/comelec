import { useState } from "react";
import { useComelecRecords } from "../contexts/comelec-record-context";
import type { ComelecRecord } from "../contexts/comelec-record-context";

// Modal component
function ResultModal({
  records,
  onClose,
}: {
  records: ComelecRecord[];
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ margin: 0 }}>Verification Results</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        {records.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#555",
              fontWeight: 500,
            }}
          >
            Registration not found.
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {records.map((r) => (
              <div
                key={r._id ?? Math.random()}
                style={{
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <strong style={{ fontSize: "16px" }}>
                  {r.firstName} {r.middleName} {r.lastName} 
                </strong>
                <span>Birth Date: {r.birthDate}</span>
                <span>
                  Location: {r.provincePlace}, {r.cityMunicipality}
                </span>
                <span>Precinct: {r.precintNumber}</span>
                <span>Suffix: {r.suffix}</span>
                <span>
                  Status:{" "}
                  <strong
                    style={{
                      color:
                        r.status?.toLowerCase() === "active"
                          ? "green"
                          : r.status?.toLowerCase() === "inactive"
                          ? "red"
                          : "gray",
                    }}
                  >
                    {r.status ?? "Unknown"}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RegistrationForm(): JSX.Element {
  const { records } = useComelecRecords();
  const [started, setStarted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [matchedRecords, setMatchedRecords] = useState<ComelecRecord[]>([]);

  const handleContinue = async () => {
    if (!firstName || !lastName) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/verify?firstName=${encodeURIComponent(
          firstName
        )}&lastName=${encodeURIComponent(lastName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to verify");
      }

      const data = await response.json();

      setMatchedRecords(data);
      setShowModal(true);
    } catch (error) {
      console.error("Verification error:", error);
      setMatchedRecords([]);
      setShowModal(true);
    }
  };

  return (
    <div className="card verification-card">
      {!started ? (
        <div className="start-state">
          <span className="badge">COMELEC</span>
          <h3>Voter Information</h3>
          <p className="muted">
            Verify your registration status before election day.
          </p>
          <button className="primary full" onClick={() => setStarted(true)}>
            Check Information
          </button>
        </div>
      ) : (
        <>
          <div className="form-header">
            <h3>Verify Registration</h3>
            <p className="muted">Enter your details exactly as registered.</p>
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Dela Cruz"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="secondary" onClick={() => setStarted(false)}>
              Back
            </button>
            <button className="primary" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </>
      )}

      {showModal && (
        <ResultModal
          records={matchedRecords}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}