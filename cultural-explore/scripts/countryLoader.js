// scripts/countryLoader.js
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const countryName = params.get("name");
  const nameHeader = document.getElementById("countryName");
  const factCards = document.getElementById("factCards").querySelector("div");
  const mediaGallery = document.getElementById("mediaGallery").querySelector("div");
  const languagePhrases = document.getElementById("languagePhrases").querySelector("div");
  const holidayCalendar = document.getElementById("holidayCalendar").querySelector("div");
  const quizSection = document.getElementById("quizSection").querySelector("div");

  if (!countryName) {
    nameHeader.textContent = "Country not found";
    factCards.innerHTML = "<p>Missing country parameter.</p>";
    return;
  }

  nameHeader.textContent = countryName;

  try {
    // Load country data from local JSON
    const data = await fetch("data/cultures.json").then(res => res.json());
    const country = data.find(c => c.name.toLowerCase() === countryName.toLowerCase());

    // Fetch extra info from REST Countries API
    const apiResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    const apiData = await apiResponse.json();
    const apiCountry = apiData[0];

    // 🧾 FACT CARDS
    factCards.innerHTML = `
      <p><strong>Region:</strong> ${country?.region || apiCountry.region}</p>
      <p><strong>Language:</strong> ${country?.language || Object.values(apiCountry.languages || {}).join(", ")}</p>
      <p><strong>Population:</strong> ${apiCountry.population.toLocaleString()}</p>
      <p><strong>Capital:</strong> ${apiCountry.capital}</p>
      <img src="${apiCountry.flags.svg}" alt="${countryName} flag" width="150">
    `;

    // 🖼️ MEDIA GALLERY
    mediaGallery.innerHTML = `
      <img src="images/${countryName.toLowerCase()}1.jpg" alt="${countryName} culture" width="200">
      <img src="images/${countryName.toLowerCase()}2.jpg" alt="${countryName} scenery" width="200">
    `;

    // 💬 LANGUAGE PHRASES
    languagePhrases.innerHTML = `
      <p><strong>Hello:</strong> "Hello" in ${countryName}</p>
      <p><strong>Thank you:</strong> "Thank you" in ${countryName}</p>
    `;

    // 🎉 HOLIDAY CALENDAR
    holidayCalendar.innerHTML = `
      <ul>
        <li>New Year’s Day</li>
        <li>National Holiday</li>
      </ul>
    `;

    // 🎯 QUIZ SECTION (interactive)
    const quizQuestions = [
      {
        question: `Which continent is ${countryName} in?`,
        answer: apiCountry.region,
        options: ["Africa", "Asia", "Europe", apiCountry.region]
      },
      {
        question: `What is the capital of ${countryName}?`,
        answer: apiCountry.capital[0],
        options: ["Unknown", "Test City", apiCountry.capital[0], "Another City"]
      },
      {
        question: `Which language is primarily spoken in ${countryName}?`,
        answer: Object.values(apiCountry.languages || {})[0] || "Unknown",
        options: ["English", "French", Object.values(apiCountry.languages || {})[0] || "Unknown", "Spanish"]
      }
    ];

    // Pick a random question
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    const selectedQuestion = quizQuestions[randomIndex];

    // Render quiz
    quizSection.innerHTML = `
      <p>${selectedQuestion.question}</p>
      <div id="quizOptions">
        ${selectedQuestion.options
          .sort(() => Math.random() - 0.5) // shuffle options
          .map(option => `<button class="quiz-option">${option}</button>`)
          .join("")}
      </div>
      <p id="quizResult"></p>
    `;

    // Quiz logic
    const quizOptions = document.querySelectorAll(".quiz-option");
    const quizResult = document.getElementById("quizResult");

    quizOptions.forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.textContent === selectedQuestion.answer) {
          quizResult.textContent = "✅ Correct!";
          quizResult.style.color = "green";
        } else {
          quizResult.textContent = `❌ Wrong! The correct answer is ${selectedQuestion.answer}.`;
          quizResult.style.color = "red";
        }

        // Disable all buttons after answering
        quizOptions.forEach(b => b.disabled = true);
      });
    });

  } catch (error) {
    console.error("Error loading country details:", error);
    factCards.innerHTML = "<p>Failed to load country data.</p>";
  }
});
