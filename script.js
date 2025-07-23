let members = [];
let balances = {};

function addMember() {
  const nameInput = document.getElementById("member-name");
  const name = nameInput.value.trim();

  if (name && !members.includes(name)) {
    members.push(name);
    balances[name] = 0;
    updateMembersList();
    updatePayerOptions();
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

function addExpense() {
  const description = document.getElementById("expense-desc").value.trim();
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const payer = document.getElementById("paid-by").value;

  if (!description || isNaN(amount) || amount <= 0 || !payer) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const share = amount / members.length;

  members.forEach(member => {
    if (member === payer) {
      balances[member] += amount - share;
    } else {
      balances[member] -= share;
    }
  });

  updateBalances();

  // Reset fields
  document.getElementById("expense-desc").value = "";
  document.getElementById("expense-amount").value = "";
  document.getElementById("paid-by").value = "";
}

function updateBalances() {
  const balanceList = document.getElementById("balance-summary");
  balanceList.innerHTML = "";

  members.forEach(member => {
    const li = document.createElement("li");
    const amount = balances[member];
    li.textContent = `${member}: ${amount >= 0 ? "is owed" : "owes"} ₹${Math.abs(amount).toFixed(2)}`;
    li.style.color = amount < 0 ? "red" : "green";
    balanceList.appendChild(li);
  });
}
