let currentModal = "none";
let bodyOverlay = document.getElementById("body-overlay");
let newMeetingModal = document.getElementById("new-meeting-modal");
let linkCopied = document.getElementById("link-copied");
let joinMeetingModal = document.getElementById("join-meeting-modal");
let joinLink = document.getElementById("join-link");
let linkInfo = document.getElementById("link-info"),
  form = document.getElementById("form");

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
  let uuid = window.genChatCode();
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
  document.getElementById("chat-link").innerText = `https://tiny.ul/${uuid}`;
  currentModal = "new-meeting";

  //create room at backend
  fetch("/insta_chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_code: uuid }),
  })
    .then((response) => response.json())
    .then((data) => {});
};

//remove modal on close element click
document.getElementById("close").onclick = function () {
  document.querySelector("#qrcode > img").remove();
  newMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

//snippet to close modals when a click is performed outside the scope of the modals
window.onclick = function (event) {
  if (event.target == bodyOverlay) {
    switch (currentModal) {
      case "new-meeting":
        document.querySelector("#qrcode > img").remove();
        newMeetingModal.style.display = "none";
        bodyOverlay.style.display = "none";
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

//snipet to copy chat link/code
document.getElementById("copy-link-container").onclick = function () {
  let text = document.getElementById("chat-link").textContent;

  navigator.clipboard.writeText(text.substring(text.length - 12, text.length));
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

// snipet to remove elements on close click
document.getElementById("join-close").onclick = function () {
  joinMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

form.addEventListener("submit", function (ev) {
  ev.preventDefault();
});

function invalidLink() {
  linkInfo.style.display = "block";
  setTimeout(function () {
    linkInfo.style.display = "none";
  }, 4000);
}

// snipet to create chat room
document.getElementById("form-join").onclick = async function () {
  if (!joinLink.value) {
    return invalidLink();
  }
  let chatLink = joinLink.value;
  if (chatLink.length > 12) {
    return invalidLink();
  }

  //create room at backend
  try {
    let response = await fetch(`/insta_chat/${chatLink}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (data?.status == true) {
      window.location.href = `/chats/${chatLink}`;
    } else {
      invalidLink();
    }
  } catch (error) {
    console.error(error);
  }
  joinLink.value = "";
};
