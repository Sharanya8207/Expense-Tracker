const form = document.getElementById("expense-form");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const list = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const chartCanvas = document.getElementById("chart");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let chart;

// Display stored data on load
window.onload = () => {
  renderExpenses();
  updateSummary();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newExpense = {
    id: Date.now(),
    desc: desc.value,
    amount: parseFloat(amount.value),
    category: category.value,
  };
  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateSummary();
  form.reset();
});

function renderExpenses() {
  list.innerHTML = "";
  expenses.forEach((exp) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${exp.desc} - ₹${exp.amount} (${exp.category})</span>
      <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteExpense(id) {
  expenses = expenses.filter((e) => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  updateSummary();
}

function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalDisplay.textContent = total.toFixed(2);

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#007bff",
            "#28a745",
            "#ffc107",
            "#dc3545",
            "#6f42c1",
          ],
        },
      ],
    },
  });
}





