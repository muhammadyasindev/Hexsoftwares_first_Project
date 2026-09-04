// Load one blog from the id in the page URL.
const detailContainer = document.querySelector("#blog-detail");

function renderBlogDetails() {
  if (!detailContainer) return;

  const blogId = new URLSearchParams(window.location.search).get("id");
  const blog = getBlogById(blogId);

  if (
    !blog ||
    typeof blog.title !== "string" ||
    typeof blog.content !== "string"
  ) {
    detailContainer.innerHTML =
      '<p class="form-message error">This blog could not be found.</p><a class="button" href="blogs.html">Back to Blogs</a>';
    return;
  }

  const image =
    blog.image && /^https?:\/\//i.test(blog.image)
      ? `<img class="detail-image" src="${escapeHTML(blog.image)}" alt="" onerror="this.remove()">`
      : "";
  const content = escapeHTML(blog.content).replace(/\n/g, "<br>");

  detailContainer.innerHTML = `${image}
    <span class="category">${escapeHTML(blog.category)}</span>
    <h1>${escapeHTML(blog.title)}</h1>
    <div class="card-meta">
      <span>By ${escapeHTML(blog.author)}</span>
      <time datetime="${escapeHTML(blog.date)}">${formatDate(blog.date)}</time>
    </div>
    <p class="detail-content">${content}</p>
    <a class="button button-light" href="blogs.html">← Back to Blogs</a>`;
}

renderBlogDetails();
