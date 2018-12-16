/* eslint-disable no-unused-vars */
import style from '../css/style.css';
/* eslint-enable no-unused-vars */
const loadBlogPosts = async () => {
  try {
    const response = await fetch('http://localhost:8000/posts');
    if (response.status === 404) {
      renderError('Kunde inte hitta några bloggposter!');
    }
    const json = await response.json();
    renderBlogPosts(json);
  } catch (e) {
    renderError('Webbservern finns inte tillgänglig på angiven port!');
  }
};

const renderBlogPost = async event => {
  event.preventDefault();
  const postId = event.target.getAttribute('data-id');
  const response = await fetch(`http://localhost:8000/posts/${postId}`);
  if (response.status === 404) {
    const errorEl = document.getElementsByClassName(`error${postId}`)[0];
    errorEl.textContent = 'Kunde inte hitta post!';
  }
  const data = await response.json();
  const post = data[0];
  setPageTitle(post.title);

  const html = `
    <header>
      <a class="back" href="#">&#x2190; Tillbaka</a>
    </header>
    <article>
      <p>Skriven av: <span class="primary">${post.writtenBy}</span></p>
      <p>${post.content}</p>
    </article>
    `;
  root.innerHTML = html;
  document.documentElement.scrollTop = 0;
  document.getElementsByClassName('back')[0].addEventListener('click', () => {
    setPageTitle();
    loadBlogPosts();
  });
};

loadBlogPosts();
