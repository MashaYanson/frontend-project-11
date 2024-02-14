import createModal from './components/createModal.js';
import createFeed from './components/createFeed.js';
import createPost from './components/createPost.js';

export default function render(state, i18Instance, path) {
  const submitButton = document.getElementById('submitbtn');
  const postEl = document.getElementById('posts-container');
  const feedsEl = document.getElementById('feeds');
  const errorMessageEl = document.getElementById('errortext');
  errorMessageEl.textContent = i18Instance.t(state.textError);
  const urlInput = document.getElementById('inputAddress');
  console.log(path);

  switch (path) {
    case 'loadingStatus':
      if (state.loadingStatus === 'loading') {
        submitButton.setAttribute('disabled', true);
      } else {
        submitButton.removeAttribute('disabled');
      }
      // console.log(state.loadingStatus);
      break;

    case 'feeds':
      feedsEl.innerHTML = '';
      feedsEl.append(createFeed(state, i18Instance));
      break;

    case 'posts':
      postEl.innerHTML = '';
      postEl.append(createPost(state, i18Instance));
      break;

    case 'textError':
      if (!state.isError) {
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

    case 'modalIndex':
      console.log(createModal());
      break;

    default:
      break;
  }
}
