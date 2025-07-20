// ==========================
// ✅ 共通：GASのURL
// ==========================
const GAS_API_URL = "https://https://script.google.com/macros/s/AKfycbzjaaXT3VQQmI-TMpzmuefmxBnB4uaoAbijLLikfBzhwfMSitH-8zbeJ2wSNJE_fdIong/exec"; // ← あなたのGAS URLに変更！

// ==========================
// ✅ ページ読み込み時に分岐
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("ranking.html")) {
    setupRankingPage();
  } else if (path.includes("index.html") || path.endsWith("/")) {
    setupWelcomePage();
  }
});

// ==========================
// ✅ 1枚目（index.html）の処理
// ==========================
function setupWelcomePage() {
  const yesBtn = document.getElementById("yesBtn");
  if (yesBtn) {
    yesBtn.addEventListener("click", goToRanking);
  }
}

// 「次へ」ボタン押したときに2枚目へ移動
function goToRanking() {
  window.location.href = "ranking.html";
}

// ==========================
// ✅ 2枚目（ranking.html）の処理
// ==========================
function setupRankingPage() {
  const monthSelect = document.getElementById("monthSelect");
  const rankingContainer = document.getElementById("ranking");

  // 📅 月リスト生成（今月〜過去12か月）
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    monthSelect.appendChild(option);
  }

  // 🔄 月を選んだとき、GASからデータ取得
  monthSelect.addEventListener("change", async () => {
    const month = monthSelect.value;
    if (!month) return;

    rankingContainer.innerHTML = "読み込み中...";

    try {
      const res = await fetch(`${GAS_API_URL}?month=${month}`);
      const data = await res.json();

      if (!data.ranking || data.ranking.length === 0) {
        rankingContainer.innerHTML = "データがありません";
        return;
      }

      // 🏆 ユーザーごとの表示
      rankingContainer.innerHTML = data.ranking.map(user => `
        <div class="user-entry">
          <div class="rank">${user.rank}</div>
          <img src="${user.profile_image || ''}" alt="${user.user_name}" class="avatar">
          <div class="user-info">
            <div class="name">${user.user_name}</div>
            <div class="distance">${user.distance_km} km / ${user.time_min} min / ${user.count} times</div>
          </div>
        </div>
      `).join("");

    } catch (err) {
      rankingContainer.innerHTML = "エラーが発生しました";
      console.error(err);
    }
  });
}
