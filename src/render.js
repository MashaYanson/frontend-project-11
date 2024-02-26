import createModal from './components/createModal.js';
import createFeed from './components/createFeed.js';
import createPost from './components/createPost.js';

export default function render(state, i18Instance, path) {
  const submitButton = document.getElementById('submitbtn');
  const postEl = document.getElementById('posts-container');
  const feedsEl = document.getElementById('feeds');
  const feedbackMessageEl = document.querySelector('.feedback');
  const urlInput = document.getElementById('inputAddress');
  const modalWindow = document.getElementById('modal-dialog');
  switch (path) {
    case 'status':
      if (state.status === 'loading') {
        submitButton.setAttribute('disabled', true);
      }
      if (state.status === 'success') {
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        urlInput.focus();
        feedbackMessageEl.classList.add('text-success');
        feedbackMessageEl.classList.remove('text-danger');
        feedbackMessageEl.textContent = i18Instance.t('interface.loadSuccess');
      }
      if (state.status === 'failed') {
        feedbackMessageEl.textContent = i18Instance.t(state.error);
        urlInput.classList.replace('is-valid', 'is-invalid');
        feedbackMessageEl.classList.replace('text-success', 'text-danger');
        submitButton.removeAttribute('disabled');
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
      feedbackMessageEl.textContent = i18Instance.t(state.error);
      urlInput.classList.remove('is-valid');
      urlInput.classList.add('is-invalid');
      feedbackMessageEl.classList.remove('text-success');
      feedbackMessageEl.classList.add('text-danger');
      // }
      break;

    case 'modalPostId':
      modalWindow.append(createModal(state));
      break;

    default:
      break;
  }
}
