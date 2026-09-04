const blogList = document.querySelector("#blog-list");
const allBlogs = getBlogs().filter(isValidBlog);
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const blogCount = document.querySelector("#blog-count");

if (categoryFilter) {
  [...new Set(allBlogs.map((blog) => blog.category).filter(Boolean))]
    .sort()
    .forEach((category) => {
      categoryFilter.insertAdjacentHTML(
        "beforeend",
        `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`,
      );
    });
  categoryFilter.value =
    new URLSearchParams(window.location.search).get("category") || "all";
}

function renderBlogs() {
  const searchTerm = (searchInput?.value || "").toLowerCase().trim();
  const selectedCategory = categoryFilter?.value || "all";
  const blogs = allBlogs.filter((blog) => {
    const matchesSearch = `${blog.title} ${blog.author} ${blog.content}`
      .toLowerCase()
      .includes(searchTerm);
    return (
      matchesSearch &&
      (selectedCategory === "all" || blog.category === selectedCategory)
    );
  });
  if (blogCount)
    blogCount.textContent = `${blogs.length} ${blogs.length === 1 ? "story" : "stories"}`;
  if (!blogList) return;
  blogList.innerHTML = blogs.length
    ? blogs.map((blog) => blogCard(blog, true)).join("")
    : '<p class="empty-state">No blog posts available yet.</p>';
  blogList.querySelectorAll("[data-delete-id]").forEach((button) =>
    button.addEventListener("click", () => {
      if (window.confirm("Delete this blog post?")) {
        deleteBlog(button.dataset.deleteId);
        window.location.reload();
      }
    }),
  );
}

function isValidBlog(blog) {
  return (
    blog && typeof blog.title === "string" && typeof blog.content === "string"
  );
}

searchInput?.addEventListener("input", renderBlogs);
categoryFilter?.addEventListener("change", renderBlogs);
renderBlogs();
