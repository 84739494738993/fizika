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
      button6.style.display = "none";
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "none"
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
  button.addEventListener("click", async () => {
  let sum = 0;
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 2) {
      wich_test[j] = 3
      const answerInputs = document.querySelectorAll(".answer-input");
      const questionInputs = document.querySelectorAll(".question-input");

      for (let i = 0; i < col_tasks[j]; i++) {
        // console.log(Answers[i + sum],Name_Tasks[i + sum],answerInputs[i].value,questionInputs[i].value)
        Answers[i + sum] = answerInputs[i].value;
        Name_Tasks[i + sum] = questionInputs[i].value;
      }
    } else {
      sum += col_tasks[j];
    }
  }

      await updateColTasks(col_tasks);
      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers);
  setTimeout(() => {
  window.location.href = "admin";
}, 3000);
  buildUI();

});

function save(){
   let sum = 0;
  for (let j = 0; j < wich_test.length; j++) {
    if (wich_test[j] === 2) {
      const answerInputs = document.querySelectorAll(".answer-input");
      const questionInputs = document.querySelectorAll(".question-input");

      for (let i = 0; i < col_tasks[j]; i++) {
        // console.log(Answers[i + sum],Name_Tasks[i + sum],answerInputs[i].value,questionInputs[i].value)
        Answers[i + sum] = answerInputs[i].value;
        Name_Tasks[i + sum] = questionInputs[i].value;
      }
    } else {
      sum += col_tasks[j];
    }
  }
}


  button1.addEventListener("click", async () => {
    save()
    let k = 0;
    let sum = 0;
    for (let j = 0; j < wich_test.length; j++) {
        if (wich_test[j]===2){k = j;
          wich_test[k] = 3

      col_tasks[k] = col_tasks[k]+1
      Name_Tasks.splice(sum+col_tasks[k]-1, 0, "");
      Answers.splice(sum+col_tasks[k]-1, 0, "");
    }
      
      else{sum += col_tasks[j]}
    }
      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers)
  setTimeout(() => {
  window.location.href = "admin";
}, 1000);
  // buildUI();
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
    if (new_select.selectedIndex === 1){
        wich_test[index] = 1
      }
      if(new_select.selectedIndex === 2){
        wich_test[old_index] = 1
        wich_test[index] = 2
        console.log(index,old_index)
      } 

      await updateQuestions(Name_Tasks);
      await updateColTasks(col_tasks);
      await updateNameTests(name_tests);
      await updateWichTest(wich_test);
      await updateAnswers(Answers)
      if (new_select.selectedIndex === 1){
        window.location.href = "admin";
      }
      global_div.style.display = "block";
      new_div.style.display = "none"
      button4.style.display = "none";
      button3.style.display = "none";
      button6.style.display = "none";
      new_select.style.display = "none";
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "block"
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
      button.style.display = "block";
      button1.style.display = "block";
      button7.style.display = "block";
      button2.style.display = "block";
      select.style.display = "block";
      button5.style.display = "block";
      input.style.display = "none";
      
      
      setTimeout(() => {
  // window.location.href = "admin";
}, 1000);
buildUI();
  }else{alert("Введите имя теста изменить его будет нельзя")}  
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
function createInput_answer(i, j) {
  let textarea = document.createElement('textarea');
  textarea.value = j;
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
  return textarea;
}
function addOption(text) {
  const select = document.getElementById("select");
  const option = document.createElement("option");
  option.text = text;
  option.value = text.toLowerCase();
  select.appendChild(option);
}
function createButton(text) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "test_names"
  return button
}
