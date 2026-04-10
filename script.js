const API_KEY = "6732b28db9294c7f9b0adc0a2750ccf8";

let articles = [];
let savedArticles = JSON.parse(localStorage.getItem("saved")) || [];

async function fetchNews(query = "technology") {
  const container = document.getElementById("newsContainer");
  container.innerHTML = `<div class="loader">Loading news...</div>`;

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`
    );
    const data = await res.json();

    articles = data.articles || [];
    displayNews(articles);
  } catch (error) {
    container.innerHTML = "Error loading news";
  }
}

function displayNews(data) {
  const container = document.getElementById("newsContainer");
  container.innerHTML = "";

  data.map(article => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/150'}">
      <h3>${article.title}</h3>
      <p>${article.description || "No description"}</p>
      <a href="${article.url}" target="_blank">Read More</a>
      <button onclick="saveArticle('${article.title}')">Save</button>
    `;

    container.appendChild(div);
  });
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = articles.filter(article =>
    article.title.toLowerCase().includes(value)
  );

  displayNews(filtered);
});

function filterCategory(category) {
  fetchNews(category);
}

function saveArticle(title) {
  const article = articles.find(a => a.title === title);

  if (!savedArticles.some(a => a.title === title)) {
    savedArticles.push(article);
    localStorage.setItem("saved", JSON.stringify(savedArticles));
    displaySaved();
  }
}

function displaySaved() {
  const container = document.getElementById("savedContainer");
  container.innerHTML = "";

  savedArticles.map(article => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h4>${article.title}</h4>
      <button onclick="removeSaved('${article.title}')">Remove</button>
    `;

    container.appendChild(div);
  });
}

function removeSaved(title) {
  savedArticles = savedArticles.filter(a => a.title !== title);
  localStorage.setItem("saved", JSON.stringify(savedArticles));
  displaySaved();
}

const btn = document.getElementById("toggleMode");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  btn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.onload = () => {
  fetchNews();
  displaySaved();

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  }
};