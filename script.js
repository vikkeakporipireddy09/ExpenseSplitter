let members = [];
let balances = {};

//  Load from localStorage if available
window.onload = function () {
  const savedPin = localStorage.getItem("expenseAppPin");
  if (!savedPin) {
    const newPin = prompt("Set a 4-digit PIN for access:");
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
      localStorage.setItem("expenseAppPin", newPin);
      alert("PIN set! Reload the page and enter the PIN to continue.");
    } else {
      alert("Invalid PIN. Reload and try again.");
    }
  }

  // Load previous data
  const storedMembers = localStorage.getItem("members");
  const storedBalances = localStorage.getItem("balances");

  if (storedMembers && storedBalances) {
    members = JSON.parse(storedMembers);
    balances = JSON.parse(storedBalances);
    updateMembersList();
    updatePayerOptions();
    updateBalanceSummary();
  }
};

// PIN verification
function verifyPin() {
  const enteredPin = document.getElementById("pin-input").value;
  const savedPin = localStorage.getItem("expenseAppPin");

  if (enteredPin === savedPin) {
    document.getElementById("pin-lock").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");
  } else {
    alert("Incorrect PIN");
  }
}

// Add member
function addMember() {
  const nameInput = document.getElementById("member-name");
  const name = nameInput.value.trim();

  if (name && !members.includes(name)) {
    members.push(name);
    balances[name] = 0;
    updateMembersList();
    updatePayerOptions();
    updateLocalStorage();
    nameInput.value = "";
  }
}

function updateMembersList() {
  const memberList = document.getElementById("members-list");
  memberList.innerHTML = "";

  members.forEach(member => {
    const li = document.createElement("li");
    li.textContent = member;
    memberList.appendChild(li);
  });
}

function updatePayerOptions() {
  const select = document.getElementById("paid-by");
  select.innerHTML = '<option value="">-- Paid By --</option>';

  members.forEach(member => {
    const option = document.createElement("option");
    option.value = member;
    option.textContent = member;
    select.appendChild(option);
  });
}

// Add expense
function addExpense() {
  const description = document.getElementById("expense-desc").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const payer = document.getElementById("paid-by").value;

  if (!description || isNaN(amount) || amount <= 0 || !payer) {
    alert("Please fill all fields correctly.");
    return;
  }

  const splitAmount = amount / members.length;

  members.forEach(member => {
    if (member === payer) {
      balances[member] += amount - splitAmount;
    } else {
      balances[member] -= splitAmount;
    }
  });

  updateBalanceSummary();
  updateLocalStorage();

  // Clear inputs
  document.getElementById("expense-desc").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("paid-by").value = "";
}

// Update balance summary
function updateBalanceSummary() {
  const summary = document.getElementById("balance-summary");
  summary.innerHTML = "";

  members.forEach(member => {
    const li = document.createElement("li");
    const balance = balances[member];
    li.textContent = `${member} ${balance >= 0 ? "gets back" : "owes"} ₹${Math.abs(balance).toFixed(2)}`;
    li.style.color = balance >= 0 ? "green" : "red";
    summary.appendChild(li);
  });
}

//  Save members and balances to localStorage
function updateLocalStorage() {
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("balances", JSON.stringify(balances));
}
