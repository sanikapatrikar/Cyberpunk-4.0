import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./Gallery.css";

const galleryImages = [
  "/assets/gallery/1.jpg",
  "/assets/gallery/2.jpg",
  "/assets/gallery/3.jpg",
  "/assets/gallery/4.jpg",
  "/assets/gallery/5.jpg",
  "/assets/gallery/6.jpg",
];

export default function Gallery() {
  const mountRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const container = mountRef.current;

    if (!container) return;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    container.appendChild(renderer.domElement);

    // Main globe
    const globe = new THREE.Group();
    scene.add(globe);

    // ------------------------------------------------
    // GALLERY PHOTO TILES
    // ------------------------------------------------

    const radius = 3.4;

    const textureLoader = new THREE.TextureLoader();

    galleryImages.forEach((image, index) => {
      const texture = textureLoader.load(image);

      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const geometry = new THREE.PlaneGeometry(
        1.15,
        0.82
      );

      const photo = new THREE.Mesh(
        geometry,
        material
      );

      // Fibonacci sphere distribution
      const phi =
        Math.acos(
          -1 +
            (2 * (index + 0.5)) /
              galleryImages.length
        );

      const theta =
        Math.PI *
        (1 + Math.sqrt(5)) *
        index;

      const x =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      const y =
        radius *
        Math.cos(phi);

      const z =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      const position = new THREE.Vector3(
        x,
        y,
        z
      );

      photo.position.copy(position);

      // Make each photo face outward
      const normal = position.clone().normalize();

      photo.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );

      photo.userData.image = image;

      globe.add(photo);
    });

    // ------------------------------------------------
    // RED INNER GLOW
    // ------------------------------------------------

    const glowGeometry =
      new THREE.SphereGeometry(3.25, 64, 64);

    const glowMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x320000,
        transparent: true,
        opacity: 0.28,
        side: THREE.BackSide,
      });

    const glowSphere = new THREE.Mesh(
      glowGeometry,
      glowMaterial
    );

    globe.add(glowSphere);

    // ------------------------------------------------
    // LATITUDE / LONGITUDE WIRES
    // ------------------------------------------------

    const wireGeometry =
      new THREE.SphereGeometry(
        3.48,
        32,
        18
      );

    const wireMaterial =
      new THREE.MeshBasicMaterial({
        color: 0x550000,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });

    const wireSphere = new THREE.Mesh(
      wireGeometry,
      wireMaterial
    );

    globe.add(wireSphere);

    // ------------------------------------------------
    // BACKGROUND PARTICLES
    // ------------------------------------------------

    const particleCount = 700;

    const particlePositions = new Float32Array(
      particleCount * 3
    );

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] =
        (Math.random() - 0.5) * 25;

      particlePositions[i * 3 + 1] =
        (Math.random() - 0.5) * 18;

      particlePositions[i * 3 + 2] =
        (Math.random() - 0.5) * 15;
    }

    const particleGeometry =
      new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        particlePositions,
        3
      )
    );

    const particleMaterial =
      new THREE.PointsMaterial({
        color: 0x777777,
        size: 0.025,
        transparent: true,
        opacity: 0.7,
      });

    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    );

    scene.add(particles);

    // ------------------------------------------------
    // MOUSE INTERACTION
    // ------------------------------------------------

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect =
        container.getBoundingClientRect();

      mouseX =
        ((event.clientX - rect.left) /
          rect.width -
          0.5) *
        2;

      mouseY =
        ((event.clientY - rect.top) /
          rect.height -
          0.5) *
        2;
    };

    container.addEventListener(
      "mousemove",
      handleMouseMove
    );

    // ------------------------------------------------
    // CLICK DETECTION
    // ------------------------------------------------

    const raycaster =
      new THREE.Raycaster();

    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect =
        container.getBoundingClientRect();

      mouse.x =
        ((event.clientX - rect.left) /
          rect.width) *
          2 -
        1;

      mouse.y =
        -(
          ((event.clientY - rect.top) /
            rect.height) *
            2 -
          1
        );

      raycaster.setFromCamera(
        mouse,
        camera
      );

      const intersects =
        raycaster.intersectObjects(
          globe.children,
          true
        );

      const photo = intersects.find(
        (item) => item.object.userData.image
      );

      if (photo) {
        setSelectedImage(
          photo.object.userData.image
        );
      }
    };

    container.addEventListener(
      "click",
      handleClick
    );

    // ------------------------------------------------
    // ANIMATION
    // ------------------------------------------------

    let animationFrame;

    const animate = () => {
      animationFrame =
        requestAnimationFrame(animate);

      // CONSTANT ROTATION SPEED
      globe.rotation.y += 0.0018;

      // Very subtle vertical movement
      globe.rotation.x =
        Math.sin(Date.now() * 0.00025) *
        0.035;

      // Mouse influence
      globe.rotation.y +=
        mouseX * 0.0005;

      globe.rotation.x +=
        mouseY * 0.0003;

      particles.rotation.y += 0.00015;

      renderer.render(
        scene,
        camera
      );
    };

    animate();

    // ------------------------------------------------
    // RESPONSIVE
    // ------------------------------------------------

    const handleResize = () => {
      if (!container) return;

      const width =
        container.clientWidth;

      const height =
        container.clientHeight;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      container.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      container.removeEventListener(
        "click",
        handleClick
      );

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <section
      className="gallery-section"
      id="gallery"
    >
      <div className="gallery-heading">
        <div className="gallery-eyebrow">
          CLASSIFIED ARCHIVE
        </div>

        <h2>
          THE <span>GALLERY</span>
        </h2>

        <p>
          VISUAL RECORDS FROM THE OPERATION
        </p>
      </div>

      <div
        ref={mountRef}
        className="gallery-globe"
      />

      <div className="gallery-status">
        <span className="status-dot" />
        ARCHIVE // LIVE
      </div>

      {selectedImage && (
        <div
          className="gallery-modal"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
            className="gallery-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="gallery-close"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              ×
            </button>

            <img
              src={selectedImage}
              alt="Gallery"
            />
          </div>
        </div>
      )}
    </section>
  );
}