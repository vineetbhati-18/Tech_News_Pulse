const API_KEY = "6732b28db9294c7f9b0adc0a2750ccf8";


let articles = [];
let saved = JSON.parse(localStorage.getItem("saved")) || [];


async function fetchNews(query = "technology") {
  document.getElementById("loading").style.display = "block";
  const res = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`
  );
  const data = await res.json();
  articles = data.articles || [];
  displayNews(articles);
  document.getElementById("loading").style.display = "none";
}
fetchNews();


function displayNews(data) {
  const container = document.getElementById("newsContainer");
  container.innerHTML = "";
  data.map(article => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/150'}" width="100%">
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <button onclick="saveArticle('${article.title}')">Save</button>
    `;
    container.appendChild(div);
  });
}


document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(value)
  );
  displayNews(filtered);
});


document.getElementById("sortSelect").addEventListener("change", (e) => {
  let sorted = [...articles];
  if (e.target.value === "asc") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (e.target.value === "desc") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }
  displayNews(sorted);
});


function saveArticle(title) {
  const article = articles.find(a => a.title === title);
  if (!saved.some(a => a.title === title)) {
    saved.push(article);
    localStorage.setItem("saved", JSON.stringify(saved));
    displaySaved();
  }
}


function displaySaved() {
  const container = document.getElementById("savedContainer");
  container.innerHTML = "";
  saved.map(article => {
    const div = document.createElement("div");
    div.className = "saved-card";
    div.innerHTML = `
      <h4>${article.title}</h4>
      <button onclick="removeSaved('${article.title}')">Remove</button>
    `;
    container.appendChild(div);
  });
}


function removeSaved(title) {
  saved = saved.filter(a => a.title !== title);
  localStorage.setItem("saved", JSON.stringify(saved));
  displaySaved();
}


document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
});


window.onload = () => {
  displaySaved();
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
  }
};