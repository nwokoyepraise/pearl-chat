let socket = io("/chat");
let room = document.getElementById("room").textContent;
socket.emit("join_room", room);

let inputSlider = document.getElementById("input-slider"),
  activeAway = document.getElementById("active-away"),
  expandIcon = document.getElementById("expand-icon"),
  msgsList = document.getElementById("msgs-list"),
  msg = document.getElementById("div-msg"),
  fragment = document.createDocumentFragment(),
  msgIcon = document.getElementById("msg-icon"),
  msgNameTag = document.getElementById("msg-name-tag"),
  msgName = document.getElementById("msg-name"),
  msgCount = document.getElementById("msg-count"),
  msgSection = document.getElementById("msg-section"),
  btnSend = document.getElementById("send"),
  input = document.getElementById("input"),
  form = document.getElementById("form"),
  messages = document.getElementById("messages"),
  senderMsg = document.getElementById("sender-msg"),
  expandProspect = document.getElementById("expand-prospect-details"),
  detailsContainer = document.getElementById("details-container"),
  expandNotes = document.getElementById("expand-notes"),
  notesContainer = document.getElementById("notes-container"),
  expandOnboard = document.getElementById("expand-onboard"),
  onboardContainer = document.getElementById("onboard-container");

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      document.getElementById("user-section").style.marginRight = "0px";
    } else {
      document.getElementById("user-section").style.marginRight = `${-document.body.clientWidth / 2}px`;
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

window.addEventListener("load", function () {
  let mColors = ["#fe95ca", "#deba31", "#998afe", "#649ef3"];
  let mNames = ["Henry Boyd", "Martha Curtis", "Chuks Nweze", "Louis Ezeka"];
  let nameTag = ["HB", "MC", "CN", "LE"];

  for (let i = 0; i < 4; i++) {
    let item = msg.cloneNode(true);
    msgIcon.style.backgroundColor = mColors[i];
    msgNameTag.textContent = nameTag[i];
    msgName.textContent = mNames[i];
    item.id = `${item.id}${i}`;
    fragment.appendChild(item);
  }

  msgsList.appendChild(fragment);
  msgCount.textContent = msgsList.childElementCount;
});

inputSlider.addEventListener("change", function () {
  if (this.checked) {
    setTimeout(function () {
      activeAway.innerHTML = "Active";
    }, 400);
  } else {
    setTimeout(function () {
      activeAway.innerHTML = "Away";
    }, 400);
  }
});

expandIcon.onclick = function () {
  expandIcon.innerText = expandIcon.innerText == "expand_more" ? "expand_less" : "expand_more";
  msgsList.style.display = expandIcon.innerText == "expand_more" ? "block" : "none";
  if (expandIcon.innerText == "expand_less") {
    document.getElementById("div-settings").style.position = "absolute";
    document.getElementById("div-settings").style.bottom = 10 + "px";
  } else {
    document.getElementById("div-settings").style.position = "relative";
  }
};

msgsList.addEventListener("click", function (ev) {
  if (ev.target.closest("DIV").className != "div-msg") {
    return;
  }
  let closestDiv = ev.target.closest("DIV");
  document.querySelectorAll(".div-msg").forEach((element) => (element.style.backgroundColor = "white"));
  closestDiv.style.backgroundColor = "#dadce0";
});

form.addEventListener("submit", function (ev) {
  ev.preventDefault();
});

btnSend.onclick = function () {
  if (!input.value) {
    return;
  }
  let item = document.createElement("li");
  let divMsg = document.createElement("div");
  divMsg.className = "sender-msg msg-item";
  divMsg.textContent = input.value;
  item.appendChild(divMsg);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  socket.emit("message", { room_number: room, message: input.value });
  input.value = "";
};

socket.on("message", (message) => {
  let item = document.createElement("li");
  let divMsg = document.createElement("div");
  divMsg.className = "receiver-msg msg-item";
  divMsg.textContent = message;
  item.appendChild(divMsg);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

expandProspect.onclick = function () {
  expandProspect.innerText = expandProspect.innerText == "expand_more" ? "expand_less" : "expand_more";
  detailsContainer.style.display = expandProspect.innerText == "expand_more" ? "block" : "none";
};

expandNotes.onclick = function () {
  expandNotes.innerText = expandNotes.innerText == "expand_more" ? "expand_less" : "expand_more";
  notesContainer.style.display = expandNotes.innerText == "expand_more" ? "block" : "none";
};

expandOnboard.onclick = function () {
  expandOnboard.innerText = expandOnboard.innerText == "expand_more" ? "expand_less" : "expand_more";
  onboardContainer.style.display = expandOnboard.innerText == "expand_more" ? "block" : "none";
};
