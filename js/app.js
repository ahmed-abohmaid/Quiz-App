// Get elements
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
getQuestion();

// For Performance
let fragment = document.createDocumentFragment();

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
