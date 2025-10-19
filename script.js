let lifeSeconds = 0; // total life in seconds
let hourlyRate = 0;
let transactions = [];

function initializeLife() {
    let salary = parseFloat(document.getElementById("salary").value);
    let days = parseFloat(document.getElementById("days").value);
    let hoursPerDay = parseFloat(document.getElementById("hours").value);
    let bank = parseFloat(document.getElementById("bank").value);

    if (!salary || !days || !hoursPerDay || !bank) {
        alert("Please fill all fields!");
        return;
    }

    // Calculate hourly rate
    let totalMonthlyHours = days * hoursPerDay;
    hourlyRate = salary / totalMonthlyHours;

    // Convert bank balance to life in seconds
    lifeSeconds = (bank / hourlyRate) * 3600;

    // Hide setup, show life container
    document.getElementById("setup").style.display = "none";
    document.getElementById("lifeContainer").style.display = "block";

    // Load saved transactions if exist
    loadTransactions();
    updateLifeDisplay();
}

function spendLife() {
    let expense = parseFloat(document.getElementById("expenseInput").value);
    if (!expense) return;

    let hoursLost = expense / hourlyRate;
    lifeSeconds -= hoursLost * 3600;
    if (lifeSeconds < 0) lifeSeconds = 0;

    // Save transaction
    transactions.push({type: "Spent", amount: expense, hours: hoursLost});
    saveTransactions();

    document.getElementById("expenseInput").value = "";
    updateLifeDisplay();
    renderTransactions();
}

function addLife() {
    let received = parseFloat(document.getElementById("loanInput").value);
    if (!received) return;

    let hoursGained = received / hourlyRate;
    lifeSeconds += hoursGained * 3600;

    // Save transaction
    transactions.push({type: "Received", amount: received, hours: hoursGained});
    saveTransactions();

    document.getElementById("loanInput").value = "";
    updateLifeDisplay();
    renderTransactions();
}

function updateLifeDisplay() {
    let hours = Math.floor(lifeSeconds / 3600);
    let minutes = Math.floor((lifeSeconds % 3600) / 60);
    let seconds = Math.floor(lifeSeconds % 60);

    document.getElementById("lifeDisplay").innerText = `${hours}h ${minutes}m ${seconds}s`;
}

function saveTransactions() {
    localStorage.setItem("lifeSeconds", lifeSeconds);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
    let savedLife = localStorage.getItem("lifeSeconds");
    let savedTransactions = localStorage.getItem("transactions");
    if (savedLife) lifeSeconds = parseFloat(savedLife);
    if (savedTransactions) transactions = JSON.parse(savedTransactions);
    renderTransactions();
}

function renderTransactions() {
    let list = document.getElementById("transactionList");
    list.innerHTML = "";
    transactions.forEach(trx => {
        let li = document.createElement("li");
        li.innerText = `${trx.type}: ₹${trx.amount} → ${trx.hours.toFixed(2)}h`;
        list.appendChild(li);
    });
}
