// Mobile Menu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// API Keys
const API_KEYS = {
  pexels: "jo9p0KQ29roSet6MXlpmMkednz76sDLYR59TAt2x1DIW8V4XH7uajljq",
  unsplash: "mSUrMk0wJp-kKVP04XUhG7tBrZdZAGrZ_ftkrSPQasc",
  pixabay: "51929305-3ffafd48547c5a5767f737ed1"
};

// Adblock: Enable after ad loads
setTimeout(() => {
  if (document.body.classList.contains('adblock')) {
    const btn = document.getElementById('adLoadedBtn');
    const placeholders = document.querySelectorAll('.ad-placeholder script');
    let loaded = false;
    placeholders.forEach(s => {
      if (s.nextSibling && s.nextSibling.nodeType === Node.ELEMENT_NODE) {
        loaded = true;
      }
    });
    if (loaded) {
      btn.disabled = false;
      btn.textContent = "✅ Continue";
      btn.style.background = "#00c8ff";
      btn.onclick = () => {
        document.getElementById('adblockOverlay').classList.add('hidden');
        document.body.classList.remove('adblock');
      };
    }
  }
}, 3000);

// Fetch Wallpapers
async function fetchWallpapers(query = "nature") {
  const urls = [
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`,
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=6`,
    `https://pixabay.com/api/?key=${API_KEYS.pixabay}&q=${encodeURIComponent(query)}&image_type=photo&per_page=6`
  ];
  let images = [];
  for (let i = 0; i < urls.length; i++) {
    try {
      const headers = i === 0 ? { Authorization: API_KEYS.pexels } :
                      i === 1 ? { Authorization: API_KEYS.unsplash } : {};
      const res = await fetch(urls[i], { headers });
      const data = await res.json();
      if (i === 0) images.push(...data.photos.map(p => ({ url: p.src.large, type: 'image' })));
      if (i === 1) images.push(...data.results.map(p => ({ url: p.urls.regular, type: 'image' })));
      if (i === 2) images.push(...data.hits.map(p => ({ url: p.largeImageURL, type: 'image' })));
    } catch (e) {}
  }
  return images.slice(0, 18);
}

// Fetch Videos (Pexels + Pixabay)
async function fetchVideos(query = "nature") {
  const urls = [
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=6`,
    `https://pixabay.com/api/videos/?key=${API_KEYS.pixabay}&q=${encodeURIComponent(query)}&per_page=6`
  ];
  let videos = [];
  for (let i = 0; i < urls.length; i++) {
    try {
      const headers = i === 0 ? { Authorization: API_KEYS.pexels } : {};
      const res = await fetch(urls[i], { headers });
      const data = await res.json();
      if (i === 0) {
        data.videos.forEach(v => {
          const vid = v.video_files.find(f => f.width >= 1280 && f.file_type.includes('mp4'));
          if (vid) videos.push({ url: vid.link, type: 'video', thumb: v.image });
        });
      }
      if (i === 
