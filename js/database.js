function saveScoreToDB() {
    fetch("php/save_score.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `name=${encodeURIComponent(playerName)}&score=${score}`
    });
}

function openLeaderboard() {
    showScreen("leaderboard");
    loadLeaderboard();
}

function loadLeaderboard() {
    document.getElementById("scores").innerHTML = '<p class="loading">Loading...</p>';

    fetch("php/get_scores.php")
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                document.getElementById("scores").innerHTML = '<p class="loading">No scores yet!</p>';
                return;
            }

            let html = "";
            data.forEach((d, i) => {
                const rankClass = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "";
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                html += `
                    <div class="score-row ${rankClass}">
                        <span class="score-rank">${medal}</span>
                        <span class="score-name">${d.name}</span>
                        <span class="score-pts">${d.score}</span>
                    </div>`;
            });

            document.getElementById("scores").innerHTML = html;
        })
        .catch(() => {
            document.getElementById("scores").innerHTML = '<p class="loading">Could not load scores.</p>';
        });
}