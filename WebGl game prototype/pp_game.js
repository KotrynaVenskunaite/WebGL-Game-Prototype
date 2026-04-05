function pp_ornstein(){
    if(
        Demo.PP_ColorChanels[0] >= 2.0 && 
        Demo.PP_ColorChanels[1] >= 2.0 &&
        Demo.PP_ColorChanels[2] <= 1.0 && 
        Demo.useBlur == false && 
        Demo.useChromatic == false &&
        Demo.useDither == true && 
        Demo.useColor == true && 
        Demo.useDuotone == false 
    ){
        console.log("Ornstein helm good")
        return true;
    }
    console.log("Ornstein helm bad")
    return false;
}

function pp_gojo(){
    if(
        // Demo.PP_ColorChanels[0] >= 2.0 && 
        // Demo.PP_ColorChanels[1] >= 2.0 && 
        // Demo.PP_ColorChanels[2] <= 1.0 && 
        Demo.useBlur == false && 
        // Demo.useChromatic == false &&
        Demo.useDither == false && 
        // Demo.useColor == true && 
        Demo.useDuotone == true &&
        Demo.DuotoneDark[0] >= 0.5 &&
        Demo.DuotoneDark[1] >= 0.5 &&
        Demo.DuotoneDark[2] <= 0.2 &&
        Demo.DuotoneLight[0] >= 0.2 &&
        Demo.DuotoneLight[1] <= 0.2 &&
        Demo.DuotoneLight[2] >= 0.4
    ){  
        console.log("Gojo good");
        return true;
    }
    console.log("Gojo bad");
    return false;
}

function pp_vinny(){
    if(
        Demo.PP_ColorChanels[0] <= 1.0 && 
        Demo.PP_ColorChanels[1] <= 1.0 && 
        Demo.PP_ColorChanels[2] >= 1.5 && 
        Demo.useBlur == false && 
        Demo.useChromatic == true &&
        Demo.useDither == true && 
        Demo.useColor == true && 
        Demo.useDuotone == false
    ){  
        console.log("Vinny good");
        return true;
    }
    console.log("Vinny bad");
    return false;
}

//RESET
function pp_reset(){
    Demo.useBlur = false;
    Demo.useDither = false;
    Demo.useDuotone = false;
    Demo.useChromatic = false;
    Demo.useColor = true;
    Demo.PP_ColorChanels = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);
    Demo.DuotoneDark = glMatrix.vec3.fromValues(0.0, 0.5, 1.0);
    Demo.DuotoneLight = glMatrix.vec3.fromValues(0.2, 0.0, 0.5);
}