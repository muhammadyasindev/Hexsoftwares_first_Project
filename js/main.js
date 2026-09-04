// Read only saved posts.
function getBlogs() {
  try {
    const savedBlogs = localStorage.getItem("blogPosts");

    if (!savedBlogs) return [];

    const blogs = JSON.parse(savedBlogs);

    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    return [];
  }
}

function saveBlogs(blogs) {
  try {
    localStorage.setItem("blogPosts", JSON.stringify(blogs));

    return true;
  } catch (error) {
    return false;
  }
}

// New posts are placed first so the newest story appears at the top.
function addBlog(blog) {
  const blogs = getBlogs();

  blogs.unshift(blog);

  return saveBlogs(blogs);
}

function deleteBlog(id) {
  saveBlogs(getBlogs().filter((blog) => blog.id !== id));
}

function getBlogById(id) {
  return getBlogs().find((blog) => blog.id === id);
}

function escapeHTML(value) {
  const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  };

  return String(value).replace(
    /[&<>'"]/g,
    (character) => replacements[character],
  );
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function blogCard(blog, showDelete = false) {
  const image =
    blog.image && /^https?:\/\//i.test(blog.image)
      ? `<img class="card-image" src="${escapeHTML(blog.image)}" alt="" onerror="this.replaceWith(document.createElement('div'))">`
      : '<div class="card-image image-placeholder" aria-hidden="true">✦</div>';
  const deleteButton = showDelete
    ? `<button class="delete-button" data-delete-id="${escapeHTML(blog.id)}">Delete</button>`
    : "";
  const excerpt = `${escapeHTML(blog.content.slice(0, 125))}${blog.content.length > 125 ? "..." : ""}`;

  return `<article class="blog-card">
    ${image}
    <div class="card-body">
      <span class="category">${escapeHTML(blog.category)}</span>
      <h2>${escapeHTML(blog.title)}</h2>
      <p>${excerpt}</p>
      <div class="card-meta">
        <span>By ${escapeHTML(blog.author)}</span>
        <time datetime="${escapeHTML(blog.date)}">${formatDate(blog.date)}</time>
      </div>
      <div class="card-actions">
        <a class="text-link" href="blog-details.html?id=${encodeURIComponent(blog.id)}">Read More →</a>
        ${deleteButton}
      </div>
    </div>
  </article>`;
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const latestPosts = document.querySelector("#latest-posts");
if (latestPosts) {
  const blogs = getBlogs();
  latestPosts.innerHTML = blogs
    .filter(
      (blog) =>
        blog &&
        typeof blog.title === "string" &&
        typeof blog.content === "string",
    )
    .slice(0, 3)
    .map((blog) => blogCard(blog))
    .join("") || '<p class="empty-state">No blog posts available yet.</p>';
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.querySelector("#contact-message");

    if (!contactForm.checkValidity()) {
      message.textContent = "Please complete every field.";
      message.className = "form-message error";
      return;
    }

    message.textContent = "Your message has been submitted successfully.";
    message.className = "form-message success";
    contactForm.reset();
  });
}

document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".newsletter-message");

    if (!form.checkValidity()) {
      message.textContent = "Enter a valid email.";
      message.className = "newsletter-message error";
      return;
    }

    message.textContent = "Thanks for subscribing!";
    message.className = "newsletter-message success";
    form.reset();
  });
});
