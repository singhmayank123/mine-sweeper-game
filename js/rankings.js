const rankingsList = document.getElementById("rankings-list");
const rankings = JSON.parse(localStorage.getItem("rankings")) || [];

// Sort rankings in decreasing order of scores
rankings.sort((a, b) => b.score - a.score);

rankings.forEach((user, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${user.username}</td>
    <td>${user.score} points</td>
  `;
  rankingsList.appendChild(row);
});
