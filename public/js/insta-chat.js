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

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function arrayBufferToBase64String(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer)
    var byteString = '';
    for (var i=0; i<byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    return btoa(byteString);
}

// snipet to join chat room
document.getElementById("form-join").onclick = async function () {
  if (!joinLink.value) {
    return;
  }
  let chatLink = joinLink.value;
  if (chatLink.length > 12) {
    return invalidLink();
  }
  try {
    let keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const exportedPvt = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    const exportedPub = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);

    const importedPvt = await window.crypto.subtle.importKey(
      "jwk",
      exportedPvt,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      [ "decrypt"]
    );
    console.log("importedPvt:", importedPvt);

    const importedPub = await window.crypto.subtle.importKey(
      "jwk",
      exportedPub,
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );

    console.log("importedPub:", importedPub);
    let enc = new TextEncoder().encode("Hello World");
    let encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      importedPub,
      enc
    );
    console.log("encryted: ",  arrayBufferToBase64String(encrypted));//new TextDecoder().decode(encryted)

    let decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      importedPvt,
      encrypted
    ); 
    console.log("decryted:", new TextDecoder().decode(decrypted));
  } catch (error) {
    console.error(error);
  }

  // let privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  // const exportedAsString = ab2str(privateKey);
  // const exportedAsBase64 = window.Buffer.from(exportedAsString, "base64").toString("base64");
  // console.log(exportedAsBase64);

  return; // console.log(await window.genKeyPair());
  //join room
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
      let e = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000); //expires after a day
      // document.cookie = 'user_id='+ JSON.stringify(data.data.user_id) +';expires=' + e;
      document.cookie = JSON.stringify(data.data) + ";expires=" + e;
    } else {
      invalidLink();
    }
  } catch (error) {
    console.error(error);
  }
  joinLink.value = "";
};
