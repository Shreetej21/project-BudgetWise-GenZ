// App state (NO localStorage)
let expenses = [];
let xp = 0;
let selectedCategory = null;
let donutSegments = [];

// Category buttons
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
  });
});

// Add expense
function addExpense() {
  const amount = Number(document.getElementById("amount").value);
  const custom = document.getElementById("customCategory").value;
  const category = custom || selectedCategory;

  if (!amount || !category) {
    alert("Enter amount and category");
    return;
  }

  expenses.push({ amount, category });

  xp += 10;
  document.getElementById("xp").innerText = xp;

  renderSummary();
  renderDonutChart();
}

// Summary
function renderSummary() {
  const ul = document.getElementById("summary");
  ul.innerHTML = "";

  const totals = {};
  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });

  for (let c in totals) {
    ul.innerHTML += `<li>${c}: ₹${totals[c]}</li>`;
  }
}

// Donut chart
function renderDonutChart() {
  const donut = document.querySelector(".donut");
  const value = document.getElementById("donutValue");

  if (!donut || expenses.length === 0) return;

  const totals = {};
  let total = 0;

  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
    total += e.amount;
  });

  const colors = {
    Food: "#ff5fa2",
    Travel: "#4dd0e1",
    Shopping: "#ffd54f",
    Clothes: "#7c4dff"
  };

  donutSegments = [];
  let start = 0;
  const parts = [];

  for (let cat in totals) {
    const deg = (totals[cat] / total) * 360;
    donutSegments.push({
      category: cat,
      amount: totals[cat],
      start,
      end: start + deg,
      color: colors[cat] || "#999"
    });
    parts.push(`${colors[cat] || "#999"} ${start}deg ${start + deg}deg`);
    start += deg;
  }

  donut.style.background = `conic-gradient(${parts.join(",")})`;
  value.innerText = `₹${total}`;
}

// Hover interaction
document.addEventListener("DOMContentLoaded", () => {
  const donut = document.querySelector(".donut");
  const tooltip = document.getElementById("donutTooltip");

  donut.addEventListener("mousemove", (e) => {
    const r = donut.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = (angle + 360 + 90) % 360;

    const seg = donutSegments.find(s => angle >= s.start && angle < s.end);
    if (!seg) return;

    // Highlight slice
    let parts = [];
    donutSegments.forEach(s => {
      let a = s.start;
      let b = s.end;

      if (s === seg) {
        const mid = (a + b) / 2;
        a = mid - (b - a) * 0.55;
        b = mid + (b - a) * 0.55;
        donut.style.boxShadow = `0 0 25px ${s.color}`;
      }
      parts.push(`${s.color} ${a}deg ${b}deg`);
    });

    donut.style.background = `conic-gradient(${parts.join(",")})`;

    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    tooltip.style.opacity = 1;
    tooltip.innerHTML = `<strong>${seg.category}</strong><br>₹${seg.amount}`;
  });

  donut.addEventListener("mouseleave", () => {
    donut.style.boxShadow = "none";
    tooltip.style.opacity = 0;
    renderDonutChart();
  });
});
