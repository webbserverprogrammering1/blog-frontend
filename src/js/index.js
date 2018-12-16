/* eslint-disable no-unused-vars */
import style from '../css/style.css';
/* eslint-enable no-unused-vars */
const renderBlogPosts = posts => {
  posts = posts.sort((a, b) => (a > b ? 0 : -1));
  let html = `
    <header>
      <button id="new" class="primary">Skapa ny post</button>
    </header>
  `;

  posts.forEach(post => {
    html += `
    <article>
      <h2>${post.title}</h2>
      <p>Skriven av: <span class="primary">${post.writtenBy}</span></p>
      <p>${post.excerpt}.. <a class="readmore" data-id="${post.id}" href="#">läs mer!</a></p>
      <p class="error error${post.id}"></p>
    </article>
    `;
  });
  root.innerHTML = html;

  document.getElementById('new').addEventListener('click', renderForm);

  const nodes = document.getElementsByClassName('readmore');
  const articles = Array.from(nodes);
  articles.forEach(article => {
    article.addEventListener('click', renderBlogPost);
  });
};

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
