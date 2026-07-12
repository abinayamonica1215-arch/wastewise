import { useState } from "react";

function IndustryDetailsForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [industryType, setIndustryType] = useState("Manufacturing");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [gps, setGps] = useState(null);
  const [locating, setLocating] = useState(false);

  function detectLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setGps({ lat: 13.0827, lon: 80.2707 });
        setLocating(false);
      }
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name,
      industryType,
      address,
      contactPerson,
      mobile,
      gps: gps || { lat: 13.0827, lon: 80.2707 },
    });
  }

  return (
    <div className="page">
      <h2>Industry / Institution Details</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Industry / Institution Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Industry Type
          <select value={industryType} onChange={(e) => setIndustryType(e.target.value)}>
            <option>Manufacturing</option>
            <option>Food Processing</option>
            <option>Textile</option>
            <option>Healthcare / Hospital</option>
            <option>Educational Institution</option>
            <option>IT / Office Campus</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Address
          <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          Contact Person
          <input
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
        </label>
        <label>
          Mobile Number
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9]{10}"
            placeholder="10-digit mobile number"
            required
          />
        </label>
        <label>
          GPS Location
          <button type="button" onClick={detectLocation}>
            {locating
              ? "Detecting..."
              : gps
              ? `📍 ${gps.lat.toFixed(4)}, ${gps.lon.toFixed(4)} (tap to redetect)`
              : "Detect My Location"}
          </button>
        </label>
        <button type="submit">Continue to Waste Analysis →</button>
      </form>
    </div>
  );
}

export default IndustryDetailsForm;