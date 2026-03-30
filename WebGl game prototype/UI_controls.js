var TalkTo = document.getElementById("interact_text");
var TalkImg = document.getElementById("interact_image");
const iris = document.getElementById("iris");
const dialogue = document.getElementById("dialog_text_text");
const dialogue_name = document.getElementById("dialog_name");
const dialogue_box = document.getElementById("dialogue_box");
const dither_image = document.getElementById("dither_image");


const buttons = document.getElementById("dialog_buttons");
const button_1 = document.getElementById("button_1");
const button_2 = document.getElementById("button_2");
const button_3 = document.getElementById("button_3");
const button_4 = document.getElementById("button_4");

button_1.addEventListener("click", onButton1Click);
button_2.addEventListener("click", () => vinny_dialogue_progression(2));
button_3.addEventListener("click", () => vinny_dialogue_progression(3));
button_4.addEventListener("click", () => vinny_dialogue_progression(4));

document.addEventListener('click', cancelDialogue);

function onButton1Click() {
    if (dialogue_progression === "Specular_8" || dialogue_progression === "Specular_quiz_bad") {
        calc_quiz_score();
        vinny_dialogue_progression(1);
        return;
    }

    vinny_dialogue_progression(1);
}

var img = document.createElement("img");

var d_text = 'Placeholder text';
var language = "eng"
var dialogue_progression = 0;
var is_in_dialogue = false
var did_skip_dialogue = false;
var can_skip_dialogue = false;

var did_learn_about_dither = false;
var did_learn_about_normals = false;
var did_learn_about_specular = false;


img.src = 'textures/f_key.png';
img.style.width = "50";   // optional
img.style.height = "50px";
img.style.opacity = "0.8"; 

function InitiateConversation(name, can_start_convo, is_starting) {

    // if (name == "Book" || name == "Bench" || name == "Vinny" || name == "Box"){
    //     return;
    // }
    if (name != "Vinny_2" && name != "Vincent" && name != "Vinny_3"){
        return;
    }
    // console.log("name: ", name, "can start convo? ", can_start_convo, "is in dialogue? ", is_in_dialogue);
    
    if (can_start_convo == 1 && is_in_dialogue == false){
       
        if (language == "eng"){
            TalkTo.innerHTML = "TALK TO<br>" + name;
        }
        else{
            TalkTo.innerHTML = "ŠNEKĖTI SU<br> Vincentu";
        }
        
        TalkImg.appendChild(img);
        // console.log (is_in_dialogue );
        if (is_starting == true){
            Begin_Dialogue(name);
           
        }
        
    }
    else{
        TalkImg.innerHTML = ""; //Clear img
        TalkTo.textContent = ""
    }
    
}

function Begin_Dialogue(name){
    // console.log("Dialogue w " + name);
    is_in_dialogue = true;
    Demo.can_cam_move = false;
    iris.classList.add("start");
    setTimeout(() => {
        Demo.is_camera_ortho = true;
        Demo.camera.position = glMatrix.vec3.fromValues(-0.5, 4.3, 0.2);
        Demo.camera.setRotation(
            Math.PI / 2,   // yaw (left/right)
            0.0            // pitch (up/down)
        );
        Demo.Dialogue_Meshes_rescale(0);
        Demo._OnResizeWindow();

        iris.classList.remove("start");

        dialogue_name.innerHTML = name.toUpperCase() ;
        button_1.innerHTML = "What is color banding?"
        button_2.innerHTML = "Could share them with me?"

        dialogue_box.style.display = "flex";
        // button_1.style.display = "flex";
        // button_2.style.display = "flex";
        // name.style.display = "flex";

        
        
    }, 2000);

    
    setTimeout(() => {
        if (name == "Vincent" && did_learn_about_dither == true){
            d_text = "I hope you enjoyed this little lesson!"
            button_1.innerHTML = "I did!"
            button_2.innerHTML = "I did not"
            dialogue_progression = "Dither_end"
        }
        else if (name == "Vinny_2" && did_learn_about_normals == true){
            d_text = "I hope you enjoyed this little lesson!"
            button_1.innerHTML = "I did!"
            button_2.innerHTML = "I did not"
            dialogue_progression = "Normal_Map_end"
        }
        else if (name == "Vinny_3" && did_learn_about_specular == true){
            d_text = "I hope you enjoyed this little lesson!"
            button_1.innerHTML = "I did!"
            button_2.innerHTML = "I did not"
            dialogue_progression = "Specular_end"
        }
        else if(language == "eng" && name == "Vincent")
        {
            d_text = "Oh Hello. I was just reading about some some techniques to help me out with some color banding."
            dialogue_progression = 0;
        }
        else if (name == "Vinny_3" && did_learn_about_normals == false){
            d_text = "Please speak to others first, I'm afraid you will have a hard time understanding me otherwise"
            button_1.innerHTML = "Okay."
            button_2.innerHTML = "Later then."
            dialogue_progression = "Specular_end";
        }
        // else if(name == "Vinny_2" && dialogue_progression != "dither_end")
        // {
        //     d_text = "I have something important to share, but I'm afraid you will have to talk to someone lese first.";
        //     button_1.innerHTML = "OK"
        //     button_2.innerHTML = "See ya!"
        // }
        else if(name == "Vinny_2")
        {
            d_text = "I look quite plain today, don't I?";
            button_1.innerHTML = "You do"
            button_2.innerHTML = "You look nice!"
            dialogue_progression = "Normal_Map_Start"
        }
        // else if (name == "Vincent"){
        //     d_text = "Sveikas! Aš kaip tik skaičiau apie technikas naudojamas spalvų juostavimuisi sutvarkyti."
        // }
        // else if (name == "Vincent"){
        //     d_text = "Sveikas! Aš kaip tik skaičiau apie technikas naudojamas spalvų juostavimuisi sutvarkyti."
        // }
        else if (name == "Vinny_3" && did_learn_about_normals == true){
            d_text = "Oh, you are done talking to the others? Then it is my turn to shine!"
            button_1.innerHTML = "Indeed."
            button_2.innerHTML = "Let's start."
            dialogue_progression = "Specular_start";
        }
        type_letters(d_text, true, true, false, false);
    }, 3000);
    
    // button_1.onclick = () => {
    //     console.log("hi");
    // };
    // button_2.onclick = vinny_dialogue_progression();
    
}

function End_Dialogue(){
    iris.classList.add("start");
    setTimeout(() => {
        Demo.Dialogue_Meshes_rescale(10);
        Demo.Show_Ball(false);
        Demo.is_camera_ortho = false;
        Demo.camera.position = glMatrix.vec3.fromValues(-1, 0.4, 0);
        // Demo.camera.setRotation(
        //     Math.PI / 2,   // yaw (left/right)
        //     0.0            // pitch (up/down)
        // );
        // Demo.Dialogue_Meshes_rescale(0);
        Demo._OnResizeWindow();

        iris.classList.remove("start");

        // dialogue_name.innerHTML = name.toUpperCase() ;
        // button_1.innerHTML = "What is color banding?"
        // button_2.innerHTML = "Could share them with me?"

        dialogue_box.style.display = "none";
        // button_1.style.display = "flex";
        // button_2.style.display = "flex";
        // name.style.display = "flex";

        is_in_dialogue = false;
        Demo.can_cam_move = true;
        
    }, 2000);
}

function type_letters(text, b1, b2, b3, b4){
    
    dialogue.textContent = "";
    button_1.style.display = "none";
    button_2.style.display = "none";
    button_3.style.display = "none";
    button_4.style.display = "none";
    setTimeout(() => {
        can_skip_dialogue = true;
        // console.log("CAN SKIP NOW");
    },500); //skip timer
    var typingIndex = 0;

    function TypeNextLetter(){
        
        if(did_skip_dialogue == true){
            // console.log(did_skip_dialogue);
            can_skip_dialogue = false;
            did_skip_dialogue = false;
            dialogue.textContent = text;
            show_buttons(b1, b2, b3, b4);
            
            return;
        }

        if(typingIndex < text.length){
            dialogue.textContent += text[typingIndex];
            typingIndex +=1;
            this.letterTimer = setTimeout(TypeNextLetter, 50);
        }else{
            show_buttons(b1, b2, b3, b4);
        }
    }
    TypeNextLetter();
}

function show_buttons(b1, b2, b3, b4){
    button_1.style.display = b1 ? "flex" : "none";
    button_2.style.display = b2 ? "flex" : "none";
    button_3.style.display = b3 ? "flex" : "none";
    button_4.style.display = b4 ? "flex" : "none";
}

function cancelDialogue(){
    if (can_skip_dialogue == true && is_in_dialogue == true){
        did_skip_dialogue = true;
        // console.log("set to true");
        // clearTimeout(this.letterTimer);
    }
    
}

function vinny_dialogue_progression(buttonNumber){
    switch (dialogue_progression){
        case 0: 
            d_text = "Ofcourse! First I have to explain what color banding is!";
            button_1.innerHTML = "Ok!";
            type_letters(d_text, true, false, false, false);
            dialogue_progression+=1;
            break;
        case 1:
            Demo.Dialogue_Meshes_rescale(2);
            Demo.Show_Ball(true);
            Demo.Set_Dither_Shader_Variabled(0.0, undefined, undefined, undefined, 1.0, 0.0)
            d_text = "Let's look at this ball as an example. It has light shining on it. Do you see any issues?";
            button_1.innerHTML = "No";
            button_2.innerHTML = "The ball is too small";
            button_3.innerHTML = "The ball is too big";
            button_4.innerHTML = "The ball is not fully round";
            type_letters(d_text, true, true, true, true);
            dialogue_progression+=1;
            break;
        case 2:
            Demo.Set_Dither_Shader_Variabled(undefined, undefined, undefined, undefined, undefined, 16.0)
            d_text = "How about now? do you see an issue?";
            button_1.innerHTML = "The shading is not smooth";
            button_2.innerHTML = "The shading is banded";
            type_letters(d_text, true, true, false, false);
            dialogue_progression+=1;
            break;
        case 3:
            d_text = "Exactly! There are not enough colors to properly show a smooth gradient from light to dark!";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression+=1;
            break;
        case 4:
            Demo.Dialogue_Meshes_rescale(4);
            d_text = "This is called color quantization! 'Quantization' means that a high precision value was reduced to a low precision one";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression+=1;
            break;
        case 5: 
            d_text = "If you want a more mundane example, when your grade gets rounded from 9.3 to just 9, that is a form of quantization!";
            button_1.innerHTML = "Why does color quantization happen?";
            button_2.innerHTML = "What determines the quantized color amount?";
            button_3.innerHTML = "Can the color be fixed?";
            type_letters(d_text, true, true, true, false);
            dialogue_progression+=1;
            break;
        case 6: //Quan question choices
            Demo.Dialogue_Meshes_rescale(4);
            if(buttonNumber == 1){
                d_text = "It can be an intentional choice to reduce the color of an image while maintaining significant information.";
                button_1.innerHTML = "->";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "why_quan_happens_1";
            }
            if(buttonNumber == 2){
                d_text = "The amount is determined based on who or what is doing the quantization";
                button_1.innerHTML = "->";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "why_quan_amount_1";
            }
            if(buttonNumber == 3){
                d_text = "We can not restore the original colors, but we can mask the banding. One of the methods for that is dithering!";
                button_1.innerHTML = "What is dithering?";
                button_2.innerHTML = "How does it help?";
                type_letters(d_text, true, true, false, false);
                dialogue_progression = 7;
            }
            break;
        case "why_quan_happens_1":
            d_text = "If you ever saved an image as a JPEG, you probably have noticed that the quality is worse than before";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "why_quan_happens_2";
            break;
        case "why_quan_happens_2":
            Demo.Dialogue_Meshes_rescale(0);
            d_text = "You may also see it if you zoom in on an image too much. The image compression (quantization) becomes visable to the named eye.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "why_quan_happens_3";
            break;
        case "why_quan_happens_3":
            d_text = "It may also be an artistic choice. If you ever chose a color pallete for a drawing or an outfit, you 'Quantized' your colors to that pallete.";
            button_1.innerHTML = "Could you explain again?";
            button_2.innerHTML = "What determines the quantized color amount?";
            button_3.innerHTML = "Can the color be fixed?";
            type_letters(d_text, true, true, true, false);
            dialogue_progression = 6;
            break;
        case "why_quan_amount_1":
            d_text = "For example, image saving algorithms usually have a predetermined quantization/color range.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "why_quan_amount_2";
            break;
        case "why_quan_amount_2":
            Demo.Dialogue_Meshes_rescale(0);
            d_text = "This ball has it's colors manually quantized to 16 (and converted to grayscale).";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "why_quan_amount_3";
            break;
        case "why_quan_amount_3":
            d_text = "You yourself quantize your colors to a specific amount when you choose a pallete for your drawings or outfit.";
            button_1.innerHTML = "Why does color quantization happen?";
            button_2.innerHTML = "Could you explain again?";
            button_3.innerHTML = "Can the color be fixed?";
            type_letters(d_text, true, true, true, false);
            dialogue_progression = 6;
            break;
        case 7:
            d_text = "Dithering is an intentionally applied form of noise to prevent large scale patters, like color banding!";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_1";
            break;
        case "dither_explain_1":
            Demo.Dialogue_Meshes_rescale(2);
            Demo.Show_Ball(false);
            dither_image.style.display = "flex";
            d_text = "A common usage for dithering is converting grayscale images to black and white";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_2";
            break;
        case "dither_explain_2":
            d_text = "The density of black pixels is roughly equivalent to the averege gray level of the original image.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_3";
            break;
        case "dither_explain_3":
            d_text = "This conversion can be understood as using a pallete of just 2 colors, where the pixels are either black or white";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_4";
            break;
        case "dither_explain_4":
            Demo.Dialogue_Meshes_rescale(4);
            d_text = "This pallete can be extender to support any (end bit) color pallete, from 2 to 256";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_5";
            break;
        case "dither_explain_5":
            Demo.Dialogue_Meshes_rescale(0);
            d_text = "Before we do anything, we need to decide on a dither pattern. For this demonstration we will pick Bayer (Ordered) dithering.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_6";
            break;
        case "dither_explain_6":
            dither_image.style.display = "flex";
            document.getElementById("image_window").src = "textures/matrix.png";
            // document.getElementById("image_window").style.bottom = "60%";
            d_text = "This pattern uses a threshold map. It is a matrix of equaly distributed values from 0 to n^-1, where n is the dimension of the matrix";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_7";
            break;
        case "dither_explain_7":
            dither_image.style.display = "none";
            d_text = "We take the position of a pixel on a screen (x,y), then we mod the position by n (x % n). Thus we convert it into the threshold map value M = map[x][y] ";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_8";
            break;
        case "dither_explain_8":
            d_text = "We multiply M by 1 over n squared to convert it into 0 - 1 range, then we subtract 0.5  (M * (1/n^2) - 0.5). The final value is the noise we will use";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_9";
            break;
        case "dither_explain_9":
            d_text = "We are not done yet! We now need to convert our colors to new values for our dithering to look proper";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_10";
            break;
        case "dither_explain_10":
            d_text = "Using |color * (n-1) + 0.5|/n-1, where 'n' is the number of colors we want, we get our new color pallete!";
            button_1.innerHTML = "Let's see the result!";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_explain_11";
            break;
        case "dither_explain_11":
            Demo.Dialogue_Meshes_rescale(2);
            Demo.Set_Dither_Shader_Variabled(1.0)
            Demo.Show_Ball(true);
            d_text = "And here it is! With all the math applied in our shader, we get a smooth transition while still using the quantized color pallete!";
            button_1.innerHTML = "End Lesson!";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "dither_end";
            break;
        case "dither_end":
            did_learn_about_dither = true;
            d_text = ""
            button_1.innerHTML = ""
            button_2.innerHTML = ""
            type_letters(d_text, false, false, false, false);
            End_Dialogue();
            break;
        case "Normal_Map_Start":
            d_text = "Oh, I don't mean my outfit. I meant my...planes! My features might look pointy, but I actually only have 2912 vertices.";
            button_1.innerHTML = "ONLY 2912!?";//14319
            button_2.innerHTML = "Indeed, quite low";
            button_3.innerHTML = "I don't get it";
            type_letters(d_text, true, true, true, false);
            dialogue_progression = "Normal_Map_1";
            break;
        case "Normal_Map_1":
            d_text = "I am joking, that is quite a huge number for a web game NPC. It comes down to my boots and glasses, they are quite unoptimised...";
            button_1.innerHTML = "Unoptimised?";
            button_2.innerHTML = "What is a vertice?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Normal_Map_2";
            break;
        case "Normal_Map_2":
            if(buttonNumber == 1){
                Demo.Dialogue_Meshes_rescale(0);
                d_text = "Have you ever thought about how games have very detailed surfaces and items, yet still run well in your machine?";
                button_1.innerHTML = "Yes, I wonder how";
                button_2.innerHTML = "Never thought of it";
                button_3.innerHTML = "I never noticed that";
                button_4.innerHTML = "I have a clue";
                type_letters(d_text, true, true, true, true);
                dialogue_progression = "Normal_Map_3";
            }
            if(buttonNumber == 2){
                Demo.Dialogue_Meshes_rescale(4);
                d_text = "A vertex is a point in 3D space where 2 or more edges meet. They form the corners of 3D models.";
                button_1.innerHTML = "Understood";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Normal_Map_2";
            }
            break;
        case "Normal_Map_3":
            Demo.Dialogue_Meshes_rescale(4);
            d_text = "That is done with the help of bump or normal maps. They are textures, that determine how the light reflects on an object.";
            button_1.innerHTML = "Can you demonstrate?";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_5";
            break;
        case "Normal_Map_5":
            Demo.Dialogue_Meshes_rescale(2);
            Demo.Dialogue_Meshes_rescale(20);
            d_text = "Sure, look at this cube. It's just a cube, but you can clearly see the indents around the numbers";
            button_1.innerHTML = "How does that work?";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_6";
            break;
        case "Normal_Map_6":
            d_text = "We can use the RGB values of a texture to configure what direction the 'normals' should look towards.";
            button_1.innerHTML = "What are normals?";
            button_2.innerHTML = "How does the texture look like?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Normal_Map_7";
            break;
        case "Normal_Map_7":
            if(buttonNumber == 1){
                Demo.Dialogue_Meshes_rescale(4);
                d_text = "To simplify, a normal is the direction a plane is facing. The direction is determined by the verices in 3d space.";
                button_1.innerHTML = "->";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Normal_Map_7_2";
            }
            if(buttonNumber == 2){
                Demo.Dialogue_Meshes_rescale(2);
                Demo.changeNormalShaderRenderResult(1);
                d_text = "This is what it looks like. The blue color chanel represents the Z axis. We barely change it, so the texture always has a blue/purplue hue.";
                button_1.innerHTML = "Can I change it?";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Normal_Map_8";
            }
            break;
        case "Normal_Map_7_2":
            d_text = "Those verices have each individual 'normal' information, that can be interpolated between them.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_7_3";
            break;
        case "Normal_Map_7_3":
            d_text = "That is how they form a flat plane. However, those interpolated points can be manipulated to achieve different lighting or other results.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_7_4";
            break;
        case "Normal_Map_7_4":
            d_text = "We use normal maps to achieve exactly that.";
            button_1.innerHTML = "Can you repeat?";
            button_2.innerHTML = "What do they look like?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Normal_Map_7";
            break;
        case "Normal_Map_8":
            Demo.Dialogue_Meshes_rescale(0);
            showDrawingArea();
            Demo.changeNormalShaderRenderResult(0);
            d_text = "It is unconventional, however, you CAN draw it yourself. Give it a try!";
            button_1.innerHTML = "How does it work?";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_9";
            break;
        case "Normal_Map_9":
            d_text = "I take your drawing, convert it to grayscale (bump map) and then use that information to generate a normal map!";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_10";
            break;
        case "Normal_Map_10":
            d_text = "The calculations are a bit complex, but you can thank Inigo Quilez for providing the code to do so!";
            button_1.innerHTML = "End Lesson!";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Normal_Map_end";
            break;
        case "Normal_Map_end":
            hideDrawingArea();
            Demo.Dialogue_Meshes_rescale(21);
            d_text = "";
            button_1.innerHTML = "";
            type_letters(d_text, false, false, false, false);
            // dialogue_progression = "Normal_Map_10";
            did_learn_about_normals = true;
            End_Dialogue();
            break;
        
        // SPECULAR
        case "Specular_start":
            // Demo.Dialogue_Meshes_rescale(0);
            d_text = "So, now that we know how to manipulate reflection directions, let's learn how to manipulate reflection intensity instead.";
            button_1.innerHTML = "Intensity?";
            button_2.innerHTML = "Like brightness?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Specular_1";
            break;
        case "Specular_1":
            Demo.Dialogue_Meshes_rescale(4);
            d_text = "Intensity, or in other words, how reflective (shiny or matte) a material is!";
            button_1.innerHTML = "Okay, explain.";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Specular_2";
            break;
        case "Specular_2":
            Demo.Dialogue_Meshes_rescale(2);
            Demo.Dialogue_Meshes_rescale(30);
            Demo.configureSpecular(false, false);
            d_text = "Take a look at this helmet. It's made of some kind of metal, so we make it shiny to reflect that!";
            button_1.innerHTML = "How is this done?";
            button_2.innerHTML = "How is this different than before?";
            button_3.innerHTML = "Was the pun intended?";
            type_letters(d_text, true, true, true, false);
            dialogue_progression = "Specular_3";
            break
        case "Specular_3":
            Demo.Dialogue_Meshes_rescale(4);
            d_text = "This is called 'Specular light'. Unlike other forms of lighting, it creates a specular highlight, a bright spot on the surface of the object.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Specular_4";
            break;
        case "Specular_4":
            d_text = "The highlight only appears when the the camera angle aligns with the reflection angle. That is why the highlight changes as the helmet spins around.";
            button_1.innerHTML = "It that not just normal mapping?";
            button_2.innerHTML = "Can the brighness be controled?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Specular_5";
            break;
        case "Specular_5":
            Demo.Dialogue_Meshes_rescale(21);
            if(buttonNumber == 1){
                Demo.Dialogue_Meshes_rescale(20);
                Demo.Set_Crate_example(false)
                Demo.configureSpecular(false, false);
                d_text = "Normal maps, as you can see on the box, specifically dictate the direction of a reflection, not the intensity.";
                button_1.innerHTML = "->";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Specular_5_2_2";
            }
            if(buttonNumber == 2){
                Demo.configureSpecular(false, true);
                d_text = "We can control the specular light intensity as we please, and like on the helmet, swich between no specular light (matte) and extremely reflective surface.";
                button_1.innerHTML = "->";
                // button_1.innerHTML = "It that not just normal mapping?";
                // button_2.innerHTML = "Can we make only certain parts reflective?";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Specular_6";
            }
            if(buttonNumber == 3){
                d_text = "This helmet has a plume of hair. In real life, hair is not as reflective as metal. In adittion, the helmet is implied to have a rough, less reflective texture on certain parts.";
                button_1.innerHTML = "->";
                type_letters(d_text, true, false, false, false);
                dialogue_progression = "Specular_7";
            }
            break;
            case "Specular_5_2_2":
            Demo.Dialogue_Meshes_rescale(0);
            Demo.Set_Crate_example(true);
            d_text = "However, you can use specular lighting with normal maps to add a reflection. You can mix and match various shader methods in your code.";
            button_1.innerHTML = "->";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Specular_5_2";
            break;
        case "Specular_5_2":
            // Demo.Dialogue_Meshes_rescale(0);
            d_text = "Other lighting methods, like on me for example, do not inherently focus on creating an illusion of what material an object is made out of.";
            button_1.innerHTML = "Can you repeat that?";
            button_2.innerHTML = "So it's always very reflective?";
            type_letters(d_text, true, true, false, false);
            dialogue_progression = "Specular_5";
            break;
        case "Specular_6":
            d_text = "In addition, we can control how reflective and what part of the surface is reflelective using a texture called 'specular map'.";
            button_1.innerHTML = "It that not just normal mapping?";
            button_3.innerHTML = "How is that useful?";
            type_letters(d_text, true, false, true, false);
            dialogue_progression = "Specular_5";
            break;
        case "Specular_7":
            Demo.Dialogue_Meshes_rescale(2);
            Demo.configureSpecular(true, false);
            d_text = "This is far more accurate to how it should look like. Note that we only changed where and how reflective the surface is, not the direction of the reflection!";
            button_1.innerHTML = "I think I undertand.";
            button_2.innerHTML = "That was simple.";
            button_3.innerHTML = "That was complicated.";
            type_letters(d_text, true, true, true, false);
            dialogue_progression = "Specular_8";
            break;
        case "Specular_8":
            Demo.Dialogue_Meshes_rescale(0);
            Demo.Dialogue_Meshes_rescale(31);
            is_quiz_visable(true);
            d_text = "You don't sound very confident about your understanding, so let's do a little test. Fill in the blanks with the correct words.";
            button_1.innerHTML = "Check";
            type_letters(d_text, true, false, false, false);
            // dialogue_progression = "Specular_8";
            break;
        case "Specular_quiz_bad":
            d_text = `Not quite yet. You answered ${score} out of 5 correctly.`;
            console.log(score);
            button_1.innerHTML = "Check";
            type_letters(d_text, true, false, false, false);
            break;
        case "Specular_quiz_good":
            d_text = "Good job! You answered everything correctly. I will not give such easy questions next time!";
            button_1.innerHTML = "End Lesson";
            type_letters(d_text, true, false, false, false);
            dialogue_progression = "Specular_end";
            break;
        case "Specular_end":
            did_learn_about_specular = true;
            is_quiz_visable(false);
            d_text = ""
            button_1.innerHTML = ""
            button_2.innerHTML = ""
            type_letters(d_text, false, false, false, false);
            End_Dialogue();
            break;
            


    }

}