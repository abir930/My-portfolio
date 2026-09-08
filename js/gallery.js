/**
 * Kazi Abir Hasan Portfolio
 * Gallery & Lightbox Controller (Google Drive API Integration with Resilient Fallback)
 */

const ALBUM_FOLDER_ID = '1DF0Yp4n3z4FR2CeVAWHMKwTDXLTbYK4m';
const API_KEY = 'AIzaSyCTkC9LPThzbm4ZjcpjY_ne8IRTYVpQdzk';

// Preloaded backup of user's Google Drive album to guarantee 100% uptime
// even if offline, opened directly via file:///, or rate-limited by Google API
const FALLBACK_ALBUM = [
  { id: '1Uk48DHeQl4kyDW2T0I7JqpCUFydTZucX', name: 'Hardware Session Moments' },
  { id: '17ALRC4Rt1kI5uyNjjOdXmVpeLNU9Cdxl', name: 'Embedded Circuit Testing' },
  { id: '1nOsxe_FwAeyAw9o0_oOS2sjMk1589GIw', name: 'Microcontroller Workshop' },
  { id: '1O3HhvqErYiYYatOrHc-7zDq9UwDIALSQ', name: 'Project Demonstration' },
  { id: '1MaVbZl1DxxiwDvCXsYWv_hbDw-dSnnES', name: 'Team Engineering Event' },
  { id: '1xivQ0fBgzZaDNlkbo2SJxQAV-BdRnl7o', name: 'Technical Showcase Milestone' },
  { id: '1QEzoZ2tgURC9n2Q-p8GgKE2r_THAaB_J', name: 'Circuit Design Experiment' },
  { id: '17vT5nbkdVlHWeWVjYEwPD-6rDJjp948z', name: 'Campus Engineering Lab' },
  { id: '1wTXBRVXabDSiAnpTjjaQNZKvg-3weLTO', name: 'Prototype Assembly Session' },
  { id: '1AIJ70F5Kffejg6qe5Cl3SKsK83suxvPJ', name: 'Hardware Development' },
  { id: '1A5_wgb-ZQwpz4-yE_3X_vsih14jBkCqs', name: 'Maker Showcase Presentation' },
  { id: '1oQje_PXjsxOW35NdhqmZ-WCzQuPgVG5C', name: 'IoT Research Collaboration' },
  { id: '1La-klj2Q16M9vYDAi4Mym_N6VEJ6I1P8', name: 'University Technology Fair' },
  { id: '1riHppF73PKHBjSJG1Vq7Eop0ZP3fG92j', name: 'Robotics & Sensing Lab' },
  { id: '1v5Eth2XWapo15AByy9OCDBUDxJRKoxYQ', name: 'Embedded Firmware Debug' },
  { id: '1BqPsUq4-4h-C6aDFKkUcL04pYzoDOfOY', name: 'Sensor Telemetry Testing' },
  { id: '1_Z9SJeAQX3m-VK43hzVYyM4VbLHhEKL7', name: 'Hardware Lab Build' },
  { id: '1_uSUbhr0DJy9C0hyYyPRiQhe8ZkXo0cQ', name: 'Circuit Board Prototyping' },
  { id: '1FxlPmrGOaq__bM_tyYIOjxpjDeIRkLAa', name: 'Hardware Exhibition' },
  { id: '1NnCPXjQLHRnYyX0OA-RFGh6VhTWadAYc', name: 'Bench Testing Electronics' },
  { id: '1smoeo4bZpIc1bxd4xQHwYZpvYKDIgjvp', name: 'Project Calibration' },
  { id: '1kHzBaZLw3HAHxofMZ5QEuUTysyUXWq3t', name: 'Field Testing Session' },
  { id: '1oWFxHVvAasuQ9GEzDuT1zELPE4VThpCE', name: 'Kazi Abir Hasan Portrait' }
];

let albumImages = [...FALLBACK_ALBUM];
let activeSlideIndex = 0;
let slideshowInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
});

async function initGallery() {
  const gridContainer = document.getElementById('album-grid');
  const countBadge = document.getElementById('gallery-count-badge');
  if (!gridContainer) return;

  // Immediate render with fallback so user NEVER sees an empty screen
  renderGalleryGrid(gridContainer);
  initLightboxControls();

  if (countBadge) {
    countBadge.textContent = `${albumImages.length} Photographs`;
  }

  // Attempt live Google Drive API refresh in the background
  try {
    const encodedQuery = encodeURIComponent(`'${ALBUM_FOLDER_ID}' in parents and mimeType contains 'image/'`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&key=${API_KEY}&fields=files(id,name,thumbnailLink)&orderBy=createdTime+desc&pageSize=60`;

    // Timeout fetch after 4 seconds to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        albumImages = data.files;
        renderGalleryGrid(gridContainer);
        if (countBadge) {
          countBadge.textContent = `${albumImages.length} Photographs`;
        }
      }
    }
  } catch (error) {
    console.log('Using resilient preloaded Google Drive gallery data.');
  }
}

function renderGalleryGrid(container) {
  if (!container) return;
  container.innerHTML = '';

  albumImages.forEach((image, index) => {
    const card = document.createElement('div');
    // Ensure card is visible immediately and not hidden by async intersection observer
    card.className = 'album-photo-card is-visible';
    card.style.animation = `cardFadeIn 0.5s ease forwards ${(index % 12) * 0.04}s`;

    const cleanTitle = image.name
      ? image.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      : `Photo ${index + 1}`;

    const thumbUrl = `https://drive.google.com/thumbnail?id=${image.id}&sz=w600`;
    const fallbackUrl = `https://drive.google.com/uc?export=view&id=${image.id}`;

    card.innerHTML = `
      <img
        class="album-photo-img"
        src="${thumbUrl}"
        alt="${cleanTitle}"
        loading="lazy"
        onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src='${fallbackUrl}';}"
      />
      <div class="album-photo-overlay">
        <div class="overlay-content">
          <span class="overlay-title">${cleanTitle}</span>
          <div class="overlay-icon"><i class="fa-solid fa-expand"></i></div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openLightbox(index);
    });

    container.appendChild(card);
  });
}

function initLightboxControls() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const closeBtn = document.getElementById('lightbox-close');
  const backBtn = document.getElementById('lightbox-back-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (closeBtn) closeBtn.onclick = closeLightbox;
  if (backBtn) backBtn.onclick = closeLightbox;
  if (prevBtn) prevBtn.onclick = showPreviousSlide;
  if (nextBtn) nextBtn.onclick = showNextSlide;

  // Close on backdrop click
  lightbox.onclick = (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  };

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextSlide();
    } else if (e.key === 'ArrowLeft') {
      showPreviousSlide();
    }
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  activeSlideIndex = index;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  renderCurrentSlide();
  startAutoSlideshow();
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  stopAutoSlideshow();
}

function renderCurrentSlide() {
  if (!albumImages.length) return;

  const image = albumImages[activeSlideIndex];
  const imgElement = document.getElementById('lightbox-main-img');
  const captionElement = document.getElementById('lightbox-caption-text');

  if (!imgElement) return;

  const highResUrl = `https://drive.google.com/thumbnail?id=${image.id}&sz=w1600`;
  const fallbackUrl = `https://drive.google.com/uc?export=view&id=${image.id}`;
  const cleanTitle = image.name
    ? image.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    : `Photo ${activeSlideIndex + 1}`;

  imgElement.style.opacity = '0.3';
  imgElement.dataset.tried = '0';

  imgElement.onload = () => {
    imgElement.style.opacity = '1';
  };

  imgElement.onerror = () => {
    if (imgElement.dataset.tried !== '1') {
      imgElement.dataset.tried = '1';
      imgElement.src = fallbackUrl;
    } else {
      imgElement.style.opacity = '1';
    }
  };

  imgElement.src = highResUrl;
  imgElement.alt = cleanTitle;

  // If already cached/loaded, ensure full opacity immediately
  if (imgElement.complete) {
    imgElement.style.opacity = '1';
  }

  if (captionElement) {
    // Note: strict em dash avoidance, use bullet • instead
    captionElement.textContent = `${activeSlideIndex + 1} / ${albumImages.length} • ${cleanTitle}`;
  }
}

function showNextSlide() {
  stopAutoSlideshow();
  activeSlideIndex = (activeSlideIndex + 1) % albumImages.length;
  renderCurrentSlide();
  startAutoSlideshow();
}

function showPreviousSlide() {
  stopAutoSlideshow();
  activeSlideIndex = (activeSlideIndex - 1 + albumImages.length) % albumImages.length;
  renderCurrentSlide();
  startAutoSlideshow();
}

function startAutoSlideshow() {
  stopAutoSlideshow();
  slideshowInterval = setInterval(() => {
    activeSlideIndex = (activeSlideIndex + 1) % albumImages.length;
    renderCurrentSlide();
  }, 4500);
}

function stopAutoSlideshow() {
  if (slideshowInterval) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
  }
}

// Make functions globally accessible
window.initGallery = initGallery;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
