const form = document.getElementById("form");
const input = document.getElementById("url-shortner-input");
const errorLabel = document.getElementById("error-label");
const shortenBtn = document.getElementById("shorten-btn");
const recordsContainer = document.getElementById("records-container");

import { simplecopy } from "./simpleCopy.min.js";

let localRecords = [];

recordsContainer.innerHTML = "<span>Loading records...</span>";

window.onload = () => {
  recordsContainer.innerText = "";

  if (localStorage.getItem("short-links")) {
    localRecords = localStorage.getItem("short-links").split(",");

    localRecords.forEach((record) => {
      makeDiv(record);
    });
  }
  const copyBtn = recordsContainer.getElementsByClassName("copy-btn");

  for (let i = 0; i < copyBtn.length; i++) {
    copyBtn[i].onclick = () => {
      simplecopy(copyBtn[i].id || "nothing was copied");
      copyBtn[i].classList.add("active");
      copyBtn[i].innerText = "copied";
      setTimeout(() => {
        copyBtn[i].innerText = "copy";
        copyBtn[i].classList.remove("active");
      }, 3000);
    };
  }
};

const makeDiv = (html) => {
  let div = document.createElement("div");
  div.className = "records";
  div.innerHTML = html;
  const re = recordsContainer.appendChild(div);
  return re;
};

const setError = (text) => {
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
  <button class="copy-btn" id=${short_url} >copy</button>
</div>`;

form.onsubmit = async (e) => {
  e.preventDefault();

  shortenBtn.innerText = "shortening url...";

  shortenBtn.disabled = true;

  let inputValue = input.value.trim().toLowerCase();

  if (inputValue === "") {
    setError("input field cannot be empty");
    return;
  }

  if (!inputValue.startsWith("https://")) {
    setError("Url is not valid");
    return;
  }

  if (localStorage.getItem("short-links")) {
    if (localStorage.getItem("short-links").includes(inputValue)) {
      setError("Url has already been shortened");
      return;
    }
  }

  try {
    const response = await fetch(
      "https://url-shortener-service.p.rapidapi.com/shorten",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "9abd035ae9msh68abda95c90ee51p199ae3jsn9f300f1979e6",
          "X-RapidAPI-Host": "url-shortener-service.p.rapidapi.com",
        },
        body: new URLSearchParams({ url: inputValue }),
      }
    );

    if (response.ok) {
      const result = await response.json();

      makeDiv(setRecord(inputValue, result.result_url));

      localRecords.push(setRecord(inputValue, result.result_url));

      localStorage.setItem("short-links", localRecords);
      return;
    }

    setError("Url is not parsable. Try another Url");
  } catch (error) {
    setError("Failed to fetch short url. Try again later");

    console.error("Failed to fetch: ", error);
  }

  input.value = "";
  shortenBtn.innerText = "Shorten it!";
  shortenBtn.disabled = false;
};
