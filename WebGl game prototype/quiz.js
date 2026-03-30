let lists = document.getElementsByClassName("list");
let wordBox = document.getElementById("Word_area");
let sentence_1 = document.getElementById("first_sentence");
let sentence_2 = document.getElementById("second_sentence");
let sentence_3 = document.getElementById("third_sentence");
let sentence_4 = document.getElementById("fourth_sentence");
let sentence_5 = document.getElementById("fifth_sentence");
let quiz = document.getElementsByClassName("quiz_area");
let selected = null;
let score = 0;

for (let list of lists) {
    list.addEventListener("dragstart", function(e){
        selected = e.target;
    });
}

// Word box
wordBox.addEventListener("dragover", function(e){
    e.preventDefault();
});
wordBox.addEventListener("drop", function(e){
    wordBox.appendChild(selected);
    selected = null;
});

//sentence 1
sentence_1.addEventListener("dragover", function(e){
    e.preventDefault();
});
sentence_1.addEventListener("drop", function(e){
    if(sentence_1.hasChildNodes()){
        let child_name = sentence_1.firstChild.textContent;
        // console.log(child_name);
        return;
    }
    else{
        sentence_1.appendChild(selected);
        selected = null;
    }
    
});

//sentence 2
sentence_2.addEventListener("dragover", function(e){
    e.preventDefault();
});
sentence_2.addEventListener("drop", function(e){
    if(sentence_2.hasChildNodes()){
        let child_name = sentence_2.firstChild.textContent;
        // console.log(child_name);
        return;
    }
    else{
        sentence_2.appendChild(selected);
        selected = null;
    }
    
});

//sentence 3
sentence_3.addEventListener("dragover", function(e){
    e.preventDefault();
});
sentence_3.addEventListener("drop", function(e){
    if(sentence_3.hasChildNodes()){
        let child_name = sentence_3.firstChild.textContent;
        // console.log(child_name);
        return;
    }
    else{
        sentence_3.appendChild(selected);
        selected = null;
    }
    
});

//sentence 4
sentence_4.addEventListener("dragover", function(e){
    e.preventDefault();
});
sentence_4.addEventListener("drop", function(e){
    if(sentence_4.hasChildNodes()){
        let child_name = sentence_4.firstChild.textContent;
        // console.log(child_name);
        return;
    }
    else{
        sentence_4.appendChild(selected);
        selected = null;
    }
    
});

//sentence 5
sentence_5.addEventListener("dragover", function(e){
    e.preventDefault();
});
sentence_5.addEventListener("drop", function(e){
    if(sentence_5.hasChildNodes()){
        let child_name = sentence_5.firstChild.textContent;
        // console.log(child_name);
        return;
    }
    else{
        sentence_5.appendChild(selected);
        selected = null;
    }
    
});

function is_quiz_visable(visibility){
    if (visibility == true){
        quiz[0].style.display = "flex";
    }else{
        quiz[0].style.display = "none";
    }
}

function calc_quiz_score(){
    score = 0;
    if (sentence_1.firstElementChild && sentence_1.firstChild.textContent == 'highlight'){score +=1;}
    if (sentence_2.firstElementChild && sentence_2.firstChild.textContent == 'specular map'){score +=1;}
    if (sentence_3.firstElementChild && (sentence_3.firstChild.textContent == 'camera'|| sentence_3.firstChild.textContent == 'reflection')){score +=1;}
    if (sentence_4.firstElementChild && (sentence_4.firstChild.textContent == 'camera'|| sentence_4.firstChild.textContent == 'reflection')){score +=1;}
    if (sentence_5.firstElementChild && sentence_5.firstChild.textContent == 'can'){score +=1;}

    
    if (score >= 5){
        dialogue_progression = "Specular_quiz_good";
    }else{
        dialogue_progression = "Specular_quiz_bad";
    }
}