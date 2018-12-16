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
loadBlogPosts();
