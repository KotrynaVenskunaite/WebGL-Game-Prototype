// RGB BUTTON RESET
const RED_button = document.getElementById("R_button");
const GREEN_button = document.getElementById("G_button");
const BLUE_button = document.getElementById("B_button");

RED_button.addEventListener("click", () => resetXcolor (0));
GREEN_button.addEventListener("click", () => resetXcolor (1));
BLUE_button.addEventListener("click", () => resetXcolor (2));

function resetXcolor(chanel){
    Demo.PP_ColorChanels[chanel] = 1.0;
}

// RGB INCREASE
const RED_button_plus = document.getElementById("R_plus");
const GREEN_button_plus = document.getElementById("G_plus");
const BLUE_button_plus = document.getElementById("B_plus");

RED_button_plus.addEventListener("click", () => IncreaseColor (0));
GREEN_button_plus.addEventListener("click", () => IncreaseColor (1));
BLUE_button_plus.addEventListener("click", () => IncreaseColor (2));

function IncreaseColor(chanel){
    if(Demo.PP_ColorChanels[chanel] >= 3.0){
        return;
    }else{
        Demo.PP_ColorChanels[chanel] += 0.5;
    }
}


// RGB DECREASE
const RED_button_minus = document.getElementById("R_minus");
const GREEN_button_minus = document.getElementById("G_minus");
const BLUE_button_minus = document.getElementById("B_minus");

RED_button_minus.addEventListener("click", () => DecreaseColor (0));
GREEN_button_minus.addEventListener("click", () => DecreaseColor (1));
BLUE_button_minus.addEventListener("click", () => DecreaseColor (2));

function DecreaseColor(chanel){
    if(Demo.PP_ColorChanels[chanel] <= 0.0){
        return;
    }else{
        Demo.PP_ColorChanels[chanel] -= 0.5;
    }
}

//Chromatic aberration
const ChromaticAberrationButton = document.getElementById("CA");

ChromaticAberrationButton.addEventListener("click", OnOff_ChromaticAberration);

function OnOff_ChromaticAberration(){
    Demo.useChromatic = !Demo.useChromatic;
}

// Blur
const BlurButton = document.getElementById("Blur");

BlurButton.addEventListener("click", OnOff_Blur);

function OnOff_Blur(){
    Demo.useBlur = !Demo.useBlur;
}

// Grayscale
const GrayscaleButton = document.getElementById("Grayscale");

GrayscaleButton.addEventListener("click", OnOff_Grayscale);

function OnOff_Grayscale(){
    Demo.useColor = !Demo.useColor;
}

// Dither
const DitherButton = document.getElementById("dither");

DitherButton.addEventListener("click", OnOff_Dither);

function OnOff_Dither(){
    Demo.useDither = !Demo.useDither;
}