document.addEventListener('DOMContentLoaded', () => {
    const rankingsList = document.getElementById("rankings-list");
    const rankings = JSON.parse(localStorage.getItem("rankings")) || [];

    // Sort rankings in decreasing order of scores
    rankings.sort((a, b) => b.score - a.score);

    if (rankings.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="3">No rankings available yet</td>
        `;
        rankingsList.appendChild(row);
    } else {
        rankings.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.score} points</td>
            `;
            rankingsList.appendChild(row);
        });
    }
});
