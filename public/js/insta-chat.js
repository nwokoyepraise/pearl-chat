let currentModal = "none";
let bodyOverlay = document.getElementById("body-overlay");
let newMeetingModal = document.getElementById("new-meeting-modal");
let linkCopied = document.getElementById("link-copied");
let joinMeetingModal = document.getElementById("join-meeting-modal");
let joinLink = document.getElementById("join-link");
let linkInfo = document.getElementById("link-info"),
  form = document.getElementById("form"),
  passphraseCreateModal = document.getElementById("passphrase-create-modal"),
  passphraseEntry = document.getElementById("input-passphrase-entry"),
  passphraseInfo = document.getElementById("passphrase-info"),
  passphraseJoinModal = document.getElementById("passphrase-join-modal"),
  passphraseJoin = document.getElementById("input-passphrase-join"),
  minPassphraseLength = 8;

let chatLink;

form.addEventListener("submit", function (ev) {
  ev.preventDefault();
});

document.getElementById("form-passphrase-join").addEventListener("submit", function (ev) {
  ev.preventDefault();
});
document.getElementById("form-passphrase-create").addEventListener("submit", function (ev) {
  ev.preventDefault();
});

function invalidPassphrase() {
  passphraseInfo.style.display = "block";
  setTimeout(function () {
    passphraseInfo.style.display = "none";
  }, 4000);
}

function invalidPassphraseJoin() {
  let passphraseJoinInfo = document.getElementById("passphrase-join-info");
  passphraseJoinInfo.style.display = "block";
  setTimeout(function () {
    passphraseJoinInfo.style.display = "none";
  }, 4000);
}

function removeModals() {
  if (document.querySelector("#qrcode > img")) {
    document.querySelector("#qrcode > img").remove();
  }
  passphraseEntry.value = "";
  passphraseJoinModal.style.display = "none";
  bodyOverlay.style.display = "none";
  passphraseEntry.value = "";
  passphraseCreateModal.style.display = "none";
  bodyOverlay.style.display = "none";
  newMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
  joinMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
}

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

// <!-- snippet display passphrase modal -->
document.getElementById("new-meeting").onclick = async function () {
  bodyOverlay.style.display = "block";
  passphraseCreateModal.style.display = "block";
  currentModal = "passphrase-create";
};

// snippet to display new-meeting modal
document.getElementById("btn-passphrase").onclick = async function () {
  if (!passphraseEntry.value) {
    return;
  }

  if (passphraseEntry.value.length < minPassphraseLength) {
    return invalidPassphrase();
  }

  let uuid = window.genChatCode();

  //create room at backend
  try {
    let response = await fetch("/insta_chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_code: uuid, passphrase: passphraseEntry.value }),
    });

    let data = await response.json();
    if (data?.status != true) {
      return alert("Oops!, Unbale to create chat link at this point");
    }
  } catch (error) {
    console.error(error);
  }

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
  passphraseEntry.value = "";
  passphraseCreateModal.style.display = "none";
};

//remove modal on close element click
document.getElementById("close").onclick = function () {
  document.querySelector("#qrcode > img").remove();
  newMeetingModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

//remove passphrase join modal on close element click
document.getElementById("passphrase-join-close").onclick = function () {
  passphraseEntry.value = "";
  passphraseJoinModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

//remove passphrase entry modal on close element click
document.getElementById("passphrase-create-close").onclick = function () {
  passphraseEntry.value = "";
  passphraseCreateModal.style.display = "none";
  bodyOverlay.style.display = "none";
};

//snippet to close modals when a click is performed outside the scope of the modals
window.onclick = function (event) {
  if (event.target == bodyOverlay) {
    removeModals();
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

function invalidLink() {
  linkInfo.style.display = "block";
  setTimeout(function () {
    linkInfo.style.display = "none";
  }, 4000);
}

// snipet to join chat room
document.getElementById("form-join").onclick = async function () {
  if (!joinLink.value) {
    return;
  }
  chatLink = joinLink.value;
  if (chatLink.length > 12) {
    return invalidLink();
  } else {
    //check if room exists
    let response = await fetch(`/insta_chat/${chatLink}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();

    if (data.data?.room_exists != true) {
      return invalidLink();
    }
    joinMeetingModal.style.display = "none";
    passphraseJoinModal.style.display = "block";
    currentModal = "passphrase-join";
  }
};

document.getElementById("btn-passphrase-join").onclick = async function () {
  if (!passphraseJoin.value) {
    return;
  }

  let passphraseValue = passphraseJoin.value;
  if (passphraseValue.length < minPassphraseLength) {
    return invalidPassphrase();
  }

  // join room
  try {
    let response = await fetch(`/insta_chat/${chatLink}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ passphrase: passphraseValue }),
    });

    let data = await response.json();

    if (data?.status == true) {
      window.location.href = `/chats/${chatLink}`;
      let e = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000); //expires after a day
      // document.cookie = 'user_id='+ JSON.stringify(data.data.user_id) +';expires=' + e;
      document.cookie = JSON.stringify(data.data) + ";expires=" + e;
      removeModals();
    } else {
      invalidPassphraseJoin();
    }
  } catch (error) {
    console.error(error);
  }
  joinLink.value = "";
  passphraseJoin.value = "";
};
