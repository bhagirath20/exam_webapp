const questions = examData.questions;
const examId = examData.examId;
const examSubject = examData.examSubject;
const examChapter = examData.examChapter;
const examStartTime = examData.examStartTime;
const examDuration = examData.examDuration;
const validUsers = examData.validUsers;
const examEndTime = new Date(examStartTime.getTime() + examDuration);

let currentQuestion = 0;
let score = 0;
let timeLeft = examDuration / 1000; // Time left in seconds
let timerInterval;
let answers = [];
let username;

document.getElementById("examId").textContent = examId;
document.getElementById("examSubject").textContent = examSubject;
document.getElementById("examChapter").textContent = examChapter;
document.getElementById("examStartTimeDisplay").textContent =
  examStartTime.toLocaleString();
document.getElementById("examDurationDisplay").textContent = `${
  examDuration / 60000
} minutes`; // Display duration

// ... (rest of the JavaScript logic remains the same) ...
function checkStartTime() {
  const now = new Date();
  const timeDiff = examStartTime - now;
  const endTimeDiff = examEndTime - now;

  if (endTimeDiff <= 0) {
    document.getElementById("startButton").disabled = true;
    document.getElementById("startTime").textContent = "Exam has ended.";
    clearInterval(timeCheckInterval);
    return;
  }

  if (timeDiff <= 0) {
    document.getElementById("startButton").disabled = false;
    document.getElementById(
      "startTime"
    ).textContent = `Exam Started! Click the button to begin. Exam Duration : ${
      examDuration / 60000
    } Minutes.`;
  } else {
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    document.getElementById(
      "startTime"
    ).textContent = `Exam will start in ${minutes}m ${seconds}s. Exam Duration : ${
      examDuration / 60000
    } Minutes.`;
  }
}

const timeCheckInterval = setInterval(checkStartTime, 1000);
checkStartTime(); // Initial check

function startExam() {
  const now = new Date();
  if (now > examEndTime) {
    alert("Exam has ended.");
    return;
  }
}

function startExam() {
  username = document.getElementById("username").value;

  if (!username || !validUsers.includes(username)) {
    alert("Please enter a valid username.");
    return;
  }

  const examKey = `${username}_${examId}`;

  if (localStorage.getItem(examKey)) {
    alert("You have already taken this exam.");
    return;
  }

  const now = new Date();
  if (now > examEndTime) {
    alert("Exam has ended.");
    return;
  }

  document.documentElement.requestFullscreen().catch((err) => {
    console.error(`Fullscreen request failed: ${err.message}`);
  });

  document.getElementById("start-container").style.display = "none";
  document.getElementById("exam-container").style.display = "block";
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const questionData = questions[currentQuestion];
    document.getElementById("question").textContent = questionData.question;
    let optionsHtml = "";
    questionData.options.forEach((option) => {
      optionsHtml += `<label><input type="radio" name="answer" value="${option}"> ${option}</label><br>`;
    });
    document.getElementById("options").innerHTML = optionsHtml;
    if (answers[currentQuestion]) {
      document.querySelector(
        `input[name="answer"][value="${answers[currentQuestion]}"]`
      ).checked = true;
    }
    document.getElementById("prevBtn").disabled = currentQuestion === 0;
  } else {
    showResult();
  }
}

function submitAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    answers[currentQuestion] = selectedAnswer.value;
  } else {
    answers[currentQuestion] = null;
  }

  if (
    selectedAnswer &&
    selectedAnswer.value === questions[currentQuestion].answer
  ) {
    score++;
  }
  currentQuestion++;
  loadQuestion();
}

function prevQuestion() {
  currentQuestion--;
  loadQuestion();
}

// function startTimer() {
//   timerInterval = setInterval(() => {
//     timeLeft--;
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;
//     document.getElementById("timer").textContent = `${minutes}:${
//       seconds < 10 ? "0" + seconds : seconds
//     }`;
//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       showResult();
//     }
//   }, 1000);
// }

function startTimer() {
  timerInterval = setInterval(() => {
    const now = new Date();
    timeLeft = Math.floor((examEndTime - now) / 1000); // Time left in seconds

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
      return; // Exit the timer function to prevent negative time display
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  }, 1000);
}

function showResult() {
  clearInterval(timerInterval);
  document.getElementById("exam-container").style.display = "none";
  document.getElementById("result-container").style.display = "block";
  document.getElementById("resultName").textContent = username;
  document.getElementById("score").textContent = score;
  const examKey = `${username}_${examId}`;
  localStorage.setItem(examKey, JSON.stringify(answers));
  document.exitFullscreen();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    alert("Browser switching is not allowed during the exam.");
    window.location.reload();
  }
});

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey &&
    (e.key === "c" ||
      e.key === "v" ||
      e.key === "x" ||
      e.key === "u" ||
      e.key === "s")
  ) {
    e.preventDefault();
  }
});
