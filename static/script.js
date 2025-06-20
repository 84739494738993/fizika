let Answers = [];
let Name_Tasks = [];

fetch("/data")
  .then(res => res.json())
  .then(data => {
    if (data.error) throw new Error(data.error);

    Answers = data.Answers || [];
    Name_Tasks = data.Name_Tasks || [];
    buildUI();
  })
  .catch(err => {
    console.error("Ошибка загрузки данных:", err);
  });

function buildUI() {
  const globalDiv = document.createElement("div");
  globalDiv.className = "globaldiv";

  for (let i = 0; i < Name_Tasks.length; i++) {
    const div = document.createElement("div");

    const questionText = document.createElement("p");
    questionText.textContent = Name_Tasks[i];

    const textarea = document.createElement('textarea');
    textarea.placeholder = "Write Answer";
    textarea.className = "answer-input";
    textarea.dataset.index = i;
    textarea.style.overflow = 'hidden';
      const autoResize = () => {
    textarea.style.height = 'auto'; // сброс высоты
    textarea.style.height = textarea.scrollHeight + 'px';
    };
    autoResize();
    textarea.addEventListener('input', autoResize);

    div.appendChild(questionText);
    div.appendChild(textarea);
    globalDiv.appendChild(div);
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

