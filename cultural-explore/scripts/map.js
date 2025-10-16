// scripts/map.js
document.addEventListener("DOMContentLoaded", async () => {
  const mapContainer = document.getElementById("mapContainer");
  const cultureCards = document.getElementById("cultureCards");
  const searchInput = document.getElementById("countrySearch");

  // Initialize Leaflet map (External API #1)
  const map = L.map(mapContainer).setView([20, 0], 2); // world view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  try {
    // Load featured cultures from JSON
    const data = await fetch("data/cultures.json").then(res => res.json());
    const featured = data.slice(0, 6);

    // Render featured cards
    cultureCards.innerHTML = featured.map(c => `
      <div class="culture-card">
        <h3>${c.name}</h3>
        <p><strong>Region:</strong> ${c.region}</p>
        <p><strong>Language:</strong> ${c.language}</p>
        <button onclick="window.location.href='country.html?name=${encodeURIComponent(c.name)}'">Explore</button>
      </div>
    `).join("");

    // Add markers for featured countries using Nominatim API (External API #2)
    for (const c of featured) {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${c.name}&format=json`);
      const location = await response.json();

      if (location.length > 0) {
        const { lat, lon } = location[0];
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<b>${c.name}</b><br>${c.region}`);
      }
    }

    // Search functionality
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.toLowerCase();
      const match = data.find(c => c.name.toLowerCase() === query);

      if (match) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${match.name}&format=json`);
        const location = await response.json();

        if (location.length > 0) {
          const { lat, lon } = location[0];
          map.setView([lat, lon], 5);
          L.popup()
            .setLatLng([lat, lon])
            .setContent(`<b>${match.name}</b><br>${match.region}`)
            .openOn(map);
        }
      }
    });

  } catch (err) {
    console.error("Error loading cultures:", err);
    cultureCards.innerHTML = "<p>Failed to load featured cultures.</p>";
  }
});
