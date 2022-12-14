const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  input.value = "";
}
form.addEventListener("submit", handleRoomSubmit);


// const messageList = document.querySelector("ul")
// const nickForm = document.querySelector("#nick")
// const messageForm = document.querySelector("#message")
// const socket = new WebSocket(`ws://${window.location.host}`)

// socket.addEventListener("open", () => {
//     console.log("Connected to server")
// })

// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li")
//     li.innerText = message.data
//     messageList.append(li)
// })

// socket.addEventListener("close", () => {
//     console.log("Disconnected to server")
// })

// function makeMessage (type, payload) {
//     const message = {type, payload}
//     return JSON.stringify(message)
// }
// function handleSubmit(event) {
//     event.preventDefault()
//     const input = messageForm.querySelector("input")
//     socket.send(makeMessage("new_message", input.value))
//     const li = document.createElement("li")
//     li.innerText = `You: ${input.value}`
//     messageList.append(li)
//     input.value = ""
// }

// function handleNickSubmit(event) {
//     event.preventDefault()
//     const input = nickForm.querySelector("input")
//     socket.send(makeMessage("nickname", input.value))
//     input.value = ""
// }
// messageForm.addEventListener("submit", handleSubmit);    
// nickForm.addEventListener("submit", handleNickSubmit)