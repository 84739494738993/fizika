let Answers = [];
let Name_Tasks = [];
let col_tasks = [];
let name_tests = [];
let wich_test = [];
let sum = 0;

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
function buildUI() {
  const globalDiv = document.createElement("div");
  globalDiv.className = "globaldiv";

  sum = 0;
    for (let j = 0; j < wich_test.length; j++) {
        if (wich_test[j]===1){
            
  for(let i = 0; i < col_tasks[j]; i++) {
    const div = document.createElement("div");

    const questionText = document.createElement("p");
    questionText.textContent = Name_Tasks[i+sum];

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Write Answer";
    textarea.className = "answer-input";
    textarea.dataset.index = i;
    textarea.style.overflow = 'hidden';
    textarea.style.minHeight = '40px';
    const autoResize = () => {
      textarea.style.height = 'auto'; // сброс
      textarea.style.height = textarea.scrollHeight + 'px'; // подгонка под содержимое
    };
    // Ставим высоту сразу (после вставки в DOM!)
    setTimeout(autoResize, 0);
    textarea.addEventListener('input', autoResize);

    div.appendChild(questionText);
    div.appendChild(textarea);
    globalDiv.appendChild(div);
    }
  }
  else{
          sum+=col_tasks[j]
        }
}

  const checkButton = document.createElement("button");
  checkButton.textContent = "Проверить";
  checkButton.id = "check-button";

  checkButton.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".answer-input");
    const userAnswers = Array.from(inputs).map(i => i.value.trim().toLowerCase());
    let mark = 0;

    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] === (Answers[i] || "").trim().toLowerCase()) {
        mark++;
      }
    }

    alert(`Правильных ответов: ${mark} из ${Answers.length}`);
    // let mark_text = document.createElement('p');
    // mark_text.textContent = "Good your mark is: "+mark;
    // globalDiv.style.display = "none";
    // document.getElementById("all").appendChild(mark_text);
  });

  globalDiv.appendChild(checkButton);
  document.getElementById("all").appendChild(globalDiv);
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
