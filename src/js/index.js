/* eslint-disable no-unused-vars */
import style from '../css/style.css';
/* eslint-enable no-unused-vars */
const root = document.getElementById('blog');
const setPageTitle = (title = 'The awesome blogger blog!') => {
  const titleEl = document.getElementById('title');
  titleEl.textContent = title;
};

const createPost = async ({ title, name, content }) => {
  const data = {
    title,
    name,
    content
  };

  const json = JSON.stringify(data);
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  };
  const response = await fetch('http://localhost:8000/posts', options);
  if (response.status === 404) {
    document.getElementsByClassName('error')[0].textContent = 'Fanns ingen route att skicka till!';
  } else {
    setPageTitle();
    loadBlogPosts();
  }
};

const renderForm = () => {
  setPageTitle('Skapa ny Post!');
  const html = `
    <header>
      <a class="back" href="#">&#x2190; Tillbaka</a>
    </header>
    <article> 
      <label>Post Titel:</label>
      <input id="titel"/>
      <label>Skriven av:</label>
      <input id="name" />
      <label>Innehåll:</label>
      <textarea id="content" ></textarea>
      <button id="create" class="primary">Skapa</button>
      <p class="error"></p>
    </article>
  `;
  root.innerHTML = html;
  document.getElementsByClassName('back')[0].addEventListener('click', () => {
    setPageTitle();
    loadBlogPosts();
  });
  document.getElementById('create').addEventListener('click', event => {
    event.preventDefault();
    const isFilled =
      document.getElementById('name').value &&
      document.getElementById('titel').value &&
      document.getElementById('content').value;

    if (!isFilled) {
      document.getElementsByClassName('error')[0].textContent = 'Alla fält måste vara ifyllda';
    } else {
      const data = {
        title: document.getElementById('titel').value,
        name: document.getElementById('name').value,
        content: document.getElementById('content').value
      };
      createPost(data);
    }
  });
};

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
