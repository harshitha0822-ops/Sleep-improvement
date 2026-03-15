// ==========================
// LOGIN FUNCTION
// ==========================
function login() {
    let name = document.getElementById("name").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;

    if (name === "" || mobile === "" || email === "") {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("userName", name);

    if (!localStorage.getItem("sleepData")) {
        localStorage.setItem("sleepData", JSON.stringify([]));
    }

    window.location.href = "dashboard.html";
}


// ==========================
// ADD SLEEP ENTRY
// ==========================
function addSleep() {

    let hours = parseFloat(document.getElementById("hours").value);
    let productivity = parseInt(document.getElementById("productivity").value);
    let mood = parseInt(document.getElementById("mood").value);

    if (isNaN(hours)) {
        alert("Enter sleep hours");
        return;
    }

    // -------- Sleep Score Logic --------
    let score = 0;

    if (hours >= 7 && hours <= 9) {
        score = 95;
    } else if (hours >= 6) {
        score = 80;
    } else if (hours >= 5) {
        score = 60;
    } else {
        score = 40;
    }

    // -------- Sleep Debt Logic --------
    let ideal = 8;
    let debt = ideal - hours;
    if (debt < 0) debt = 0;

    // -------- Consistency Logic --------
    let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
    let consistency = 100;

    if (sleepData.length > 0) {
        let last = sleepData[sleepData.length - 1].hours;
        let difference = Math.abs(last - hours);
        consistency = 100 - (difference * 10);
        if (consistency < 50) consistency = 50;
    }

    // -------- Pattern Suggestion --------
    let suggestion = "";

    if (hours < 6) {
        suggestion = "You are not sleeping enough. Risk of burnout increasing.";
    } else if (productivity < 5) {
        suggestion = "Low productivity detected. Try improving sleep consistency.";
    } else {
        suggestion = "Great job! Your sleep pattern supports good performance.";
    }

    // -------- Save Data --------
    let entry = {
        hours: hours,
        score: score,
        debt: debt,
        consistency: consistency,
        productivity: productivity,
        mood: mood
    };

    sleepData.push(entry);
    localStorage.setItem("sleepData", JSON.stringify(sleepData));

    alert("Sleep data saved successfully!");

    window.location.href = "dashboard.html";
}


// ==========================
// DASHBOARD LOAD
// ==========================
window.onload = function () {

    let user = localStorage.getItem("userName");
    if (user && document.getElementById("usernameDisplay")) {
        document.getElementById("usernameDisplay").innerText = user;
    }

    let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

    if (sleepData.length > 0) {

        let latest = sleepData[sleepData.length - 1];

        if (document.getElementById("sleepScore"))
            document.getElementById("sleepScore").innerText = latest.score;

        if (document.getElementById("consistencyScore"))
            document.getElementById("consistencyScore").innerText = latest.consistency + "%";

        if (document.getElementById("sleepDebt"))
            document.getElementById("sleepDebt").innerText = latest.debt + " hrs";

    }
};


// ==========================
// FAQ TOGGLE
// ==========================
function toggleFAQ(element) {
    let answer = element.querySelector(".faq-answer");
    if (answer.style.display === "block") {
        answer.style.display = "none";
    } else {
        answer.style.display = "block";
    }
}


// ==========================
// REPORT GRAPH (Chart.js)
// ==========================
function loadChart() {

    let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

    let labels = [];
    let scores = [];

    for (let i = 0; i < sleepData.length; i++) {
        labels.push("Entry " + (i + 1));
        scores.push(sleepData[i].score);
    }

    let ctx = document.getElementById("sleepChart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Sleep Score",
                data: scores,
                borderColor: "#ff69b4",
                backgroundColor: "rgba(255,105,180,0.2)",
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }
    });
}
const form = document.getElementById('sleepForm');
form.addEventListener('submit', function(e){
    e.preventDefault();

    const hours = parseFloat(form.sleepHours.value);
    const productivity = parseInt(form.productivity.value);
    const mood = parseInt(form.mood.value);

    // Sleep Score calculation
    let sleepScore = Math.round((hours/8)*50 + (productivity+ mood)/2 * 5);
    if(sleepScore > 100) sleepScore = 100;

    let consistency = hours >=7 && hours <=9 ? "Good" : "Needs Improvement";

    // Suggestions logic
    let suggestions = "";
    if(hours <7) suggestions += "Try sleeping more hours. ";
    else if(hours >9) suggestions += "Avoid oversleeping. ";
    else suggestions += "Sleep duration is good. ";
    if(consistency !== "Good") suggestions += "Maintain a consistent sleep schedule.";
    else suggestions += " Keep up your consistent sleep schedule!";

    // Show results
    document.getElementById('sleepScore').textContent = sleepScore + "/100";
    document.getElementById('consistency').textContent = consistency;
    document.getElementById('suggestions').textContent = suggestions;
    document.getElementById('results').style.display = "block";

    // Save data to localStorage
    let sleepData = JSON.parse(localStorage.getItem('sleepData') || "[]");
    sleepData.push({
        date: new Date().toLocaleDateString(),
        hours,
        productivity,
        mood,
        sleepScore,
        consistency
    });
    localStorage.setItem('sleepData', JSON.stringify(sleepData));
});

// ===== This part makes the "View Weekly Report" button work =====
document.getElementById('viewReport').addEventListener('click', function() {
    window.location.href = "report.html";
});