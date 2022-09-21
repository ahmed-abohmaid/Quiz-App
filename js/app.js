// Get elements
let welcomeDiv = document.querySelector(".welcome")
let questionCounte = document.querySelector(
  ".questions-counter .questions-count"
);
let bulletsContainer = document.querySelector(".bullets .spans-container");
let qArea = document.querySelector(".questions-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit");
let theBullets = document.querySelector(".bullets");
let results = document.querySelector(".results");
let resultsInfo = document.querySelector(".results .info");
let answeredCounter = document.querySelector(".results .answere-counter");
let countdownElement = document.querySelector(".timer");

// Set Options
let currentIndex = 0;
let correctAnswer = 0;
let countdownInterval;
let countdownTimer = 60;

// For Performance
let fragment = document.createDocumentFragment();

// Btn To Start Quiz
function startQuiz() {
  qArea.style.display = "none";
  answersArea.style.display = "none";
  theBullets.style.display = "none";
  submitButton.innerHTML = "Start Quiz";

  // Create Quiz Info
  // Welcome Msg
  let welcomeInfo =  document.createElement("div");
  welcomeInfo.classList = "info"
  let welcomeInfoMsg = document.createTextNode("Welcome");
  welcomeInfo.appendChild(welcomeInfoMsg);
  
  // Info Msg for quiz
  let infoMsgDiv = document.createElement("div");
  let infoMsg = document.createTextNode("Notice that this quiz has a timer");
  infoMsgDiv.appendChild(infoMsg);

  // Q. Timer
  let timer = document.createElement("span");
  timer.classList = "q-timer";
  let timerMsg = document.createTextNode(`Each Question ${countdownTimer} Sec.`);
  timer.appendChild(timerMsg);
  infoMsgDiv.appendChild(timer);

  // Add to fragment then body
  fragment.appendChild(welcomeInfo);
  fragment.appendChild(infoMsgDiv);
  welcomeDiv.appendChild(fragment);

  // Click
  submitButton.onclick = function () {
    qArea.style.display = "block";
    answersArea.style.display = "block";
    theBullets.style.display = "flex";
    submitButton.innerHTML = "Submit";
    welcomeDiv.remove();
    getQuestion();
  }
}
startQuiz();

// Start fetch our json file
async function getQuestion() {
  try {
    let myData = await fetch("html_questions.json");

    // convert JSON data to object data
    let objectData = await myData.json();
    let count = objectData.length;

    // Start create bullets & Adding questions-count
    creatbullets(count);

    // Start Adding Questions
    addQuestionsData(objectData[currentIndex], count);

    // Set countdown Timer
    countdown(countdownTimer, count);

    // Start dealing with submit btn
    submitButton.onclick = () => {
      // Get the right answer
      let rAnswer = objectData[currentIndex].right_answer;

      // increase index
      currentIndex++;

      // Check the answer
      checkAnswer(rAnswer);

      // Go to next Q.
      qArea.innerHTML = "";
      answersArea.innerHTML = "";
      addQuestionsData(objectData[currentIndex], count);

      // Set countdown Timer
      clearInterval(countdownInterval);
      countdown(countdownTimer, count);

      // Handle bullets & answere-counter while going to the next Q.
      handlebullets();

      // Show Results
      showResults(count);
    };
  } catch (err) {
    console.log(err);
  }
}

// create bullets & Adding questions-count
function creatbullets(num) {
  // Adding bullets
  for (let i = 0; i < num; i++) {
    let bullit = document.createElement("span");
    if (i === 0) {
      bullit.classList = "active";
    }
    fragment.appendChild(bullit);
  }
  bulletsContainer.appendChild(fragment);

  // Adding questions-count
  questionCounte.innerHTML = `${num}`;
}

// Questions => Q.
// Adding Q.
function addQuestionsData(data, count) {
  if (currentIndex < count) {
    // Create heading Q.
    let qTitle = document.createElement("h2");
    let qTitleText = document.createTextNode(data.title);

    // Adding to Q. area div
    qTitle.appendChild(qTitleText);
    fragment.appendChild(qTitle);
    qArea.appendChild(fragment);

    // Adding answers to answers area
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList = "answer";

      // Create the inputs for answers & their attr.
      let answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = "questions";
      answerInput.id = `answer_${i}`;
      answerInput.dataset.answer = `${data[`answer_${i}`]}`;
      if (i === 1) {
        answerInput.checked = true;
      }

      // Create inputs label
      let inputsLable = document.createElement("label");
      inputsLable.htmlFor = `answer_${i}`;

      // Create Label Text
      let inputsLableText = document.createTextNode(data[`answer_${i}`]);
      inputsLable.appendChild(inputsLableText);

      // Adding input & label to mainDiv, and mainDiv to the fragment then to answers area
      mainDiv.appendChild(answerInput);
      mainDiv.appendChild(inputsLable);
      answersArea.appendChild(mainDiv);
    }

    // Adding to Q. area div
    fragment.appendChild(answersArea);
    qArea.appendChild(fragment);
  }
}

function checkAnswer(rAnswer) {
  let theAnswer = document.getElementsByName("questions");
  let choosenAnswer;

  for (let i = 0; i < theAnswer.length; i++) {
    if (theAnswer[i].checked) {
      choosenAnswer = theAnswer[i].dataset.answer;
      // console.log(choosenAnswer);
    }
  }

  if (choosenAnswer === rAnswer) {
    correctAnswer++;
  }
}

// Handel bullets
function handlebullets() {
  let bulletsSpans = document.querySelectorAll(
    ".bullets .spans-container span"
  );
  let arrayOfbullets = Array.from(bulletsSpans);

  arrayOfbullets.forEach((span, i) => {
    if (currentIndex === i) {
      span.classList = "active";
    }
  });
}

function showResults(count) {
  if (currentIndex === count) {
    qArea.remove();
    answersArea.remove();
    submitButton.remove();
    theBullets.remove();
    results.style.display = "flex";

    if (correctAnswer > count / 2 && correctAnswer < count) {
      resultsInfo.innerHTML = `Good`;
      resultsInfo.classList.add("good");
      answeredCounter.innerHTML = `You Answered ${correctAnswer} Of ${count}`;
    } else if (correctAnswer === count) {
      resultsInfo.innerHTML = `Perfect`;
      resultsInfo.classList.add("perfect");
      answeredCounter.innerHTML = `You Answered ${correctAnswer} Of ${count}`;
    } else {
      resultsInfo.innerHTML = `Bad`;
      resultsInfo.classList.add("bad");
      answeredCounter.innerHTML = `You Answered ${correctAnswer} Of ${count}`;
    }
  }
}

// Countdown Timer
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
