// 1. ANIMASI FADE-IN PADA SCROLL (Intersection Observer)
const faders = document.querySelectorAll(".fade-in");
const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach((fader) => {
  appearOnScroll.observe(fader);
});

// 2. ACTIVE NAV MENU TRACKING SAAT SCROLL
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (
      link.getAttribute("href") &&
      link.getAttribute("href").includes(current)
    ) {
      link.classList.add("active");
    }
  });
});

// 3. LOGIKA SWITCHER TEMA LIGHT / DARK MODE
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleIcon = themeToggleBtn.querySelector("i");
const themeTooltip = themeToggleBtn.querySelector(".nav-tooltip");

// Mengambil preferensi tema sebelumnya dari local storage, jika tidak ada, gunakan tema gelap sebagai bawaan
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
applyThemeUI(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  applyThemeUI(newTheme);
});

function applyThemeUI(theme) {
  if (theme === "light") {
    themeToggleIcon.className = "fa-solid fa-sun";
    themeTooltip.textContent = "Mode Gelap";
    themeToggleBtn.setAttribute("data-tooltip", "Mode Gelap");
  } else {
    themeToggleIcon.className = "fa-solid fa-moon";
    themeTooltip.textContent = "Mode Terang";
    themeToggleBtn.setAttribute("data-tooltip", "Mode Terang");
  }
}

// 4. INTEGRASI NOTIFIKASI FORM TERKIRIM
function showMessage() {
  const msgBox = document.createElement("div");
  msgBox.style.position = "fixed";
  msgBox.style.top = "30px";
  msgBox.style.left = "50%";
  msgBox.style.transform = "translateX(-50%)";
  msgBox.style.background = "#4ade80";
  msgBox.style.color = "white";
  msgBox.style.padding = "15px 30px";
  msgBox.style.borderRadius = "10px";
  msgBox.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
  msgBox.style.zIndex = "999999";
  msgBox.style.fontWeight = "bold";
  msgBox.innerHTML =
    '<i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Pesan Anda berhasil dikirim!';

  document.body.appendChild(msgBox);
  document.querySelector(".contact-form").reset();

  setTimeout(() => {
    msgBox.style.opacity = "0";
    msgBox.style.transition = "opacity 0.5s ease";
    setTimeout(() => msgBox.remove(), 500);
  }, 3000);
}

// MODAL SERTIFIKAT (POP-UP FULLSCREEN)
const certCards = document.querySelectorAll(".cert-card");
const certModal = document.getElementById("cert-modal");
const certModalBody = document.getElementById("cert-modal-body");
const closeModalBtn = document.querySelector(".close-modal");

certCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Ambil teks dari sertifikat yang di-klik
    const certName = card.querySelector(".cert-overlay span").innerText;

    // Masukkan tampilan ke tengah modal.
    // Nanti saat Anda sudah punya gambar/file, Anda bisa mengganti kode HTML ini dengan <img src="...">
    // Contoh di dalam JavaScript Anda
certModalBody.innerHTML = `
    <img src="./assets/certificate.jpg" alt="Sertifikat" style="max-width: 95%; max-height: 82vh; border-radius: 10px;">
`;

    // Munculkan Modal
    certModal.classList.add("active");

    // Kunci layar agar tidak bisa di-scroll saat melihat sertifikat
    document.body.style.overflow = "hidden";
  });
});

function closeCertModal() {
  certModal.classList.remove("active");
  // Kembalikan fungsi scroll pada halaman utama
  document.body.style.overflow = "";
}

// Tutup saat tombol silang (X) di-klik
closeModalBtn.addEventListener("click", closeCertModal);

// Tutup saat area gelap di luar kotak sertifikat di-klik
certModal.addEventListener("click", (e) => {
  if (e.target === certModal) closeCertModal();
});

// 5. ANIMASI PARTIKEL INTERAKTIF PADA BACKGROUND (Menyesuaikan Tema secara Dinamis)
const canvas = document.getElementById("particles-bg");
const ctx = canvas.getContext("2d");
let particlesArray;

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

let mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener("mouseout", function () {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor(x, y, directionX, directionY, size) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

    // Mengubah warna partikel secara dinamis mengikuti tema
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    ctx.fillStyle = isLight
      ? "rgba(37, 99, 235, 0.4)"
      : "rgba(59, 130, 246, 0.3)";
    ctx.fill();
  }

  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Proteksi koordinat agar partikel tidak tersedot ke (0,0) saat mouse di luar window
    if (
      mouse.x !== null &&
      mouse.y !== null &&
      mouse.x !== undefined &&
      mouse.y !== undefined
    ) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (mouse.radius - distance) / mouse.radius;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      } else {
        this.restorePosition();
      }
    } else {
      this.restorePosition();
    }

    this.baseX += this.directionX;
    this.baseY += this.directionY;
    this.x += this.directionX;
    this.y += this.directionY;

    this.draw();
  }

  restorePosition() {
    if (this.x !== this.baseX) {
      let dx = this.x - this.baseX;
      this.x -= dx / 20;
    }
    if (this.y !== this.baseY) {
      let dy = this.y - this.baseY;
      this.y -= dy / 20;
    }
  }
}

function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 15000;

  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 0.4 - 0.2;
    let directionY = Math.random() * 0.4 - 0.2;

    particlesArray.push(new Particle(x, y, directionX, directionY, size));
  }
}

function connect() {
  let opacityValue = 1;
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";
  const maxDistance = (canvas.width / 10) * (canvas.height / 10);

  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);

      if (distance < maxDistance) {
        opacityValue = 1 - distance / maxDistance;
        // Proteksi agar nilai alpha tidak negatif di browser Safari/Chrome tertentu
        if (opacityValue < 0) opacityValue = 0;

        // Garis penghubung partikel berubah warna mengikuti tema
        ctx.strokeStyle = isLight
          ? "rgba(124, 58, 237, " + opacityValue / 4 + ")"
          : "rgba(139, 92, 246, " + opacityValue / 5 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

init();
animate();

window.addEventListener("resize", function () {
  init();
});
