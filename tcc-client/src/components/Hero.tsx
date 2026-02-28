import type { ReactElement } from "react";

export default function Hero(): ReactElement {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Your Vote, Your Voice.</h1>
        <p>National & Local Elections 2025</p>

        {/* <div className="countdown">
          <span><strong>124</strong> Days</span>
          <span>05</span>
          <span>30</span>
          <span>15</span>
        </div>

        <button className="primary">Register / Verify</button> */}
      </div>
    </section>
  );
}
