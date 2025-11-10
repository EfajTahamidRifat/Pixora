// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// API KEYS
const API_KEYS = {
  pexels: "jo9p0KQ29roSet6MXlpmMkednz76sDLYR59TAt2x1DIW8V4XH7uajljq",
  unsplash: "mSUrMk0wJp-kKVP04XUhG7tBrZdZAGrZ_ftkrSPQasc",
  pixabay: "51929305-3ffafd48547c5a5767f737ed1"
};

// Fetch images
async function fetchImages(query = "nature") {
  const sources = [
    {
      name: "pexels",
      url: `https://api.pexels.com/v1/search?query=${query}&per_page=8`,
      headers: { Authorization: API_KEYS.pexels }
    },
    {
      name: "unsplash",
      url: `https://api.unsplash.com/search/photos?query=${query}&per_page=8&client_id=${API_KEYS.unsplash}`
    },
    {
      name: "pixabay",
      url: `https://pixabay.com/api/?key=${API_KEYS.pixabay}&q=${query}&image_type=photo&per_page=8`
    }
  ];

  let images = [];
  for (let src of sources) {
    try {
      const res = await fetch(src.url, { headers: src.headers || {} });
      const data = await res.json();

      if (src.name === "pexels") {
        images.push(...data.photos.map(p => p.src.large));
      } else if (src.name === "unsplash") {
        images.push(...data.results.map(p => p.urls.regular));
      } else if (src.name === "pixabay") {
        images.push(...data.hits.map(p => p.largeImageURL));
      }
    } catch (err) {
      console.log(`${src.name} failed`, err);
    }
  }
  return images;
}

// Load and display images
async function loadImages(query = "nature") {
  const grid = document.getElementById("imageGrid");
  const loading = document.getElementById("loading");
  grid.innerHTML = "";
  loading.classList.remove("hidden");

  const images = await fetchImages(query);
  images.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    grid.appendChild(img);
  });

  loading.classList.add("hidden");
}

// Search
document.getElementById("searchInput").addEventListener("keyup", e => {
  if (e.key === "Enter") loadImages(e.target.value);
});

// Categories
document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.category === "all" ? "nature" : btn.dataset.category;
    loadImages(cat);
  });
});

loadImages();
