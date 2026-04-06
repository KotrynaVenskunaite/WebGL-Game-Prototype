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

// RGB BUTTON RESET DUOTONE LIGHT
const RED_button_duotone_l = document.getElementById("R_button_duotone_l");
const GREEN_button_duotone_l = document.getElementById("G_button_duotone_l");
const BLUE_button_duotone_l = document.getElementById("B_button_duotone_l");

RED_button_duotone_l.addEventListener("click", () => resetXcolor_duotone_l (0));
GREEN_button_duotone_l.addEventListener("click", () => resetXcolor_duotone_l (1));
BLUE_button_duotone_l.addEventListener("click", () => resetXcolor_duotone_l (2));

function resetXcolor_duotone_l(chanel){
    Demo.DuotoneLight[chanel] = 0.5;
    console.log( Demo.DuotoneLight[chanel]);
}

// RGB BUTTON RESET DUOTONE DARK
const RED_button_duotone_d = document.getElementById("R_button_duotone_d");
const GREEN_button_duotone_d = document.getElementById("G_button_duotone_d");
const BLUE_button_duotone_d = document.getElementById("B_button_duotone_d");

RED_button_duotone_d.addEventListener("click", () => resetXcolor_duotone_d (0));
GREEN_button_duotone_d.addEventListener("click", () => resetXcolor_duotone_d (1));
BLUE_button_duotone_d.addEventListener("click", () => resetXcolor_duotone_d (2));

function resetXcolor_duotone_d(chanel){
    Demo.DuotoneDark[chanel] = 0.5;
    console.log( Demo.DuotoneDark[chanel]);
}

// RGB INCREASE DUOTONE LIGHT
const RED_button_plus_duotone_l = document.getElementById("R_plus_duotone_l");
const GREEN_button_plus_duotone_l = document.getElementById("G_plus_duotone_l");
const BLUE_button_plus_duotone_l = document.getElementById("B_plus_duotone_l");

RED_button_plus_duotone_l.addEventListener("click", () => IncreaseColorduotone_l (0));
GREEN_button_plus_duotone_l.addEventListener("click", () => IncreaseColorduotone_l (1));
BLUE_button_plus_duotone_l.addEventListener("click", () => IncreaseColorduotone_l (2));

function IncreaseColorduotone_l(chanel){
    if(Demo.DuotoneLight[chanel] >= 1.0){
        return;
    }else{
        Demo.DuotoneLight[chanel] += 0.1;
    }
}

// RGB INCREASE DUOTONE DARK
const RED_button_plus_duotone_d = document.getElementById("R_plus_duotone_d");
const GREEN_button_plus_duotone_d = document.getElementById("G_plus_duotone_d");
const BLUE_button_plus_duotone_d = document.getElementById("B_plus_duotone_d");

RED_button_plus_duotone_d.addEventListener("click", () => IncreaseColorduotone_d (0));
GREEN_button_plus_duotone_d.addEventListener("click", () => IncreaseColorduotone_d (1));
BLUE_button_plus_duotone_d.addEventListener("click", () => IncreaseColorduotone_d (2));

function IncreaseColorduotone_d(chanel){
    if(Demo.DuotoneDark[chanel] >= 1.0){
        return;
    }else{
        Demo.DuotoneDark[chanel] += 0.1;
    }
}

// RGB DECREASE DUOTONE LIGT
const RED_button_minus_duotone_l = document.getElementById("R_minus_duotone_l");
const GREEN_button_minus_duotone_l = document.getElementById("G_minus_duotone_l");
const BLUE_button_minus_duotone_l = document.getElementById("B_minus_duotone_l");

RED_button_minus_duotone_l.addEventListener("click", () => DecreaseColorduotone_l (0));
GREEN_button_minus_duotone_l.addEventListener("click", () => DecreaseColorduotone_l (1));
BLUE_button_minus_duotone_l.addEventListener("click", () => DecreaseColorduotone_l (2));

function DecreaseColorduotone_l(chanel){
    if(Demo.DuotoneLight[chanel] <= 0.0){
        return;
    }else{
        Demo.DuotoneLight[chanel] -= 0.1;
    }
}

// RGB DECREASE DUOTONE DARK
const RED_button_minus_duotone_d = document.getElementById("R_minus_duotone_d");
const GREEN_button_minus_duotone_d = document.getElementById("G_minus_duotone_d");
const BLUE_button_minus_duotone_d = document.getElementById("B_minus_duotone_d");

RED_button_minus_duotone_d.addEventListener("click", () => DecreaseColorduotone_d (0));
GREEN_button_minus_duotone_d.addEventListener("click", () => DecreaseColorduotone_d (1));
BLUE_button_minus_duotone_d.addEventListener("click", () => DecreaseColorduotone_d (2));

function DecreaseColorduotone_d(chanel){
    if(Demo.DuotoneDark[chanel] <= 0.0){
        return;
    }else{
        Demo.DuotoneDark[chanel] -= 0.1;
    }
}

//DUOTONE
const duotoneButton = document.getElementById("duotone");
const duotoneOptions = document.getElementById("duotone_options");
duotoneButton.addEventListener("click", onOff_duotone);

function onOff_duotone(){
    Demo.useDuotone = !Demo.useDuotone;
    if(Demo.useDuotone == false){ duotoneOptions.style.display = "none";}
    else {duotoneOptions.style.display = "flex";}
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
