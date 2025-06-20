let Answers = [];
let Name_Tasks = [];

fetch("/data")
  .then(response => response.json())
  .then(data => {
    Name_Tasks = data.Name_Tasks || [];
    Answers = data.Answers || [];
    buildUI(); // вызываем построение интерфейса после загрузки
  })
  .catch(error => console.error("Ошибка при загрузке данных:", error));

function buildUI() {
  let global_div = createGlobalDiv();

  for(let i = 0; i < Name_Tasks.length; i++) {
    let div = createDiv(i);
    let Input_question = createInput_question(i, Name_Tasks[i]);
    let Input_answers = createInput_answer(i, Answers[i]);

    div.appendChild(Input_question);
    div.appendChild(Input_answers);
    global_div.appendChild(div);
  }

  let button = document.getElementById('button');
  let button1 = document.getElementById('button1');
  let button2 = document.getElementById('button2');
  let select = document.getElementById('select');

  global_div.appendChild(button);
  global_div.appendChild(button1);
  global_div.appendChild(select);
  global_div.appendChild(button2);
  document.getElementById("all").appendChild(global_div);

  // Заполняем селект
  for(let i = 0; i < Name_Tasks.length; i++) {
    addOption(Name_Tasks[i]);
  }

  // Навешиваем обработчики
  button.addEventListener("click", async () => {
    const answers = Array.from(document.querySelectorAll(".answer-input")).map(i => i.value);
    const questions = Array.from(document.querySelectorAll(".question-input")).map(i => i.value);
    await updateQuestions(questions);
    await updateAnswers(answers);
    setTimeout(() => location.reload(), 3000);
  });

  button1.addEventListener("click", async () => {
    Name_Tasks.push("");
    Answers.push("");
    await updateQuestions(Name_Tasks);
    await updateAnswers(Answers);
    setTimeout(() => location.reload(), 3000);
  });

  button2.addEventListener("click", async () => {
    const select = document.getElementById("select");
    const index = select.selectedIndex;
    const text = select.options[index].text;
    if (text !== "CHOOSE") {
      Name_Tasks.splice(index - 1, 1);
      Answers.splice(index - 1, 1);
      await updateQuestions(Name_Tasks);
      await updateAnswers(Answers);
      setTimeout(() => location.reload(), 3000);
    } else {
      alert("Choose which question!!!");
    }
  });
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

async function updateAnswers(answers) {
  const res = await fetch("/update_answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();
  if (data.status !== "ok") console.error("Ошибка обновления ответов");
}

function createGlobalDiv() {
  let globalDiv = document.createElement('div');
  globalDiv.className = "globaldiv";
  return globalDiv;
}
function createDiv() {
  let innerDiv = document.createElement('div');
  return innerDiv;
}
// function createInput_question(i, j) {
//   let input = document.createElement('input');
//   input.value = j;
//   input.className = "question-input";
//   input.dataset.index = i;
//   return input;
// }
function createInput_question(i, j) {
  let textarea = document.createElement('textarea');
  textarea.value = j;
  textarea.className = "question-input";
  textarea.dataset.index = i;
  textarea.style.overflow = 'hidden';
  return textarea;
}
function createInput_answer(i, j) {
  let textarea = document.createElement('textarea');
  textarea.value = j;
  textarea.className = "answer-input";
  textarea.dataset.index = i;
  textarea.style.overflow = 'hidden';
  return textarea;
}
function addOption(text) {
  const select = document.getElementById("select");
  const option = document.createElement("option");
  option.text = text;
  option.value = text.toLowerCase();
  select.appendChild(option);
}
