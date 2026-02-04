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

button_1.addEventListener("click", () => vinny_dialogue_progression(1));
button_2.addEventListener("click", () => vinny_dialogue_progression(2));
button_3.addEventListener("click", () => vinny_dialogue_progression(3));
button_4.addEventListener("click", () => vinny_dialogue_progression(4));

var img = document.createElement("img");

var d_text = 'Placeholder text';
var language = "eng"
var dialogue_progression = 0;
var is_in_dialogue = false


img.src = 'textures/f_key.png';
img.style.width = "50";   // optional
img.style.height = "50px";
img.style.opacity = "0.8"; 

function InitiateConversation(name, can_start_convo, is_starting) {

    if (name == "Book" || name == "Bench" || name == "Vinny"){
        return;
    }
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
    

    // 
}

function Begin_Dialogue(name){
    console.log("Dialogue w " + name);
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
        if (dialogue_progression == "dither_end"){
            d_text = "I hope you enjoyed this little lesson!"
            button_1.innerHTML = "I did!"
            button_2.innerHTML = "I did not"
        }
        else if(language == "eng")
        {
            d_text = "Oh Hello. I was just reading about some some techniques to help me out with some color banding."
        }
        else{
            d_text = "Sveikas! Aš kaip tik skaičiau apie technikas naudojamas spalvų juostavimuisi sutvarkyti."
        }
        type_letters(d_text, true, true, false, false);
    }, 3000);
    
    button_1.onclick = () => {
        console.log("hi");
    };
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

    for (let i = 0; i < text.length; i++) {
        setTimeout(() => {
            dialogue.textContent  += text[i];
        }, i * 50);
    }
    setTimeout(() => {
        button_1.style.display = b1 ? "flex" : "none";
        button_2.style.display = b2 ? "flex" : "none";
        button_3.style.display = b3 ? "flex" : "none";
        button_4.style.display = b4 ? "flex" : "none";
    }, text.length * 50); // runs after last letter
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
            d_text = ""
            button_1.innerHTML = ""
            button_2.innerHTML = ""
            type_letters(d_text, false, false, false, false);
            End_Dialogue();
            break;
    }

}