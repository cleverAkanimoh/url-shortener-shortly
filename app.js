const form = document.getElementById("form");
const input = document.getElementById("url-shortner-input");
const errorLabel = document.getElementById("error-label");
const shortenBtn = document.getElementById("shorten-btn");

const resetError = (text) => {
  errorLabel.innerText = text;
  input.classList.add("error");
  shortenBtn.innerText = "shorten it!";
  setTimeout(() => {
    errorLabel.innerText = "";
    input.classList.remove("error");
  }, 5000);
};

form.onsubmit = async (e) => {
  e.preventDefault();
  shortenBtn.innerText = "shortening url...";
  let inputValue = input.value.trim().toLowerCase();
  if (inputValue === "") {
    resetError("input field cannot be empty");
    return;
  }

  console.log(form);

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
      console.error("Fetch error:", error);
      console.log("error oo");
      
    }

  shortenBtn.innerText = "shorten it!";
  inputValue = "";
};
