const body = document.querySelector("body");
const sidebar = body.querySelector("nav");
const toggle = body.querySelector(".toggle");
const searchBtn = body.querySelector(".search-box");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");
const roomHome = document.getElementById("home");
const roomHomeBtn = document.getElementById("roomHomeBtn");
const roomDetailsBtn = document.getElementById("roomDetailsBtn");
const roomDetailsSection = document.getElementById("roomDetailsSection");
var room_name = "tanRi";
var ImgName, ImgUrl;
var files = [];
var reader = new FileReader();
var savedUsername;
const firebaseConfig_cr = {
  apiKey: "AIzaSyCGqixz0opwM-rHHW4Kz38OA1u6cCTnMZc",
  authDomain: "unrated-2cef8.firebaseapp.com",
  databaseURL: "https://unrated-2cef8-default-rtdb.firebaseio.com",
  projectId: "unrated-2cef8",
  storageBucket: "unrated-2cef8.appspot.com",
  messagingSenderId: "922671772614",
  appId: "1:922671772614:web:f4edcd7d80b30dbb7238c7",
};

const firebaseApp_other = firebase.initializeApp(firebaseConfig_cr, "other");
let person = prompt("Please enter your name:", "tan");
if (person === "tan"){
  let pass = prompt("Please enter pass:", );
  if (pass === "2509"){
    savedUsername = person;
  } else if(person === "Ri"){
    savedUsername = person;
  } else {
    window.location = "new.html"
  }
}

var finalTime;
setInterval(() => {
  var dt = new Date();
  var hours = dt.getHours() % 12 || 12;
  var AmOrPm = dt.getHours() >= 12 ? "PM" : "AM";
  var minutes = dt.getMinutes().toString().padStart(2, "0");
  finalTime = hours + ":" + minutes + " " + AmOrPm;
  // document.getElementById("timetext").innerHTML = finalTime;
}, 1000);
// Main chat function for user load, chat load etc.- -------------------->
function getData() {
  // showall();
  console.log("lollllll");
  // show_user_pro_pic();
  firebaseApp_other
    .database()
    .ref(room_name)
    .on("value", function (snapshot) {
      const output = document.getElementById("output");
      output.innerHTML = "";
      let previousSender = "";
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val();
        const messageType = childData.type;

        const name_of_sender = childData.name;
        const time_get = childData.time;
        const isCurrentUser = name_of_sender === savedUsername;
        const alignment_time = isCurrentUser
          ? "left-align-time"
          : "right-align-time";
        const marginStyle =
          name_of_sender === previousSender ? "margin-top: -4px;" : "";

        const alignment = isCurrentUser ? "right-align2" : "left-align2";
        const alignmentClass = isCurrentUser ? "right-align" : "left-align";
        const border_align = isCurrentUser
          ? "20px 5px 20px 20px"
          : "5px 20px 20px 20px";
        const border_for_name =
          name_of_sender === previousSender
            ? "20px 20px 20px 20px"
            : border_align;

        if (messageType === "Audio") {
          const audioElement = childData.message;

          const messageHTML =
            "<div class='main_msg_contain_audio " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain_audio " +
            alignment +
            " ' style='border-radius: " +
            border_for_name +
            ";' >" +
            "<audio class='audio_play' controls src='" +
            audioElement +
            "'></audio>" +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</div>" +
            "<br>";
          output.innerHTML += messageHTML;
          previousSender = name_of_sender;
        } else if (messageType === "image") {
          const imageElement = childData.message;
          const img_name = childData.nameimage;
          const messageHTML =
            "<div class='main_msg_contain_img " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain_audio' " +
            " style='border-radius: " +
            border_for_name +
            ";'>" +
            "<img onclick='pop_img(this.src)' class='msg_contain_img' src = '" +
            imageElement +
            "' alt = '" +
            img_name +
            "' style = ' height:140px; border-radius:20px; margin-right:0px' >" +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>" +
            "</div>" +
            "</div>" +
            "<br>";
          output.innerHTML += messageHTML;
          previousSender = name_of_sender;
        } else if (childData.message) {
          const message = childData.message;
          const messageHTML =
            "<div class='main_msg_contain " +
            alignmentClass +
            "' style='" +
            marginStyle +
            "'>" +
            "<div class='msg_contain " +
            alignment +
            " ' style='border-radius: " +
            border_for_name +
            ";' >" +
            " <span class='message_text'>" +
            message +
            "</span> " +
            "<p class='time_given " +
            alignment_time +
            "'>" +
            time_get +
            "</p>";
          "</div>" + "</div>" + "<br>";

          output.innerHTML += messageHTML;

          previousSender = name_of_sender;
        }
      });
      output.scrollTop = output.scrollHeight;
    });
}

function send() {
  msg = document.getElementById("msg").value.trim();
  var room_name = "tanRi";
  if (msg.length > 0 && msg != "") {
    firebaseApp_other.database().ref(room_name).push({
      name: savedUsername,
      message: msg,
      time: finalTime,
    });
    document.getElementById("msg").value = "";
  } else {
    console.log("Message cannot be empty");
  }
  previousSender = name;
  // sendSound.play();
}

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    send();
  }
});

function retrieveImage() {
  console.log("Retrieving latest image...");

  var imagesRef = firebaseApp_other
    .database()
    .ref(room_name + "images")
    .orderByKey()
    .limitToLast(1);
  console.log("Entering 'images' folder in the database...");

  imagesRef
    .once("value")
    .then(function (snapshot) {
      console.log("Data retrieved from 'images' folder:");

      snapshot.forEach(function (childSnapshot) {
        var imageDataUrl = childSnapshot.val().imageDataUrl;
        if (imageDataUrl) {
          console.log("Latest image found:", imageDataUrl);

          console.log("Sending latest image URL to chat room...");
          firebaseApp_other
            .database()
            .ref(room_name)
            .push({
              name: savedUsername,
              message: imageDataUrl,
              time: finalTime,
              type: "image",
            })
            .then(() => {
              console.log("Image URL sent to chat successfully.");
            })
            .catch((error) => {
              console.error("Error sending image URL to chat:", error);
            });
        } else {
          console.log("Latest image URL is undefined.");
        }
      });
    })
    .catch(function (error) {
      console.error("Error retrieving image:", error);
    });
}

function clickattach() {
  console.log("file clicked");

  var input = document.getElementById("files");
  input.type = "file";
  input.onchange = (e) => {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.top = "0px";
    files = e.target.files;
    reader = new FileReader();
    reader.onload = function () {
      document.getElementById("myimg").src = reader.result;
    };
    reader.readAsDataURL(files[0]);
  };
  input.click();
}

function uploadImage() {
  var fileInput = document.getElementById("files");

  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    var fileName = file.name.split(".").slice(0, -1).join(".");
    console.log(fileName);
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        saveImageToDatabase(imageDataUrl, fileName);
        console.log("Image uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  } else {
    console.log("No file selected.");
  }
  document.getElementById("overlay").style.display = "none";
  retrieveImage();
}

function saveImageToDatabase(imageDataUrl, fileName, time) {
  firebaseApp_other
    .database()
    .ref(room_name + "images")
    .push({
      imageDataUrl: imageDataUrl,
      nameimage: fileName,
      time: finalTime,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
}

// document.addEventListener("keydown", function (event) {
//   if (event.key === "Escape" || event.keyCode === 27 || event.which === 27) {
//     cancelImage();
//     document.getElementById("overlay_img").style.display = "none";
//   }
// });

function cancelImage() {
  document.getElementById("overlay").style.display = "none";
}

function pop_img(imageUrl) {
  document.getElementById("myimg_image").src = imageUrl;
  console.log(window.innerHeight);
  if (document.getElementById("myimg_image").height > window.innerHeight) {
    document.getElementById("myimg_image").height = window.innerHeight - 140;
  } //else{
  //   document.getElementById("myimg_image").height = "auto";

  // }
  document.getElementById("overlay_img").style.display = "block";
}

createChat();

function createChat() {
  var room_name1 = "tanRi";
  // Check if the chat room already exists
  firebaseApp_other
    .database()
    .ref("/")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.hasChild(room_name1)) {
        // If the chat room already exists with sender-receiver order
        navigateToChat(room_name1);
      } else {
        // If the chat room doesn't exist, create a new one
        firebaseApp_other
          .database()
          .ref("/")
          .child(room_name1)
          .update({
            purpose: "adding room name",
          })
          .then(() => {
            localStorage.setItem("room_name", room_name1);
            navigateToChat(room_name1);
            openChat();
            console.log("output");
          });
      }
    })
    .catch(function (error) {
      console.error("Error checking if chat room exists:", error);
    });
}

function navigateToChat(room_name1) {
  localStorage.setItem("room_name", room_name1);
  console.log(localStorage.getItem("room_name"));
  getData();
}

chatMessages = document.getElementById("output");

function clearChat() {
  let chatRef = firebaseApp_other.database().ref(room_name);
  chatRef.remove();
  document.getElementById("overlay_clear").style.display = "none";
}