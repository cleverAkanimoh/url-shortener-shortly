const form = document.getElementById("form");
const input = document.getElementById("url-shortner-input");
const errorLabel = document.getElementById("error-label");
const shortenBtn = document.getElementById("shorten-btn");
const recordsContainer = document.getElementById("records-container");

let localRecords = [];

window.onload = () => {
  localRecords = localStorage.getItem("short-links").split(",");

  localRecords.forEach((record) => {
    makeDiv(record);
  });
};

const makeDiv = (html) => {
  let div = document.createElement("div");
  div.className = "records";
  div.innerHTML = html;
  const re = recordsContainer.appendChild(div);
  return re;
};

const resetError = (text) => {
  errorLabel.innerText = text;
  input.classList.add("error");
  shortenBtn.disabled = false;
  shortenBtn.innerText = "Shorten it!";
  setTimeout(() => {
    errorLabel.innerText = "";
    input.classList.remove("error");
  }, 5000);
};

const setRecord = (long_url, short_url) => `
<span>${long_url}</span>
<div>
  <a href=${short_url} target="_blank">${short_url}</a>
  <button onclick="() => simplyCopy(${short_url})" class="copy-btn">copy</button>
</div>`;

form.onsubmit = async (e) => {
  e.preventDefault();
  shortenBtn.innerText = "shortening url...";
  // shortenBtn.disabled = true;
  let inputValue = input.value.trim().toLowerCase();

  if (inputValue === "") {
    resetError("input field cannot be empty");
    return;
  }

  if (!inputValue.startsWith("https://")) {
    resetError("Url is not valid. Must start with https://");
    return;
  }

  console.log("getting short link");

  makeDiv(setRecord(inputValue, "no short url yet"));

  localRecords.push(setRecord(inputValue, "no short url yet"));

  localStorage.setItem("short-links", localRecords);

  inputValue = "";
  shortenBtn.innerText = "Shorten it!";
};

// try {

//   // await fetch(`https://cleanuri.com/api/v1/shorten`, {
//   //   mode: "no-cors",
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //     "Access-Control-Allow-Origin": "*",
//   //   },
//   //   body: JSON.stringify(inputValue),
//   // })
//   //   .then((res) => res.json())
//   //   .then((data) => {
//   //     let div = document.createElement("div");
//   //     div.className = "records";
//   //     div.innerHTML = setRecord(inputValue, data.result_url);
//   //     recordsContainer.appendChild(div);

//   //     localStorage.setItem(
//   //       inputValue,
//   //       setRecord(inputValue, data.result_url)
//   //     );
//   //   });

//   // console.log(res);
// } catch (error) {
//   // resetError("Failed to fetch short url. Try again later");

//   // console.error("Failed to fetch: ", error);
// }
