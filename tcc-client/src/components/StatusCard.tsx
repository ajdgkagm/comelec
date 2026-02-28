import { useState, type ReactElement } from "react";
import { Edit3, ShieldCheck, Search } from "lucide-react";

/* ===== Types ===== */
type StepKey = "enter" | "verify" | "find";

/* ===== Instructions Data ===== */
const stepInstructions: Record<
  StepKey,
  { title: string; description: string; steps: string[] }
> = {
  enter: {
    title: "Enter Your Details",
    description: "Provide the required information to continue.",
    steps: [
      "Enter your full legal name.",
      "Provide your date of birth.",
      "Review all details for accuracy.",
    ],
  },
  verify: {
    title: "Verify Your Identity",
    description: "Confirm your identity to keep your data secure.",
    steps: [
      "Check the information you submitted.",
      "Confirm using the verification prompt.",
      "Wait for confirmation approval.",
    ],
  },
  find: {
    title: "Find Your Precinct",
    description: "Locate your assigned precinct easily.",
    steps: [
      "Click the search button.",
      "Review the precinct results shown.",
      "Save your precinct for future reference.",
    ],
  },
};

/* ===== Modal Component ===== */
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: (typeof stepInstructions)[StepKey];
};

function Modal({ isOpen, onClose, data }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{data.title}</h2>
        <p className="modal-desc">{data.description}</p>
        <ol>
          {data.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ===== Main Component ===== */
export default function HowItWorksCard(): ReactElement {
  const [activeStep, setActiveStep] = useState<StepKey | null>(null);

  return (
    <>
      <div className="card highlight">
        <h3>How It Works</h3>

        <div className="how-steps">
          <div
            className="how-step clickable"
            onClick={() => setActiveStep("enter")}
          >
            <div className="how-icon blue">
              <Edit3 size={22} />
            </div>
            <p className="how-title">Enter Details</p>
          </div>

          <div
            className="how-step clickable"
            onClick={() => setActiveStep("verify")}
          >
            <div className="how-icon yellow">
              <ShieldCheck size={22} />
            </div>
            <p className="how-title">Verify Identity</p>
          </div>

          <div
            className="how-step clickable"
            onClick={() => setActiveStep("find")}
          >
            <div className="how-icon red">
              <Search size={22} />
            </div>
            <p className="how-title">Find Precinct</p>
          </div>
        </div>
      </div>

      {activeStep && (
        <Modal
          isOpen
          onClose={() => setActiveStep(null)}
          data={stepInstructions[activeStep]}
        />
      )}
    </>
  );
}

/* ===== Minimal CSS (add to your CSS file) =====
.clickable { cursor: pointer; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
}

.modal-desc { color: #555; margin-bottom: 12px; }

.modal-close {
  margin-top: 16px;
  background: #0038a8;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}
=============================================== */
