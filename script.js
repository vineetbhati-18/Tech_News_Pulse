const API_KEY = "6732b28db9294c7f9b0adc0a2750ccf8";

const newsContainer = document.getElementById("newsContainer");
const loading = document.getElementById("loading");

// FETCH NEWS
async function fetchNews() {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=technology&apiKey=${API_KEY}`
    );
    const data = await res.json();

    displayNews(data.articles);

  } catch (error) {
    loading.innerText = "Error loading news";
  }
}

// DISPLAY NEWS
function displayNews(articles) {
  loading.style.display = "none";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/150'}">
      <h3>${article.title}</h3>
      <p>${article.description || "No description available"}</p>
      <a href="${article.url}" target="_blank">Read More</a>
    `;

    newsContainer.appendChild(card);
  });
}

// CALL FUNCTION
fetchNews();