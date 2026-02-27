import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useComelecRecords } from "../../contexts/comelec-record-context";
// import Sidenav from "../../components/Sidenav";
import "./RecordForm.css";

export const RecordForm = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [provincePlace, setProvincePlace] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [precintNumber, setPrecintNumber] = useState("");
  const [status, setStatus] = useState("");
  const [suffix, setSuffix] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { addRecord } = useComelecRecords();
  const { user } = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newRecord = {
      userId: user?.id ?? "",
      date: new Date(),
      firstName,
      middleName,
      lastName,
      birthDate,
      provincePlace,
      cityMunicipality,
      precintNumber,
      status,
      suffix,
    };

    addRecord(newRecord);
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);

    setFirstName("");
    setMiddleName("");
    setLastName("");
    setBirthDate("");
    setProvincePlace("");
    setCityMunicipality("");
    setPrecintNumber("");
    setStatus("");
    setSuffix("");
  };

  return (
    <div className="dashboard-container">
      {/* <Sidenav /> */}

      <main className="dashboard-main">
        {submitted && (
          <div className="success-alert">✅ Record Added Successfully!</div>
        )}

        <div className="form-card">
          <h2 className="form-title">Add Voter Record</h2>
          <p className="form-desc">
            Commission on Elections – Official Registration Portal
          </p>

          <form onSubmit={handleSubmit} className="animated-form">
            <div className="input-field">
              <input
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>First Name</label>
            </div>
             <div className="input-field">
              <input
                required
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
              <label>Middle Name</label>
            </div>

            <div className="input-field">
              <input
                required
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Last Name</label>
            </div>
            <div className="input-field">
              <input
                required
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <label>Birth Date</label>
            </div>

            <div className="input-field">
              <input
                required
                type="text"
                value={precintNumber}
                onChange={(e) => setPrecintNumber(e.target.value)}
              />
              <label>Precinct Number</label>
            </div>
            <div className="input-field">
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value=""></option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <label>Status</label>
            </div>

            <div className="input-field">
              <input
                required
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
              />
              <label>Suffix</label>
            </div>

            <div className="input-field">
              <select
                required
                value={provincePlace}
                onChange={(e) => setProvincePlace(e.target.value)}
              >
                <option value=""></option>
                <option value="Metro Manila">Metro Manila</option>
                <option value="Cebu">Cebu</option>
                <option value="Davao">Davao</option>
              </select>
              <label>Province</label>
            </div>

            <div className="input-field">
              <select
                required
                value={cityMunicipality}
                onChange={(e) => setCityMunicipality(e.target.value)}
              >
                <option value=""></option>
                <option value="Quezon City">Quezon City</option>
                <option value="Cebu City">Cebu City</option>
                <option value="Davao City">Davao City</option>
              </select>
              <label>City / Municipality</label>
            </div>

            <button type="submit" className="btn-submit">
              Add Record
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
