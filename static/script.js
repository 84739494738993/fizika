let Answers = [];
let Name_Tasks = [];
let col_tasks = [];
let name_tests = [];
let wich_test = [];
let sum = 0;

let button8 = document.getElementById('button8');

button8.addEventListener("click", function () {
  window.location.href = "/";
});

fetch("/data")
  .then(response => response.json())
  .then(data => {
    Name_Tasks = data.Name_Tasks || [];
    Answers = data.Answers || [];
    name_tests = data.name_tests || [];
    col_tasks = data.col_tasks || [];
    wich_test = data.wich_test || [];
    buildUI(); // вызываем построение интерфейса после загрузки
  })
  .catch(error => console.error("Ошибка при загрузке данных:", error));

function showQuestionSelector() {
  const allDiv = document.getElementById("all");
  allDiv.innerHTML = '';

  const selectorContainer = document.createElement("div");
  selectorContainer.className = "selector-container";

  sum = 0;
  let testIndex = wich_test.findIndex(w => w === 1);
  if (testIndex === -1) {
    allDiv.innerHTML = "<p>Нет активных тестов</p>";
    return;
  }

  for (let i = 0; i < col_tasks[testIndex]; i++) {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = i;
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.append(` ${i + 1}. ${Name_Tasks[i + sum]}`);
    selectorContainer.appendChild(label);
  }

  const startButton = document.createElement("button");
  startButton.textContent = "Начать тест";
  startButton.addEventListener("click", () => {
    const checkboxes = selectorContainer.querySelectorAll("input[type='checkbox']:checked");
    const selectedIndexes = Array.from(checkboxes).map(cb => parseInt(cb.value));
    buildUI(selectedIndexes);
  });

  allDiv.appendChild(selectorContainer);
  allDiv.appendChild(startButton);
}

function buildUI(selectedIndexes) {
  const allDiv = document.getElementById("all");
  allDiv.innerHTML = ''; // Очищаем контейнер
  
  const globalDiv = document.createElement("div");
  globalDiv.className = "globaldiv";

  sum = 0;
  let testFound = false;
  
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 1) {
      testFound = true;
      let questionCount = 0;
      
      for(let i = 0; i < col_tasks[j]; i++) {
        // Пропускаем вопросы, которые не выбраны
        if (selectedIndexes && !selectedIndexes.includes(i)) {
          continue;
        }
        
        questionCount++;
        const div = document.createElement("div");
        div.className = "question-container";
        div.dataset.questionIndex = i + sum; // Сохраняем глобальный индекс вопроса

        const questionText = document.createElement("p");
        questionText.textContent = `${questionCount}. ${Name_Tasks[i+sum]}`;
        div.appendChild(questionText);

        // Обработка ответов (новый и старый формат)
        try {
          const answerData = JSON.parse(Answers[i+sum]);
          
          // Если есть варианты ответов
          if (answerData.options && Object.values(answerData.options).some(v => v)) {
            const optionsDiv = document.createElement("div");
            optionsDiv.className = "options-container";
            
            for (const [key, value] of Object.entries(answerData.options)) {
              if (value) {
                const optionDiv = document.createElement("div");
                optionDiv.className = "option";
                
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `question-${i+sum}`; // Используем глобальный индекс
                radio.value = key;
                radio.id = `question-${i+sum}-${key}`;
                
                const label = document.createElement("label");
                label.htmlFor = `question-${i+sum}-${key}`;
                label.textContent = `${key.toUpperCase()}. ${value}`;
                
                optionDiv.appendChild(radio);
                optionDiv.appendChild(label);
                optionsDiv.appendChild(optionDiv);
              }
            }
            
            div.appendChild(optionsDiv);
          } else if (answerData.text) {
            // Если есть только текст ответа
            const textarea = document.createElement('textarea');
            textarea.placeholder = "Write Answer";
            textarea.className = "answer-input";
            textarea.dataset.index = i + sum; // Используем глобальный индекс
            textarea.style.overflow = 'hidden';
            textarea.style.minHeight = '40px';
            
            const autoResize = () => {
              textarea.style.height = 'auto';
              textarea.style.height = textarea.scrollHeight + 'px';
            };
            
            setTimeout(autoResize, 0);
            textarea.addEventListener('input', autoResize);
            div.appendChild(textarea);
          }
        } catch (e) {
          // Старый формат (просто текст)
          const textarea = document.createElement('textarea');
          textarea.placeholder = "Write Answer";
          textarea.className = "answer-input";
          textarea.dataset.index = i + sum; // Используем глобальный индекс
          textarea.style.overflow = 'hidden';
          textarea.style.minHeight = '40px';
          
          const autoResize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          };
          
          setTimeout(autoResize, 0);
          textarea.addEventListener('input', autoResize);
          div.appendChild(textarea);
        }

        globalDiv.appendChild(div);
      }
      break;
    } else {
      sum += col_tasks[j];
    }
  }

  if (!testFound) {
    const noTestMsg = document.createElement("p");
    noTestMsg.textContent = "Нет активных тестов";
    globalDiv.appendChild(noTestMsg);
  }

  const checkButton = document.createElement("button");
  checkButton.textContent = "Проверить";
  checkButton.id = "check-button";
  checkButton.addEventListener("click", checkAnswers);
  
  globalDiv.appendChild(checkButton);
  allDiv.appendChild(globalDiv);
}

function checkAnswers() {
  let mark = 0;
  let totalQuestions = 0;
  let currentTestIndex = -1;
  
  // Находим активный тест
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 1) {
      currentTestIndex = j;
      totalQuestions = col_tasks[j];
      break;
    }
  }

  if (currentTestIndex === -1) {
    alert("Нет активных тестов для проверки");
    return;
  }

  // Получаем все контейнеры вопросов
  const questionContainers = document.querySelectorAll('.question-container');
  totalQuestions = questionContainers.length; // Обновляем общее количество вопросов
  
  questionContainers.forEach(container => {
    const questionIndex = parseInt(container.dataset.questionIndex);
    try {
      const answerData = JSON.parse(Answers[questionIndex]);
      
      if (answerData.type === "options" || (answerData.options && Object.values(answerData.options).some(v => v))) {
        // Проверка вариантов ответа
        const selectedOption = container.querySelector(`input[name="question-${questionIndex}"]:checked`);
        if (selectedOption && selectedOption.value === answerData.correct) {
          mark++;
        }
      } else {
        // Проверка текстового ответа
        const userAnswer = container.querySelector(`.answer-input[data-index="${questionIndex}"]`)?.value.trim().toLowerCase() || "";
        const correctAnswer = (answerData.text || "").toLowerCase().trim();
        
        let userFixed = fixKeyboardLayout(userAnswer);
        let correctFixed = fixKeyboardLayout(correctAnswer);
        let distance = levenshtein(userFixed, correctFixed);
        
        if (userAnswer.length > 5) {
          if (userFixed === correctFixed || distance <= 1) mark++;
        } else {
          if (userFixed === correctFixed) mark++;
        }
      }
    } catch (e) {
      console.error("Ошибка при проверке ответа:", e);
    }
  });

  alert(`Правильных ответов: ${mark} из ${totalQuestions}`);
}

function fixKeyboardLayout(str) {
  const similarMap = {
    'a': 'а', 'A': 'А',
    'o': 'о', 'O': 'О',
    'c': 'с', 'C': 'С',
    'e': 'е', 'E': 'Е',
    'p': 'р', 'P': 'Р',
    'x': 'х', 'X': 'Х',
    'y': 'у', 'Y': 'У',
  };

  return str.split('').map(char => similarMap[char] || char).join('');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

async function updateQuestions(questions) {
  const res = await fetch("/update_questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления вопросов");
}

async function updateWichTest(wich_test) {
  const res = await fetch("/wich_test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wich_test }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления вопросов");
}

async function updateNameTests(name_tests) {
  const res = await fetch("/name_tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name_tests }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления вопросов");
}

async function updateColTasks(col_tasks) {
  const res = await fetch("/col_tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ col_tasks }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления вопросов");
}

async function updateAnswers(answers) {
  const res = await fetch("/update_answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления ответов");
}