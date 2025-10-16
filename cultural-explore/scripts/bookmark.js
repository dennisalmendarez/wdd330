document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("bookmarkBtn");
  const country = new URLSearchParams(window.location.search).get("name");

  if (!country) {
    btn.disabled = true;
    btn.textContent = "No country selected";
    return;
  }

  // Load existing bookmarks
  let bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");

  // Update button state
  if (bookmarks.includes(country)) {
    btn.textContent = "Bookmarked ✓";
  } else {
    btn.textContent = "Bookmark";
  }

  // Handle click event
  btn.addEventListener("click", () => {
    if (bookmarks.includes(country)) {
      // Remove bookmark
      bookmarks = bookmarks.filter(c => c !== country);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      btn.textContent = "Bookmark";
      alert(`Removed ${country} from bookmarks.`);
    } else {
      // Add bookmark
      bookmarks.push(country);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      btn.textContent = "Bookmarked ✓";
      alert(`Bookmarked ${country}!`);
    }
  });

  // Save last visited country
  localStorage.setItem("lastVisited", country);
});