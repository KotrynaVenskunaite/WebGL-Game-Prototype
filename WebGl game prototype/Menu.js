document.addEventListener("DOMContentLoaded", () => {
    const play = document.getElementById("play");
    const pause_menu = document.getElementById("pause");
    const about_menu = document.getElementById("about_section");
    const about = document.getElementById("about");
    const back = document.getElementById("back");
    const pause_buttons = document.getElementById("pause_buttons");
    

    document.addEventListener("keydown", function(event) {
        
        if(event.code == "Space" && pause_menu.style.display == "none") {
            
            pause_menu.style.display = "flex";
            Demo.can_cam_move = false;
            is_paused = true;
        }
        else if(event.code == "Space" && pause_menu.style.display == "flex") {
            resumeGame();
        }
    });

    play.addEventListener("click", resumeGame);
    about.addEventListener("click", showAboutSection);
    back.addEventListener("click", returnToAbout);

    function resumeGame() {
        Demo.can_cam_move = true;
        pause_menu.style.display = "none";
        is_paused = false;
    }

    function showAboutSection(){
        pause_buttons.style.display = "none";
        about_menu.style.display = "flex";
    }

    function returnToAbout(){
        pause_buttons.style.display = "flex";
        about_menu.style.display = "none";
    }
});