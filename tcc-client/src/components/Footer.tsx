import {
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import "./Footer.css"
import type { ReactElement } from "react";

export default function Footer(): ReactElement {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-col">
          <h3>Commission on Elections</h3>

          <p className="footer-item">
            <MapPin size={16} />
            <a
              href="https://www.google.com/maps/place/Palacio+del+Gobernador+Bldg.,+Gen.+Luna+St.,+Intramuros,+Manila"
              target="_blank"
              rel="noopener noreferrer"
            >
              Palacio del Gobernador Bldg., Gen. Luna St., Intramuros, Manila
            </a>
          </p>

          <p className="footer-item">
            <Phone size={16} />
            <a href="tel:+6325341726">+63 2 534 1726 (COMELEC Contact)</a>
          </p>

          <div className="footer-badges">
            <span className="badge">W3C XHTML 1.0</span>
            <span className="badge accessible">Accessibility Certified</span>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="footer-col">
          <h3>Sitemap</h3>
          <div className="sitemap">
            <ul>
              <li>
                <a href="https://www.comelec.gov.ph/" target="_blank" rel="noopener noreferrer">
                  Home
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=About" target="_blank" rel="noopener noreferrer">
                  About COMELEC
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=SpecialProjects" target="_blank" rel="noopener noreferrer">
                  Special Projects
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=Procurement" target="_blank" rel="noopener noreferrer">
                  Procurement
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=Employment" target="_blank" rel="noopener noreferrer">
                  Employment
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=Contact" target="_blank" rel="noopener noreferrer">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/transparency-seal" target="_blank" rel="noopener noreferrer">
                  Transparency Seal
                </a>
              </li>
            </ul>

            <ul>
              <li>
                <a href="https://www.comelec.gov.ph/?r=VoterRegistration" target="_blank" rel="noopener noreferrer">
                  Voter Registration
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=Elections" target="_blank" rel="noopener noreferrer">
                  Elections
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=Plebiscites" target="_blank" rel="noopener noreferrer">
                  Plebiscites
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=OverseasVoting" target="_blank" rel="noopener noreferrer">
                  Overseas Voting
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=CampaignFinance" target="_blank" rel="noopener noreferrer">
                  Campaign Finance
                </a>
              </li>
              <li>
                <a href="https://www.comelec.gov.ph/?r=ResourceCenter" target="_blank" rel="noopener noreferrer">
                  Resource Center
                </a>
              </li>
              <li>
                <a href="https://internal.comelec.gov.ph/" target="_blank" rel="noopener noreferrer">
                  Internal Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT */}
        <div className="footer-col">
          <h3>Share Us</h3>
          <ul className="socials">
            <li>
              <a href="https://www.facebook.com/comelec" target="_blank" rel="noopener noreferrer">
                <Facebook /> Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/comelec/" target="_blank" rel="noopener noreferrer">
                <Instagram /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@COMELECOfficial" target="_blank" rel="noopener noreferrer">
                <Youtube /> YouTube
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@comelec" target="_blank" rel="noopener noreferrer">
                <span className="tiktok">🎵</span> TikTok
              </a>
            </li>
            <li>
              <a href="https://twitter.com/COMELEC_PH" target="_blank" rel="noopener noreferrer">
                <Twitter /> Twitter / X
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Commission on Elections. All Rights Reserved.
      </div>
    </footer>
  );
}