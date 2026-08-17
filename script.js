const state = {
  photos: [],
  currentIndex: 0,
  touchStartX: 0,
};

const galleryGrid = document.getElementById('galleryGrid');
const photoCount = document.getElementById('photoCount');
const emptyState = document.getElementById('emptyState');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxCaption = document.getElementById('lightboxCaption');
const downloadButton = document.getElementById('downloadButton');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const closeButton = document.getElementById('closeButton');

function normalisePhoto(entry) {
  if (typeof entry === 'string') {
    return {
      src: entry,
      title: getFriendlyName(entry),
    };
  }

  return {
    src: entry.src,
    title: entry.title || getFriendlyName(entry.src),
  };
}

function getFriendlyName(path) {
  const fileName = decodeURIComponent(path.split('/').pop() || 'Wedding photo');
  return fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
}

async function loadPhotos() {
  try {
    const response = await fetch('photos.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Unable to load photos.json (${response.status})`);
    }

    const entries = await response.json();
    state.photos = Array.isArray(entries)
      ? entries.map(normalisePhoto).filter(photo => photo.src)
      : [];
  } catch (error) {
    console.warn(error);
    state.photos = [];
  }

  renderGallery();
}

function renderGallery() {
  galleryGrid.innerHTML = '';

  if (!state.photos.length) {
    photoCount.textContent = '0 photos';
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  photoCount.textContent = `${state.photos.length} ${state.photos.length === 1 ? 'photo' : 'photos'}`;

  const fragment = document.createDocumentFragment();

  state.photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-card';
    button.setAttribute('aria-label', `Open ${photo.title}`);

    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.title;
    image.loading = index < 6 ? 'eager' : 'lazy';
    image.decoding = 'async';

    image.addEventListener('error', () => {
      button.remove();
    });

    button.appendChild(image);
    button.addEventListener('click', () => openLightbox(index));
    fragment.appendChild(button);
  });

  galleryGrid.appendChild(fragment);
}

function openLightbox(index) {
  state.currentIndex = index;
  updateLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
}

function updateLightbox() {
  const photo = state.photos[state.currentIndex];
  if (!photo) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.title;
  lightboxCaption.textContent = photo.title;
  lightboxCounter.textContent = `${state.currentIndex + 1} / ${state.photos.length}`;
  downloadButton.href = photo.src;
  downloadButton.download = photo.src.split('/').pop() || `wedding-photo-${state.currentIndex + 1}`;

  const shouldHideNavigation = state.photos.length <= 1;
  previousButton.hidden = shouldHideNavigation;
  nextButton.hidden = shouldHideNavigation;
}

function showNextPhoto() {
  if (!state.photos.length) return;
  state.currentIndex = (state.currentIndex + 1) % state.photos.length;
  updateLightbox();
}

function showPreviousPhoto() {
  if (!state.photos.length) return;
  state.currentIndex = (state.currentIndex - 1 + state.photos.length) % state.photos.length;
  updateLightbox();
}

previousButton.addEventListener('click', showPreviousPhoto);
nextButton.addEventListener('click', showNextPhoto);
closeButton.addEventListener('click', closeLightbox);

document.querySelector('[data-close-lightbox]').addEventListener('click', closeLightbox);

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('is-open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNextPhoto();
  if (event.key === 'ArrowLeft') showPreviousPhoto();
});

lightbox.addEventListener('touchstart', event => {
  state.touchStartX = event.changedTouches[0]?.clientX ?? 0;
}, { passive: true });

lightbox.addEventListener('touchend', event => {
  const touchEndX = event.changedTouches[0]?.clientX ?? 0;
  const distance = touchEndX - state.touchStartX;

  if (Math.abs(distance) < 55) return;
  if (distance < 0) showNextPhoto();
  else showPreviousPhoto();
}, { passive: true });

loadPhotos();
