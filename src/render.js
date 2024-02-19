import createModal from './components/createModal.js';
import createFeed from './components/createFeed.js';
import createPost from './components/createPost.js';

export default function render(state, i18Instance, path) {
  const submitButton = document.getElementById('submitbtn');
  const postEl = document.getElementById('posts-container');
  const feedsEl = document.getElementById('feeds');
  const errorMessageEl = document.getElementById('errortext');
  errorMessageEl.textContent = i18Instance.t(state.error);
  const urlInput = document.getElementById('inputAddress');
  const modalWindow = document.getElementById('modal-dialog');
  switch (path) {
    case 'status':
      if (state.status === 'loading') {
        submitButton.setAttribute('disabled', true);
      } else {
        submitButton.removeAttribute('disabled');
      }
      break;

    case 'feeds':
      feedsEl.innerHTML = '';
      feedsEl.append(createFeed(state, i18Instance));
      break;

    case 'viewedPostsIds':
    case 'posts':
      postEl.innerHTML = '';
      postEl.append(createPost(state, i18Instance));
      break;

    case 'error':
      if (state.status === 'success') {
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        urlInput.focus();
        errorMessageEl.classList.add('text-success');
        errorMessageEl.classList.remove('text-danger');
      } else {
        urlInput.classList.remove('is-valid');
        urlInput.classList.add('is-invalid');
        errorMessageEl.classList.remove('text-success');
        errorMessageEl.classList.add('text-danger');
      }
      break;

    case 'modalPostId':
      console.log('modal');
      modalWindow.append(createModal(state));
      break;

    default:
      break;
  }
}
