import React, { useEffect, useState } from "react";
import "./Gallery.css";

const galleryImages = [
  "/assets/gallery/1.jpg",
  "/assets/gallery/2.jpg",
  "/assets/gallery/3.jpg",
  "/assets/gallery/4.jpg",
  "/assets/gallery/5.jpg",
  "/assets/gallery/6.jpg",
];

const evidenceData = [
  {
    id: "001",
    title: "THE OPERATION BEGINS",
    location: "CYBERPUNK HQ",
    status: "VERIFIED",
    type: "MISSION",
  },
  {
    id: "002",
    title: "THE CREW ASSEMBLES",
    location: "MAIN HALL",
    status: "CLASSIFIED",
    type: "CREW",
  },
  {
    id: "003",
    title: "THE FIRST MOVE",
    location: "EVENT ZONE",
    status: "VERIFIED",
    type: "ACTION",
  },
  {
    id: "004",
    title: "INSIDE THE OPERATION",
    location: "CYBERPUNK ARENA",
    status: "TOP SECRET",
    type: "EVIDENCE",
  },
  {
    id: "005",
    title: "THE CROWD",
    location: "MAIN STAGE",
    status: "VERIFIED",
    type: "OPERATION",
  },
  {
    id: "006",
    title: "MISSION COMPLETE",
    location: "FINAL ZONE",
    status: "ARCHIVED",
    type: "FINAL",
  },
];

function Gallery() {
  const [selected, setSelected] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [scan, setScan] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setScan(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.background = "#050505";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const openEvidence = (index) => {
    setSelected(index);
  };

  const closeEvidence = () => {
    setSelected(null);
  };

  return (
    <div className="heist-gallery">

      {/* ================= BACKGROUND ================= */}

      <div className="gallery-noise"></div>
      <div className="gallery-grid"></div>
      <div className="red-light red-light-one"></div>
      <div className="red-light red-light-two"></div>

      {/* ================= LOADING SCREEN ================= */}

      {scan && (
        <div className="archive-loader">
          <div className="loader-content">

            <div className="loader-mask">◉</div>

            <div className="loader-title">
              ACCESSING ARCHIVE
            </div>

            <div className="loader-subtitle">
              CYBERPUNK // CLASSIFIED DATABASE
            </div>

            <div className="loader-bar">
              <span></span>
            </div>

            <div className="loader-status">
              DECRYPTING EVIDENCE...
            </div>

          </div>
        </div>
      )}

      {/* ================= HERO ================= */}

      <section className="gallery-hero">

        <div className="hero-code">
          ARCHIVE // 2026 // 001
        </div>

        <div className="hero-line"></div>

        <p className="classified-label">
          <span></span>
          CLASSIFIED ARCHIVES
          <span></span>
        </p>

        <h1>
          THE <strong>HEIST</strong>
          <br />
          <span>FILES</span>
        </h1>

        <p className="hero-description">
          A classified collection of moments captured
          during the operation.
        </p>

        <div className="operation-status">
          <span className="status-dot"></span>
          OPERATION STATUS:
          <b> COMPLETED</b>
        </div>

        <div className="scroll-indicator">
          <span></span>
          SCROLL TO ACCESS EVIDENCE
        </div>

      </section>

      {/* ================= EVIDENCE WALL ================= */}

      <section className="evidence-section">

        <div className="section-header evidence-heading">

          <div>
            <span className="section-number">
              02 //
            </span>

            <h2>
              EVIDENCE
              <span>WALL</span>
            </h2>
          </div>

          <p>
            SELECT AN EVIDENCE FILE
            <br />
            TO ACCESS CLASSIFIED DATA
          </p>

        </div>

        <div className="evidence-wall">

          <div className="wall-stamp">
            TOP SECRET
          </div>

          <div className="wall-title">
            OPERATION
            <strong>CYBERPUNK</strong>
          </div>

          {/* Red connecting lines */}

          <div className="evidence-string string-one"></div>
          <div className="evidence-string string-two"></div>
          <div className="evidence-string string-three"></div>

          {galleryImages.map((image, index) => {

            const evidence = evidenceData[index];

            return (
              <div
                className={`evidence-card card-${index + 1}`}
                key={image}
              >

                <div className="pin"></div>

                <div className="evidence-photo">

                  <img
                    src={image}
                    alt={evidence.title}
                    loading="lazy"
                  />

                  <div className="photo-glitch"></div>

                </div>

                <div className="evidence-info">

                  <div className="evidence-id">
                    EVIDENCE #{evidence.id}
                  </div>

                  <h3>
                    {evidence.title}
                  </h3>

                  <div className="evidence-meta">
                    <span>
                      {evidence.location}
                    </span>

                    <span className="verified">
                      ● {evidence.status}
                    </span>
                  </div>
                 </div>
                </div>
            );
          })}

        </div>

      </section>

      {/* ================= CLASSIFIED TIMELINE ================= */}

      <section className="timeline-section">

        <div className="section-header">

          <div>
            <span className="section-number">
              03 //
            </span>

            <h2>
              OPERATION
              <span>TIMELINE</span>
            </h2>
          </div>

        </div>

        <div className="timeline">

          <div className="timeline-line"></div>

          {[
            ["09:00", "THE CREW ARRIVES", "MISSION INITIATED"],
            ["10:30", "THE OPERATION BEGINS", "ACCESS GRANTED"],
            ["12:00", "FULL OPERATION", "ALL SYSTEMS ACTIVE"],
            ["15:30", "FINAL PHASE", "MISSION COMPLETE"],
          ].map((item, index) => (

            <div
              className="timeline-item"
              key={item[0]}
            >

              <div className="timeline-dot">
                {index + 1}
              </div>

              <div className="timeline-time">
                {item[0]}
              </div>

              <div className="timeline-content">

                <span>
                  {item[2]}
                </span>

                <h3>
                  {item[1]}
                </h3>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= FINAL ================= */}

      <section className="archive-complete">

        <div className="complete-lines"></div>

        <span className="section-number">
          // END OF ARCHIVE //
        </span>

        <h2>
          MISSION
          <strong>COMPLETE</strong>
        </h2>

        <p>
          ALL EVIDENCE HAS BEEN SUCCESSFULLY ARCHIVED.
        </p>

        <div className="complete-stamp">
          CYBERPUNK 2026
          <br />
          ARCHIVE VERIFIED
        </div>

      </section>

      {/* ================= MODAL ================= */}

      {selected !== null && (
        <div
          className="evidence-modal"
          onClick={closeEvidence}
        >

          <div
            className="modal-file"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={closeEvidence}
            >
              ×
            </button>

            <div className="modal-header">
              <span>
                CLASSIFIED FILE
              </span>

              <span>
                EVIDENCE #{evidenceData[selected].id}
              </span>
            </div>

            <div className="modal-image">

              <img
                src={galleryImages[selected]}
                alt={evidenceData[selected].title}
              />

              <div className="modal-scanline"></div>

            </div>

            <div className="modal-details">

              <span className="modal-type">
                {evidenceData[selected].type}
              </span>

              <h2>
                {evidenceData[selected].title}
              </h2>

              <div className="detail-grid">

                <div>
                  <small>LOCATION</small>
                  <strong>
                    {evidenceData[selected].location}
                  </strong>
                </div>

                <div>
                  <small>DATE</small>
                  <strong>
                    10 SEPTEMBER 2026
                  </strong>
                </div>

                <div>
                  <small>STATUS</small>
                  <strong className="red">
                    {evidenceData[selected].status}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Gallery;