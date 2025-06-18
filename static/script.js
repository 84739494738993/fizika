import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, doc, getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

//Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
//TODO: Add SDKs for Firebase products that you want to use
//https:firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB726KJeTFGqUvtxNuWudI9jrmLYyDopGU",
  authDomain: "fizik-b1450.firebaseapp.com",
  projectId: "fizik-b1450",
  storageBucket: "fizik-b1450.firebasestorage.app",
  messagingSenderId: "492304108627",
  appId: "1:492304108627:web:f51d4add68abe274044aa6"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let Answers;
let Name_Tasks;
 
const docRef = doc(db, "Information", "o6FJZwzY83MKzYZRk2Vd");

const fetchData = async () => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    // console.log("datetask:", data.Answers);
    // console.log("lessons:", data.Name_Tasks);
    Answers = data.Answers;
    Name_Tasks = data.Name_Tasks;
  } else {
    console.log("Документ не найден");
  }
  // console.log(Answers,Name_Tasks)


function createGlobalDiv() {
    let globalDiv = document.createElement('div');
    globalDiv.className = "globaldiv";
    return globalDiv;
}
function createDiv() {
    let innerDiv = document.createElement('div');
    return innerDiv;
}
function createButton(text) {
    let btn = document.createElement('button');
    btn.textContent = text;
    return btn;
}
function createText(text) {
    let txt = document.createElement('p');
    txt.textContent = text;
    // txt.style.display = 'none'
    return txt;
}
function createInput(i) {
    let input = document.createElement('input');
    input.placeholder = "Write Answer";
    input.className = "answer-input";
    input.dataset.index = i;
    // txt.style.display = 'none'
    return input;
}

let global_div = createGlobalDiv();  // Создали один глобальный контейнер

for(let i = 0; i < Name_Tasks.length; i++) {
    let div = createDiv(i);
    let Text = createText(Name_Tasks[i]);
    let Input = createInput(i);

    div.appendChild(Text);
    div.appendChild(Input);
    global_div.appendChild(div);
}
let button = document.getElementById('button')
global_div.appendChild(button);
document.getElementById("all").appendChild(global_div);
const answers = [];
let mark = 0;
document.getElementById("button").addEventListener("click", () => {
    answers.length = 0;
    mark = 0;
    const inputs = document.querySelectorAll(".answer-input");
    inputs.forEach((input) => {
        answers.push(input.value);
    });

    console.log("Ответы:", answers);
    for(let i = 0; i < answers.length; i++) {
    if (answers[i].toLowerCase()==Answers[i].toLowerCase()){
      mark += 1
    }
}
    console.log(mark)
});
};

fetchData();

