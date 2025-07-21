let Answers = [];
let Name_Tasks = [];
let col_tasks = [];
let name_tests = [];
let wich_test = [];
let sum = 0;

  let button = document.getElementById('button')
  let button1 = document.getElementById('button1')
  let button2 = document.getElementById('button2')
  let button3 = document.getElementById('button3')
  let button4 = document.getElementById('button4')
  let button5 = document.getElementById('button5')
  let button6 = document.getElementById('button6')
  let button7 = document.getElementById('button7')
  let button8 = document.getElementById('button8')
  let input = document.getElementById('input')
  let border_for_menu = document.getElementById('border_for_menu')
  let select = document.getElementById('select')
  let button9 = document.getElementById('button9')
  let select3 = document.getElementById('select3')
  let input10 = document.getElementById('input10')
  let button10 = document.getElementById('button10')
  let button11 = document.getElementById('button11')

fetch("/data")
  .then(response => response.json())
  .then(data => {
    Name_Tasks = data.Name_Tasks || [];
    Answers = data.Answers || [];
    name_tests = data.name_tests || [];
    col_tasks = data.col_tasks || [];
    wich_test = data.wich_test || [];
    start_setings();
    buildUI(); // вызываем построение интерфейса после загрузки
    })
  .catch(error => console.error("Ошибка при загрузке данных:", error));

  async function start_setings(){
  let flag = false
  let len = wich_test.length;
    let old_index = 0;
    for (let i = 0; i < len; i++) {
      if (wich_test[i] === 3){
          old_index = i
          wich_test = [];
      for (let i = 0; i < len; i++) {
          wich_test.push(0);
        }
        wich_test[old_index] = 2;
        flag = true

      button4.style.display = "none";
      button3.style.display = "none";
      button9.style.display = "none";
      button6.style.display = "none";
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "none";
      select3.style.display = "none";
      button8.style.display = "block";
      button10.style.display = "none";
      input10.style.display = "none";
      button11.style.display = "none";
    }
  }
  if (flag === false){
    for (let i = 0; i < len; i++) {
       if (wich_test[i] === 1){
          old_index = i
    }
  }
  wich_test = [];
    for (let i = 0; i < len; i++) {
      wich_test.push(0);
  }
  wich_test[old_index] = 1;
  }
  await updateWichTest(wich_test);
}

function buildUI() {  
  let global_div = createGlobalDiv();
    sum = 0;
    for (let j = 0; j < wich_test.length; j++) {
        if (wich_test[j]===2){
            
  for(let i = 0; i < col_tasks[j]; i++) {
    let div = createDiv(i);
    let Input_question = createInput_question(i, Name_Tasks[i+sum]);
    let Input_answers = createInput_answer(i, Answers[i+sum]);

    div.appendChild(Input_question);
    div.appendChild(Input_answers);
    global_div.appendChild(div);
    }
    break
  }
    else{
          sum+=col_tasks[j]
        }
      // console.log(sum,sum+col_tasks[j])

  }




  global_div.appendChild(button4);
  global_div.appendChild(button1);
  global_div.appendChild(select);
  global_div.appendChild(button2);
  global_div.appendChild(button);
  global_div.appendChild(button6);
  global_div.appendChild(input);
  global_div.appendChild(button3);
  global_div.appendChild(button5);
  global_div.appendChild(border_for_menu)
  global_div.appendChild(button7)
  global_div.appendChild(button11);
  global_div.appendChild(select3)
  global_div.appendChild(button9)
  global_div.appendChild(input10);
  global_div.appendChild(button10);
  border_for_menu.appendChild(button6)
  border_for_menu.appendChild(input)
  border_for_menu.appendChild(button3)
  document.getElementById("all").appendChild(global_div);


button6.addEventListener("click", function () {
  // button4.style.display = button4.style.display === "none" ? "block" : "none";
  input.style.display = input.style.display === "block" ? "none" : "block";
  button3.style.display = button3.style.display === "block" ? "none" : "block";
});
button7.addEventListener("click", function () {
  window.location.href = "admin";
});
button8.addEventListener("click", function () {
  window.location.href = "/";
});
if(name_tests.length>0){
  button11.addEventListener("click", function () {
    select3.style.display = select3.style.display === "block" ? "none" : "block";
    input10.style.display = input10.style.display === "block" ? "none" : "block";
    button10.style.display = button10.style.display === "block" ? "none" : "block";
    button9.style.display = button9.style.display === "block" ? "none" : "block";
    });
}
else{
  button11.style.display = "none"
}
  // Заполняем селект
  sum = 0;
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 2) {
      for(let i = 0; i < col_tasks[j]; i++) {
        addOption(Name_Tasks[i+sum]);
  }
}
     else {
      sum += col_tasks[j];
    }
  }

  // Навешиваем обработчики
 // В функции сохранения (button click handler) замените сбор ответов:
button.addEventListener("click", async () => {
  let sum = 0;
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 2) {
      wich_test[j] = 3;
      const questionInputs = document.querySelectorAll(".question-input");
      
      for (let i = 0; i < col_tasks[j]; i++) {
        Name_Tasks[i + sum] = questionInputs[i].value;
        Answers[i + sum] = collectAnswerData(i);
      }
    } else {
      sum += col_tasks[j];
    }
  }
  
  try {
    await Promise.all([
      updateColTasks(col_tasks),
      updateQuestions(Name_Tasks),
      updateNameTests(name_tests),
      updateWichTest(wich_test),
      updateAnswers(Answers)
    ]);
    
    window.location.href = "admin";
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    alert("Произошла ошибка при сохранении. Проверьте консоль для подробностей.");
  }
});

button1.addEventListener("click", async () => {
  // Сначала сохраняем текущие данные
  let sum = 0;
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 2) {
      const questionInputs = document.querySelectorAll(".question-input");
      
      for (let i = 0; i < col_tasks[j]; i++) {
        Name_Tasks[i + sum] = questionInputs[i].value;
        Answers[i + sum] = collectAnswerData(i);
      }
      
      // Затем добавляем новый вопрос
      let k = j;
      wich_test[k] = 3;
      col_tasks[k] = col_tasks[k] + 1;
      Name_Tasks.splice(sum + col_tasks[k] - 1, 0, "");
      Answers.splice(sum + col_tasks[k] - 1, 0, JSON.stringify({
        text: "",
        options: { a: "", b: "", c: "", d: "" },
        correct: "a",
        type: "options" // По умолчанию новый вопрос будет с вариантами
      }));
    } else {
      sum += col_tasks[j];
    }
  }
  
  await updateQuestions(Name_Tasks);
  await updateColTasks(col_tasks);
  await updateNameTests(name_tests);
  await updateWichTest(wich_test);
  await updateAnswers(Answers);
  
  setTimeout(() => {
    window.location.href = "admin";
  }, 1000);
});

  button2.addEventListener("click", async () => {
    const select = document.getElementById("select");
    const index = select.selectedIndex;
    const text = select.options[index].text;
    if (text !== "CHOOSE") {
        sum = 0;
  for (let r = 0; r < wich_test.length; r++) {
    if (wich_test[r] === 2) {
      Name_Tasks.splice(index-1+sum, 1);
      Answers.splice(index-1+sum, 1);
      }
       else {
        sum += col_tasks[r];
      }
    }
      let k = 0;
    for (let j = 0; j < wich_test.length; j++) {
        if (wich_test[j]===2){k = j;wich_test[k] = 3;break}

      }
      col_tasks[k] = col_tasks[k]-1
      await updateColTasks(col_tasks);
      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers)
  setTimeout(() => {
  window.location.href = "admin";
}, 1000);
// buildUI();
   } else {
      alert("Выбирите вопрос какой хотите удалить!!!");
    }
  });
  button4.addEventListener("click", async () => {
  let new_div = createDiv();
  new_div.className = "new_div";
  global_div.style.display = "none";
  button5.style.display = "block"
  new_div.appendChild(button5);
  button5.addEventListener("click", async () => {
    window.location.href = "admin";
  });
  let new_select = document.getElementById("select2")
  new_select.style.display = "block";
  for (let i = 0; i < name_tests.length; i++) {
    let new_button = createButton(name_tests[i]);

    new_button.setAttribute("data-index", i);

    new_button.addEventListener("click",async (event) => {
      let index = event.target.getAttribute("data-index");
      let len = wich_test.length;
      let old_index = 0;
      for (let i = 0; i < len; i++) {
         if (wich_test[i] === 1){
            old_index = i
      }
      
    }
      wich_test = [];
      for (let i = 0; i < len; i++) {
        wich_test.push(0);
    }
    if (new_select.selectedIndex === 0){
        wich_test[index] = 1
      }
      if(new_select.selectedIndex === 1){
        wich_test[old_index] = 1
        wich_test[index] = 2
        console.log(index,old_index)
      } 

      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers)
      if (new_select.selectedIndex === 0){
        window.location.href = "admin";
      }
      global_div.style.display = "block";
      new_div.style.display = "none"
      button4.style.display = "none";
      button3.style.display = "none";
      button9.style.display = "none";
      button6.style.display = "none";
      new_select.style.display = "none";
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "none";
      select3.style.display = "none";
      button10.style.display = "none";
      input10.style.display = "none";
      button11.style.display = "none";
  setTimeout(() => {
    // window.location.href = "admin";
}, 1000);
buildUI();
    });
    new_div.appendChild(new_button);
  }
  
  document.getElementById("all").appendChild(new_div);
});


 button3.addEventListener("click",async () => {
  if (input.value != ""){
    name_tests.push(input.value)
    col_tasks.push(1)
    start_setings()
    wich_test.push(2)
    Name_Tasks.push("")
    Answers.push("")
      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers);
      global_div.style.display = "block";
      button4.style.display = "none";
      button3.style.display = "none";
      button9.style.display = "none";
      button6.style.display = "none";
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "none";
      input.style.display = "none";
      select3.style.display = "none";
      button10.style.display = "none";
      input10.style.display = "none";
      button11.style.display = "none";
      
      
      setTimeout(() => {
  // window.location.href = "admin";
}, 1000);
buildUI();
  }else{alert("Введите имя теста изменить его будет нельзя")}  
 })

   for (let i = 0; i < name_tests.length; i++) {
    addOption3(name_tests[i])
  }

  button10.addEventListener("click",async () => {
    let wybor = select3.selectedIndex;
    if (wybor != ""){
    if (input10.value != ""){
    name_tests[wybor-1] = input10.value;
    await updateNameTests(name_tests);
    setTimeout(() => {
  window.location.href = "admin";
}, 1000);
}
else{alert("Теперь введите новое имя теста")}
}else{alert("Сначала выберите тест которий хотите удалить/изменить")}
  });

button9.addEventListener("click",async () => {
  let wybor = select3.selectedIndex
  let summa = col_tasks[wybor-1]
  let sum = 0;
  let k = 0;
  for (let j = 0; j < wybor-1; j++) {
      sum += col_tasks[j];
  }
  // console.log(summa,wybor,sum)
  
  if (wybor != ""){
    name_tests.splice(wybor-1, 1);
    col_tasks.splice(wybor-1, 1);
    wich_test.splice(wybor-1, 1);
    Name_Tasks.splice(sum, summa);
    Answers.splice(sum, summa);

      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers);     
      
  setTimeout(() => {
  window.location.href = "admin";
}, 1000);
buildUI();
  }else{alert("Сначала выберите тест которий хотите удалить/изменить")}  
 })

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
  try {
    const res = await fetch("/update_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ошибка: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Ответ не в формате JSON");
    }

    const data = await res.json();

    if (!data.status || data.status !== "ok") {
      throw new Error("Ответ не содержит status: ok");
    }

    console.log("Ответ успешно обновлен");
  } catch (e) {
    console.error("Ошибка при обновлении ответов:", e);
  }
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
  textarea.placeholder = "Введите вопрос"
  textarea.style.overflow = 'hidden';
  textarea.style.minHeight = '40px';
  const autoResize = () => {
    textarea.style.height = 'auto'; // сброс
    textarea.style.height = textarea.scrollHeight + 'px'; // подгонка под содержимое
  };
  // Ставим высоту сразу (после вставки в DOM!)
  setTimeout(autoResize, 0);
  textarea.addEventListener('input', autoResize);
  return textarea;
}
// Замените функцию createInput_answer на эту:
function createInput_answer(i, j) {
  let container = document.createElement('div');
  container.className = "answer-container";
  container.dataset.index = i;
  
  // Парсим существующий ответ или создаем новый формат
  let answerData = {};
  try {
    answerData = j ? JSON.parse(j) : null;
  } catch (e) {
    answerData = null;
  }

  if (!answerData || typeof answerData !== 'object') {
    answerData = {
      text: j || "",
      options: { a: "", b: "", c: "", d: "" },
      correct: "a",
      type: j ? "text" : "options" // Добавляем тип вопроса
    };
  } else {
    if (!answerData.options || typeof answerData.options !== 'object') {
      answerData.options = { a: "", b: "", c: "", d: "" };
    }
    if (!answerData.correct) {
      answerData.correct = "a";
    }
    if (!answerData.type) {
      answerData.type = answerData.text && !Object.values(answerData.options).some(v => v) ? "text" : "options";
    }
  }

  // Добавляем переключатель типа вопроса
  let typeSelector = document.createElement('div');
  typeSelector.style.marginBottom = '10px';
  typeSelector.style.display = 'flex';
  typeSelector.style.gap = '10px';
  
  let optionsLabel = document.createElement('label');
  let optionsRadio = document.createElement('input');
  optionsRadio.type = 'radio';
  optionsRadio.name = `question-type-${i}`;
  optionsRadio.value = 'options';
  optionsRadio.checked = answerData.type === 'options';
  optionsLabel.appendChild(optionsRadio);
  optionsLabel.appendChild(document.createTextNode('Варианты ответов'));
  
  let textLabel = document.createElement('label');
  let textRadio = document.createElement('input');
  textRadio.type = 'radio';
  textRadio.name = `question-type-${i}`;
  textRadio.value = 'text';
  textRadio.checked = answerData.type === 'text';
  textLabel.appendChild(textRadio);
  textLabel.appendChild(document.createTextNode('Текстовый ответ'));
  
  typeSelector.appendChild(optionsLabel);
  typeSelector.appendChild(textLabel);
  container.appendChild(typeSelector);

  // Поле для текста ответа (если нужен)
  let answerText = document.createElement('textarea');
  answerText.value = answerData.text || "";
  answerText.className = "answer-text-input";
  answerText.placeholder = "Текст ответа";
  answerText.style.overflow = 'hidden';
  answerText.style.minHeight = '40px';
  answerText.style.width = '100%';
  answerText.style.marginBottom = '10px';
  answerText.style.display = answerData.type === 'text' ? 'block' : 'none';
  
  const autoResize = () => {
    answerText.style.height = 'auto';
    answerText.style.height = answerText.scrollHeight + 'px';
  };
  
  setTimeout(autoResize, 0);
  answerText.addEventListener('input', autoResize);
  container.appendChild(answerText);

  // Контейнер для вариантов ответов
  let optionsContainer = document.createElement('div');
  optionsContainer.className = "options-container";
  optionsContainer.style.display = answerData.type === 'options' ? 'block' : 'none';
  
  // Варианты ответов a, b, c, d
  ['a', 'b', 'c', 'd'].forEach(option => {
    let optionDiv = document.createElement('div');
    optionDiv.style.display = 'flex';
    optionDiv.style.alignItems = 'center';
    optionDiv.style.marginBottom = '5px';
    
    let radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `correct-answer-${i}`;
    radio.value = option;
    radio.checked = answerData.correct === option;
    radio.style.marginRight = '10px';
    radio.style.display = answerData.type === 'options' ? 'block' : 'none';
    
    let label = document.createElement('span');
    label.textContent = `${option.toUpperCase()}: `;
    label.style.marginRight = '5px';
    label.style.minWidth = '30px';
    
    let input = document.createElement('input');
    input.type = 'text';
    input.value = answerData.options[option] || "";
    input.className = "answer-option-input";
    input.dataset.option = option;
    input.style.flex = '1';
    input.placeholder = `Вариант ${option.toUpperCase()}`;
    input.style.display = answerData.type === 'options' ? 'block' : 'none';
    
    optionDiv.appendChild(radio);
    optionDiv.appendChild(label);
    optionDiv.appendChild(input);
    optionsContainer.appendChild(optionDiv);
  });
  
  container.appendChild(optionsContainer);

  // Обработчик изменения типа вопроса
  typeSelector.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const type = this.value;
      answerText.style.display = type === 'text' ? 'block' : 'none';
      optionsContainer.style.display = type === 'options' ? 'block' : 'none';
      optionsContainer.querySelectorAll('input[type="radio"], input[type="text"]').forEach(input => {
        input.style.display = type === 'options' ? 'block' : 'none';
      });
    });
  });

  return container;
}

function collectAnswerData(index) {
  const container = document.querySelector(`.answer-container[data-index="${index}"]`);
  if (!container) return JSON.stringify({ text: "", options: {}, correct: "a", type: "options" });

  const type = container.querySelector('input[name^="question-type"]:checked')?.value || "options";
  const answerText = container.querySelector('.answer-text-input')?.value || '';

  const options = {};
  let correct = "a"; // значение по умолчанию

  // Собираем варианты ответов
  ['a', 'b', 'c', 'd'].forEach(letter => {
    const input = container.querySelector(`.answer-option-input[data-option="${letter}"]`);
    if (input) options[letter] = input.value || "";
  });

  // Находим выбранный правильный ответ
  const correctRadio = container.querySelector('input[type="radio"][name^="correct-answer"]:checked');
  if (correctRadio) correct = correctRadio.value;

  return JSON.stringify({
    type: type,
    text: answerText,
    options: options,
    correct: correct
  });
}


function addOption(text) {
  const select = document.getElementById("select");
  const option = document.createElement("option");
  option.text = text;
  option.value = text.toLowerCase();
  select.appendChild(option);
}
function addOption3(text) {
  const select3 = document.getElementById("select3");
  const option3 = document.createElement("option");
  option3.text = text;
  option3.value = text.toLowerCase();
  select3.appendChild(option3);
}
function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "test_names"
  return button
}
