const user = localStorage.getItem("user");
document.getElementById("user").innerText = user;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let xp = Number(localStorage.getItem("xp")) || 0;

document.getElementById("xp").innerText = xp;

function addExpense() {
  const amount = Number(document.getElementById("amount").value);
  const custom = document.getElementById("customCategory").value;

  if (!amount) return alert("Enter amount");

  const category = custom || selectedCategory;

  if (!category) return alert("Select or enter category");

  expenses.push({ amount, category });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  xp += 10;
  localStorage.setItem("xp", xp);
  document.getElementById("xp").innerText = xp;

  renderSummary();
  generateInsight();
}

function renderSummary() {
  const summary = {};
  expenses.forEach(e => {
    summary[e.category] = (summary[e.category] || 0) + e.amount;
  });

  const ul = document.getElementById("summary");
  ul.innerHTML = "";

  for (let cat in summary) {
    ul.innerHTML += `<li>${cat}: ₹${summary[cat]}</li>`;
  }
}

function generateInsight() {
  const food = expenses.filter(e => e.category === "Food")
                        .reduce((a,b) => a+b.amount,0);

  let message = "You're doing fine. Keep tracking.";

  if (food > 3000) {
    message = "🍔 Food spending is high. Cooking twice a week could save money.";
  }

  document.getElementById("insight").innerText = message;
}

renderSummary();
const cursor = document.querySelector(".cursor");
const trail = document.querySelector(".cursor-trail");

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor");
  const trail = document.querySelector(".cursor-trail");

  if (!cursor || !trail) {
    console.error("Cursor elements not found");
    return;
  }

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
  });
});
document.querySelectorAll("button, .card, input").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.8)";
    cursor.style.background = "#7f00ff";
  });

  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.background = "#00f5ff";
  });
});
let selectedCategory = null;

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
  });
});

