import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Upload,
  Clock3,
  Users,
  Trophy,
  Code2,
  Shield,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react";

import Navbar from "./components/Navbar";
import "./Web3ProblemStatement.css";

// ============================================================
// WEB3 GOOGLE DRIVE LINKS
// ============================================================
// Replace these two links with your actual Google Drive links.
//
// IMPORTANT:
// Keep the links inside the quotes.
// Example:
// const PROBLEM_STATEMENT_LINK =
//   "https://drive.google.com/file/d/XXXXXXXX/view";
//
// ============================================================

const PROBLEM_STATEMENT_LINK = "https://drive.google.com/drive/folders/19Qs5ttl9mZJuOH-8C7I6RSK1OpDpieDt";

const SUBMIT_PPT_LINK = "https://docs.google.com/forms/d/1V-JBXqtYZSJX2uaoloi85NkIeE4iL1AmERxPmh0Nw4A/edit?pli=1";


const Web3ProblemStatement = () => {
  const navigate = useNavigate();

  const openDriveLink = (url) => {
    if (!url || url.startsWith("YOUR_")) {
      alert("Google Drive link has not been added yet.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="web3-page">

      {/* =====================================================
          EXISTING WEBSITE NAVBAR
      ====================================================== */}
      <Navbar visible={true} />


      {/* =====================================================
          BACKGROUND EFFECTS
      ====================================================== */}
      <div className="web3-bg-grid" />
      <div className="web3-red-glow web3-glow-one" />
      <div className="web3-red-glow web3-glow-two" />


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="web3-main">

        {/* BACK BUTTON */}
        <div className="web3-topbar">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="web3-back-button"
          >
            <ArrowLeft size={18} />
            <span>BACK TO EVENTS</span>
          </button>

          <div className="web3-classification">
            <span className="classification-dot" />
            CLASSIFIED // DOSSIER 03
          </div>
        </div>


        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="web3-hero-card">

          <div className="web3-corner web3-corner-tl" />
          <div className="web3-corner web3-corner-tr" />
          <div className="web3-corner web3-corner-bl" />
          <div className="web3-corner web3-corner-br" />

          <div className="web3-hero-content">

            <div className="web3-overline">
              // CLASSIFIED DOSSIER
            </div>

            <h1 className="web3-title">
              WEB<span>3</span> HACKATHON
            </h1>

            <div className="web3-title-line">
              <span />
              DECENTRALIZE THE FUTURE
              <span />
            </div>

            <p className="web3-hero-description">
              Build the decentralized future. Identify real-world problems,
              design innovative Web3 solutions, and transform your ideas into
              working decentralized applications.
            </p>


            {/* EVENT INFO */}
            <div className="web3-info-grid">

              <div className="web3-info-card">
                <div className="web3-info-icon">
                  <Clock3 size={21} />
                </div>

                <div>
                  <span>DURATION</span>
                  <strong>6 HOURS</strong>
                </div>
              </div>


              <div className="web3-info-card">
                <div className="web3-info-icon">
                  <Users size={21} />
                </div>

                <div>
                  <span>FORMAT</span>
                  <strong>TEAM HACKATHON</strong>
                </div>
              </div>


              <div className="web3-info-card">
                <div className="web3-info-icon">
                  <Trophy size={21} />
                </div>

                <div>
                  <span>PRIZE POOL</span>
                  <strong>₹3,000</strong>
                </div>
              </div>


              <div className="web3-info-card">
                <div className="web3-info-icon">
                  <Code2 size={21} />
                </div>

                <div>
                  <span>DOMAIN</span>
                  <strong>WEB3</strong>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            ABOUT + OBJECTIVE
        ====================================================== */}
        <section className="web3-two-column">

          {/* ABOUT */}
          <div className="web3-panel web3-about-panel">

            <div className="web3-section-label">
              // ABOUT THE HACKATHON
            </div>

            <h2>
              BUILD.
              <br />
              DECENTRALIZE.
              <br />
              <span>DISRUPT.</span>
            </h2>

            <p>
              The Web3 Hackathon challenges participants to identify
              meaningful real-world problems and develop decentralized
              solutions using blockchain and Web3 technologies.
            </p>

            <p>
              Teams are expected to move from problem identification to
              solution architecture, implementation, and final presentation.
            </p>

            <p>
              Your project should demonstrate how decentralized technology
              provides a meaningful advantage over traditional centralized
              approaches.
            </p>

          </div>


          {/* OBJECTIVE */}
          <div className="web3-panel web3-objective-panel">

            <div className="web3-section-label">
              // MISSION OBJECTIVE
            </div>

            <div className="web3-objectives">

              <div className="web3-objective-item">
                <div className="objective-number">
                  01
                </div>

                <div className="objective-icon">
                  <Target size={21} />
                </div>

                <div>
                  <h3>IDENTIFY</h3>
                  <p>
                    Solve a meaningful real-world problem.
                  </p>
                </div>
              </div>


              <div className="web3-objective-item">
                <div className="objective-number">
                  02
                </div>

                <div className="objective-icon">
                  <Shield size={21} />
                </div>

                <div>
                  <h3>DECENTRALIZE</h3>
                  <p>
                    Use blockchain and decentralized architecture.
                  </p>
                </div>
              </div>


              <div className="web3-objective-item">
                <div className="objective-number">
                  03
                </div>

                <div className="objective-icon">
                  <Rocket size={21} />
                </div>

                <div>
                  <h3>BUILD</h3>
                  <p>
                    Create a working prototype.
                  </p>
                </div>
              </div>


              <div className="web3-objective-item">
                <div className="objective-number">
                  04
                </div>

                <div className="objective-icon">
                  <Lightbulb size={21} />
                </div>

                <div>
                  <h3>PRESENT</h3>
                  <p>
                    Demonstrate and pitch your solution.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CHALLENGE SECTION
        ====================================================== */}
        <section className="web3-challenge-section">

          <div className="web3-section-label">
            // OPERATION PARAMETERS
          </div>

          <div className="web3-challenge-header">

            <div>
              <h2>
                THE <span>MISSION</span>
              </h2>

              <p>
                Your squad must identify a problem where decentralized
                technology creates genuine value.
              </p>
            </div>

            <div className="web3-red-stamp">
              WEB3
              <small>OPERATION</small>
            </div>

          </div>


          <div className="web3-mission-grid">

            <div className="mission-card">
              <div className="mission-number">01</div>
              <h3>PROBLEM</h3>
              <p>
                Identify a real-world challenge that can benefit from
                decentralized technology.
              </p>
            </div>


            <div className="mission-card">
              <div className="mission-number">02</div>
              <h3>ARCHITECTURE</h3>
              <p>
                Design a secure and scalable decentralized solution.
              </p>
            </div>


            <div className="mission-card">
              <div className="mission-number">03</div>
              <h3>IMPLEMENTATION</h3>
              <p>
                Develop a functional prototype demonstrating your concept.
              </p>
            </div>


            <div className="mission-card">
              <div className="mission-number">04</div>
              <h3>PITCH</h3>
              <p>
                Present the problem, technology, solution and impact.
              </p>
            </div>

          </div>

        </section>


        {/* =====================================================
            DELIVERABLES
        ====================================================== */}
        <section className="web3-deliverables">

          <div className="web3-section-label">
            // REQUIRED DELIVERABLES
          </div>

          <div className="deliverables-grid">

            <div className="deliverable">
              <span>01</span>
              <FileText size={20} />
              <div>
                <h3>PROBLEM STATEMENT</h3>
                <p>
                  Clearly define the real-world problem being solved.
                </p>
              </div>
            </div>


            <div className="deliverable">
              <span>02</span>
              <Code2 size={20} />
              <div>
                <h3>TECHNICAL SOLUTION</h3>
                <p>
                  Explain the Web3 architecture and implementation.
                </p>
              </div>
            </div>


            <div className="deliverable">
              <span>03</span>
              <Rocket size={20} />
              <div>
                <h3>WORKING PROTOTYPE</h3>
                <p>
                  Demonstrate a functional implementation of your idea.
                </p>
              </div>
            </div>


            <div className="deliverable">
              <span>04</span>
              <Lightbulb size={20} />
              <div>
                <h3>FINAL PITCH</h3>
                <p>
                  Present your solution and explain its impact.
                </p>
              </div>
            </div>

          </div>

        </section>


        {/* =====================================================
            GOOGLE DRIVE ACTIONS
        ====================================================== */}
        <section className="web3-action-section">

          <div className="web3-action-header">
            <div className="web3-section-label">
              // ACCESS TERMINAL
            </div>

            <h2>
              READY FOR <span>DEPLOYMENT?</span>
            </h2>

            <p>
              Access the official problem statement or submit your team's
              presentation deck.
            </p>
          </div>


          <div className="web3-action-buttons">

            {/* PROBLEM STATEMENT */}
            <button
              type="button"
              className="web3-action-button web3-outline-button"
              onClick={() => openDriveLink(PROBLEM_STATEMENT_LINK)}
            >
              <div className="action-button-icon">
                <FileText size={23} />
              </div>

              <div>
                <strong>VIEW PROBLEM STATEMENT</strong>
                <small>OPEN GOOGLE DRIVE</small>
              </div>

              <ExternalLink size={18} />
            </button>


            {/* SUBMIT PPT */}
            <button
              type="button"
              className="web3-action-button web3-submit-button"
              onClick={() => openDriveLink(SUBMIT_PPT_LINK)}
            >
              <div className="action-button-icon">
                <Upload size={23} />
              </div>

              <div>
                <strong>SUBMIT YOUR PPT</strong>
                <small>UPLOAD TO GOOGLE FORM</small>
              </div>

              <ExternalLink size={18} />
            </button>

          </div>


          {/* REGISTER */}
          <Link
            to="/registration"
            className="web3-register-button"
          >
            <span>REGISTER FOR THIS EVENT NOW</span>
            <Rocket size={20} />
          </Link>

        </section>


        {/* FOOTER */}
        <footer className="web3-footer">
          <span>CYBERPUNK // OPERATION 2026</span>
          <span>WEB3 HACKATHON // CLASSIFIED</span>
        </footer>

      </main>

    </div>
  );
};


export default Web3ProblemStatement;