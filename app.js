const form = document.getElementById("form");
const input = document.getElementById("url-shortner-input");
const errorLabel = document.getElementById("error-label");
const shortenBtn = document.getElementById("shorten-btn");
const recordsContainer = document.getElementById("records-container");

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
  shortenBtn.disabled = true;
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

  try {
    const res = await fetch(`https://cleanuri.com/api/v1/shorten`, {
      mode: "no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(inputValue),
    });

    console.log(res);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

    console.log(data);
  } catch (error) {
    resetError("Failed to fetch short url. Try again later");
    let div = document.createElement("div");
    div.className = "records"
    div.innerHTML = setRecord(inputValue, "no short url yet");
    recordsContainer.appendChild(div);
    console.error("Failed to fetch: ", error);
  }
  inputValue = "";
  shortenBtn.innerText = "Shorten it!";
};
