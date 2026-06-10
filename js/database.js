function saveScoreToDB() {
    fetch("php/save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `name=${encodeURIComponent(playerName)}&score=${score}&time=${gameTimer}&difficulty=${encodeURIComponent(currentDifficulty)}`
    });
}

function openLeaderboard() {
    showScreen("leaderboard");
    loadLeaderboard(currentDifficulty);
}

function formatTime(seconds) {
    if (seconds == null || isNaN(seconds)) return "--:--";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return m + ":" + s;
}

// Track active tab
let activeLbDifficulty = "easy";

function switchLbTab(diff) {
    activeLbDifficulty = diff;

    // Update tab button states
    ["easy", "medium", "filipino"].forEach(d => {
        const btn = document.getElementById("lb-tab-" + d);
        if (btn) btn.classList.toggle("lb-tab-active", d === diff);
    });

    loadLeaderboard(diff);
}

function loadLeaderboard(diff) {
    diff = diff || activeLbDifficulty || "easy";
    activeLbDifficulty = diff;

    // Render tabs if not already there
    const scoresEl = document.getElementById("scores");
    let tabsEl = document.getElementById("lb-tabs");
    if (!tabsEl) {
        const tabs = document.createElement("div");
        tabs.id = "lb-tabs";
        tabs.className = "lb-tabs";
        tabs.innerHTML = `
            <button id="lb-tab-easy"     class="lb-tab" onclick="switchLbTab('easy')">😊 EASY</button>
            <button id="lb-tab-medium"   class="lb-tab" onclick="switchLbTab('medium')">😤 MEDIUM</button>
            <button id="lb-tab-filipino" class="lb-tab" onclick="switchLbTab('filipino')">🇵🇭 FILIPINO</button>
        `;
        scoresEl.parentNode.insertBefore(tabs, scoresEl);
        tabsEl = tabs;
    }

    // Set active tab
    ["easy", "medium", "filipino"].forEach(d => {
        const btn = document.getElementById("lb-tab-" + d);
        if (btn) btn.classList.toggle("lb-tab-active", d === diff);
    });

    scoresEl.innerHTML = '<p class="loading">Loading...</p>';

    fetch(`php/get_scores.php?difficulty=${encodeURIComponent(diff)}`)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                scoresEl.innerHTML = '<p class="loading">No scores yet!</p>';
                return;
            }

            let html = `
                <div class="score-row score-header">
                    <span class="score-rank">#</span>
                    <span class="score-name">Player</span>
                    <span class="score-pts">Score</span>
                    <span class="score-time">Time</span>
                </div>`;

            data.forEach((d, i) => {
                const rankClass = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "";
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
                html += `
                    <div class="score-row ${rankClass}">
                        <span class="score-rank">${medal}</span>
                        <span class="score-name">${d.name}</span>
                        <span class="score-pts">${d.score}</span>
                        <span class="score-time">${formatTime(d.time)}</span>
                    </div>`;
            });

            scoresEl.innerHTML = html;
        })
        .catch(() => {
            scoresEl.innerHTML = '<p class="loading">Could not load scores.</p>';
        });
}