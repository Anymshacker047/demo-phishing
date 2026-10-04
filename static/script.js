document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("campaignForm");
  const usernameInput = document.getElementById("username");
  const referralInput = document.getElementById("referralKey");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const spinner = document.getElementById("spinner");
  const statusMsg = document.getElementById("statusMsg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const referralKey = referralInput.value.trim();

    if (!username) {
      showMessage("Please provide your username.", "error");
      return;
    }

    // Enter Loading State
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    spinner.classList.remove("hidden");
    statusMsg.classList.add("hidden");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          referral_key: referralKey
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showMessage("Success! Redirecting...", "success");
        setTimeout(() => {
          window.location.href = result.redirect_url;
        }, 1200);
      } else {
        showMessage(result.message || "Failed to submit. Try again.", "error");
        resetButton();
      }
    } catch (err) {
      showMessage("Network error. Please try again.", "error");
      resetButton();
    }
  });

  function resetButton() {
    submitBtn.disabled = false;
    btnText.classList.remove("hidden");
    spinner.classList.add("hidden");
  }

  function showMessage(text, type) {
    statusMsg.textContent = text;
    statusMsg.className = `status-msg ${type}`;
    statusMsg.classList.remove("hidden");
  }
});
