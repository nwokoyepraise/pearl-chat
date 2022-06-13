let currentModal = "none";
let bodyOverlay = document.getElementById("body-overlay");
let newMeetingModal = document.getElementById("new-meeting-modal");
let linkCopied = document.getElementById("link-copied");
let joinMeetingModal = document.getElementById("join-meeting-modal");
let joinLink = document.getElementById('join-link');

//snippet for controlling the start height and width of illustration dots
window.addEventListener("load", function () {
  var div = document.querySelector(".div-right div.img");
  var dot = document.querySelector(".illus-dots");
  var div_text = document.querySelector("div.illus-text");

  var img_rect = document.querySelector(".div-right div img").getBoundingClientRect();
  var illus_text_rect = document.querySelector("div.illus-text .text1").getBoundingClientRect();

  div.style.height = img_rect.height + "px";
  div.style.width = img_rect.width + "px";

  div_text.style.height = illus_text_rect.height + "px";
  div_text.style.width = illus_text_rect.width + "px";
});

// <!-- snippet for new-meeting modal -->
document.getElementById("new-meeting").onclick = function () {
  let uuid = window.cryptGen(10);
  // document.getElementById("chat-code").textContent;
  console.log(uuid);
  new QRCode(document.getElementById("qrcode"), {
    text: uuid,
    width: 120,
    height: 120,
    colorDark: "#ffffff",
    colorLight: "#10283f",
    correctLevel: QRCode.CorrectLevel.H,
  });
  bodyOverlay.style.display = "block";
  newMeetingModal.style.display = "block";
  document.getElementById("chat-link").innerText = `https://tiny.ul/${uuid.substring(0, 8)}`;
  currentModal = "new-meeting";
};

document.getElementById("close").onclick = function () {
  newMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
  document.querySelector("#qrcode > canvas").remove();
};

//snippet to close modals when a click is performed outside the scope of the modals
window.onclick = function (event) {
  if (event.target == bodyOverlay) {
    switch (currentModal) {
      case "new-meeting":
        newMeetingModal.style.display = "none";
        bodyOverlay.style.display = "none";
        document.querySelector("#qrcode > canvas").remove();
        break;

      case "join-meeting":
        joinMeetingModal.style.display = "none";
        bodyOverlay.style.display = "none";
        break;
    }
  }
  if (event.target != menuModal && event.target != menuSpan) {
    menuModal.style.display = "none";
  }
};

document.getElementById("copy-link-container").onclick = function () {
  let text = document.getElementById("chat-link");

  navigator.clipboard.writeText(text.innerText);
  linkCopied.style.display = "block";
  setTimeout(function () {
    linkCopied.style.display = "none";
  }, 4000);
};

// <!-- snippet for join meeting modal -->
document.getElementById("join-meeting").onclick = function () {
  joinMeetingModal.style.display = "block";
  bodyOverlay.style.display = "block";
  currentModal = "join-meeting";
};

document.getElementById("join-close").onclick = function () {
  joinMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

document.getElementById("form-join").onclick = function () {
  if (!joinLink.value) {return; }
  let chatLink = joinLink.value;
  window.location.href = `/chats/${chatLink}`;
  joinLink.value = '';
};
