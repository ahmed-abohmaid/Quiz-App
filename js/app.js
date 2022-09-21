/* 
  Get elements
*/
let welcomeDiv = document.querySelector(".welcome");
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

/* 
  Set Options
*/
let currentIndex = 0;
let correctAnswer = 0;
let countdownInterval;
let countdownTimer = 60;

/* 
  For Performance
*/
let fragment = document.createDocumentFragment();

/* 
  Start Quiz
*/
function startQuiz() {
  qArea.style.display = "none";
  answersArea.style.display = "none";
  theBullets.style.display = "none";
  submitButton.innerHTML = "Start Quiz";

  // Create Quiz Info
  // Welcome Msg
  let welcomeInfo = document.createElement("div");
  welcomeInfo.classList = "info";
  let welcomeInfoMsg = document.createTextNode("Welcome");
  welcomeInfo.appendChild(welcomeInfoMsg);

  // Info Msg for quiz
  let infoMsgDiv = document.createElement("div");
  let infoMsg = document.createTextNode("Notice that this quiz has a timer");
  infoMsgDiv.appendChild(infoMsg);

  // Q. Timer
  let timer = document.createElement("span");
  timer.classList = "q-timer";
  let timerMsg = document.createTextNode(
    `Each Question ${countdownTimer} Sec.`
  );
  timer.appendChild(timerMsg);
  infoMsgDiv.appendChild(timer);

  // Add to fragment then body
  fragment.appendChild(welcomeInfo);
  fragment.appendChild(infoMsgDiv);
  welcomeDiv.appendChild(fragment);

  // Click btn to start
  submitButton.onclick = function () {
    qArea.style.display = "block";
    answersArea.style.display = "block";
    theBullets.style.display = "flex";
    submitButton.innerHTML = "Next";
    welcomeDiv.remove();
    getQuestion();
  };
}
startQuiz();

/* 
  Start fetch our json file
  convert JSON data to object data
*/
async function getQuestion() {
  try {
    let myData = await fetch("html_questions.json");

    // convert JSON data to object data
    let objectData = await myData.json();
    let count = objectData.length;

    /* 
      Start create bullets & Adding questions-count
    */
    creatbullets(count);

    /* 
      Start Adding Questions rondomly
      Delete finished answer and make random index agian
    */
    // For random
    let randomIndex = Math.floor(Math.random() * count);
    let ranquestion = objectData[randomIndex];
    addQuestionsData(ranquestion, count);
    // Delete finished answer and make random index agian
    objectData.splice(objectData.indexOf(ranquestion), 1);

    /* 
      Set countdown Timer
    */
    countdown(countdownTimer, count);

    /* 
    Start dealing with submit btn
    */
    submitButton.onclick = () => {
      // Get the right answer
      let rAnswer = ranquestion.right_answer;

      // increase index
      currentIndex++;

      /* 
        Check If answer right and if right icrease right answer variable to show the result 
      */
      checkAnswer(rAnswer);

      /*
        Empty old question area to avoid duplicating
        Go to next Q.
        make random index agian with new length and Delete finished answer 
      */
      qArea.innerHTML = "";
      answersArea.innerHTML = "";

      // Delete finished answer
      let newCount = objectData.length;
      randomIndex = Math.floor(Math.random() * newCount);
      ranquestion = objectData[randomIndex];
      addQuestionsData(ranquestion, count);
      objectData.splice(objectData.indexOf(ranquestion), 1);

      /* 
        Set countdown Timer
      */
      clearInterval(countdownInterval);
      countdown(countdownTimer, count);

      /* 
        Handle bullets & answere-counter while going to the next Q.
      */
      handlebullets();

      /* 
        Convert Next btn to submit btn
      */
      if (currentIndex === count - 1) {
        submitButton.innerHTML = "Submit";
      }

      /* 
        Show Results
      */
      showResults(count);
    };
  } catch (err) {
    console.log(err);
  }
}

/* 
  create bullets & Adding questions-count
*/
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

/* 
  Adding questions to Q. area
*/
function addQuestionsData(data, count) {
  if (currentIndex < count) {
    // Create heading Q.
    let qTitle = document.createElement("h2");
    let qTitleText = document.createTextNode(data.title);

    // Adding to Q. area div
    qTitle.appendChild(qTitleText);
    fragment.appendChild(qTitle);
    qArea.appendChild(fragment);

    /* 
      For random answers
    */
    let answerArr = [];
    for (let i = 1; i <= 4; i++) {
      answerArr.push(data[`answer_${i}`]);
    }

    let ranAnswer = [],
      i = answerArr.length,
      j = 0;

    while (i--) {
      j = Math.floor(Math.random() * (i + 1));
      ranAnswer.push(answerArr[j]);
      answerArr.splice(j, 1);
    }

    /* 
      Adding answers to answers area
    */
    for (let i = 0; i < 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList = "answer";

      // Create the inputs for answers & their attr.
      let answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = "questions";
      answerInput.id = `answer_${i}`;
      answerInput.dataset.answer = `${ranAnswer[i]}`;
      if (i === 1) {
        answerInput.checked = true;
      }

      // Create inputs label
      let inputsLable = document.createElement("label");
      inputsLable.htmlFor = `answer_${i}`;

      // Create Label Text
      let inputsLableText = document.createTextNode(`${ranAnswer[i]}`);
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

/*
  Check the answer 
*/
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

/*
  Handel bullets
*/
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
      resultsInfo.innerHTML = `Don't worry, you can try again`;
      resultsInfo.classList.add("bad");
      answeredCounter.innerHTML = `You Answered ${correctAnswer} Of ${count}`;
    }
  }
}

/* 
  Countdown Timer
*/
function countdown(duration, count) {
  // To check if it's not the final Q.
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      // Check if time finish and go to next Q.
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
