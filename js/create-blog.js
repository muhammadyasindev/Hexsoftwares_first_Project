const form = document.querySelector("#create-blog-form");
const content = document.querySelector("#content");
const preview = document.querySelector("#blog-preview");
const characterCount = document.querySelector("#character-count");

function updatePreview() {
  if (!preview || !form) return;
  preview.querySelector(".category").textContent =
    document.querySelector("#category").value || "Your category";
  preview.querySelector("h2").textContent =
    document.querySelector("#title").value || "Your blog title";
  preview.querySelector(".card-body > p").textContent =
    content.value || "Your story preview will appear here as you type.";
  preview.querySelector(".card-meta span").textContent =
    `By ${document.querySelector("#author").value || "Your name"}`;
}

function validateForm() {
  const message = document.querySelector("#form-message");
  if (!form.checkValidity()) {
    message.textContent = "Please complete all required fields.";
    message.className = "form-message error";
    return false;
  }
  return true;
}

content?.addEventListener("input", () => {
  if (characterCount)
    characterCount.textContent = `${content.value.length} / 3000`;
  updatePreview();
});
["#title", "#author", "#category"].forEach((selector) =>
  document.querySelector(selector)?.addEventListener("input", updatePreview),
);

if (form)
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector("#form-message");
    if (!validateForm()) return;
    const data = new FormData(form);
    let image = String(data.get("image") || "").trim();
    // Only keep web URLs. A bad optional image should never block publishing.
    try {
      if (image && !["http:", "https:"].includes(new URL(image).protocol))
        image = "";
    } catch (error) {
      image = "";
    }
    const saved = addBlog({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: data.get("title").trim(),
      author: data.get("author").trim(),
      category: data.get("category").trim(),
      content: data.get("content").trim(),
      image,
      date: new Date().toISOString().slice(0, 10),
    });
    if (!saved) {
      message.textContent = "Your browser could not save this blog.";
      message.className = "form-message error";
      return;
    }
    message.textContent = "Blog published successfully. Redirecting...";
    message.className = "form-message success";
    form.reset();
    window.setTimeout(() => {
      window.location.href = "blogs.html";
    }, 500);
  });
