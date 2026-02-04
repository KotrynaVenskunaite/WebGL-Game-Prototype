'use strict';

var Demo;

function InitDemo(){
    var canvas = document.getElementById('game_surface');
    var gl = canvas.getContext('webgl2');
    if (!gl) {
        console.log('webgl is not supported, using the experimental version');
        gl = canvas.getContext('experimental-weblg');
    }

    if (!gl){
        alert('sorry, webgl is not supported on this browser');
        return;
    }

    Demo = new DemoScene(gl);
    Demo.Load(function (demoLoadError){
        if (demoLoadError){
            alert('Could not Load demo scene, see console');
            console.error(demoLoadError);
        }else{
            Demo.Begin();
        }
    });
};