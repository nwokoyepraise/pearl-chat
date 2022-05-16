const menuSpan = document.getElementById("menu-span");
let menuModal = document.getElementById("menu-modal");
let body = document.getElementById("body");
let menuVisible = false;

menuSpan.onclick = function (event) {
    if(!menuVisible) {
        menuModal.style.display = "block";
       // menuVisible = true;
    }
    else {
        menuModal.style.display = "none";
        menuVisible = false;
    }
};

window.onclick = function (event) {
    if (event.target != menuModal && event.target != menuSpan) {
        menuModal.style.display = "none";
        menuVisible = false;
    }
}