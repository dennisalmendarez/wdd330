document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("name");

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    const country = data[0];

    document.getElementById("countryName").textContent = country.name.common;

    document.getElementById("factCards").innerHTML = `
      <h2>Quick Facts</h2>
      <ul>
        <li><strong>Capital:</strong> ${country.capital?.[0]}</li>
        <li><strong>Region:</strong> ${country.region}</li>
        <li><strong>Population:</strong> ${country.population.toLocaleString()}</li>
        <li><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</li>
        <li><strong>Currencies:</strong> ${Object.values(country.currencies).map(c => c.name).join(", ")}</li>
      </ul>
    `;
  } catch (err) {
    console.error("API error:", err);
    document.body.innerHTML = `<h2>Failed to load country data.</h2>`;
  }
});