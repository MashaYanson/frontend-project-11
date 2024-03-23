const renderForm = (state, i18Instance, elem) => {
  const elements = { ...elem };
  if (state.status === 'loading') {
    elements.submitButton.setAttribute('disabled', true);
  }
  if (state.status === 'success') {
    elements.urlInput.value = '';
    elements.urlInput.classList.remove('is-invalid');
    elements.urlInput.classList.add('is-valid');
    elements.urlInput.focus();
    elements.feedbackMessageEl.classList.add('text-success');
    elements.feedbackMessageEl.classList.remove('text-danger');
    elements.feedbackMessageEl.textContent = i18Instance.t('interface.loadSuccess');
  }
  if (state.status === 'failed') {
    elements.feedbackMessageEl.textContent = i18Instance.t(state.error);
    elements.urlInput.classList.replace('is-valid', 'is-invalid');
    elements.feedbackMessageEl.classList.replace('text-success', 'text-danger');
    elements.submitButton.removeAttribute('disabled');
  }
  if (state.status === 'filling') {
    elements.feedbackMessageEl.textContent = '';
  } else {
    elements.submitButton.removeAttribute('disabled');
  }
};

const createPost = (state, i18Instance) => {
  const { posts } = state;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18Instance.t('interface.posts');

  cardBody.append(h2);
  card.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(ul);

  posts.forEach((post, i) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    ul.append(li);
    const isReaded = state.viewedPostsIds.includes(post.id) ? 'fw-normal' : 'fw-bold';

    const a = document.createElement('a');
    a.classList.add(isReaded);
    a.dataset.readedLink = post.id;
    a.dataset.id = i;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    a.setAttribute('href', post.link);
    a.textContent = post.title;

    li.append(a);

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.modalIndex = i;
    button.dataset.readedLink = post.id;
    button.dataset.id = post.id;
    button.setAttribute('type', 'button');
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18Instance.t('interface.preview');

    li.append(button);
  });

  return card;
};
const createModal = (state) => {
  const post = state.posts[state.modalPostId];

  const title = document.querySelector('.modal-title');
  const description = document.querySelector('.modal-body');
  const link = document.querySelector('.full-article');

  title.textContent = post?.title || '';
  description.textContent = post?.description || '';
  link.setAttribute('href', post?.link || '');

  const linkDom = document.querySelector(`[data-id="${state.modalPostId}"]`);
  linkDom.classList.remove('fw-bold');
  linkDom.classList.add('fw-normal');
};
const createFeed = (state, i18Instance) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18Instance.t('interface.feeds');

  cardBody.append(h2);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(ul);

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    ul.append(li);

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.append(h3);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
  });

  return card;
};

export default function render(state, i18Instance, path, elem) {
  const elements = { ...elem };
  // const submitButton = document.getElementById('submitbtn');
  // const postEl = document.getElementById('posts-container');
  // const feedsEl = document.getElementById('feeds');
  // const feedbackMessageEl = document.querySelector('.feedback');
  // const urlInput = document.getElementById('inputAddress');
  // const modalWindow = document.getElementById('modal-dialog');
  switch (path) {
    case 'status':
      renderForm(state, i18Instance, elem);
      // if (state.status === 'loading') {
      //   elements.submitButton.setAttribute('disabled', true);
      // }
      // if (state.status === 'success') {
      //   elements.urlInput.value = '';
      //   elements.urlInput.classList.remove('is-invalid');
      //   elements.urlInput.classList.add('is-valid');
      //   elements.urlInput.focus();
      //   elements.feedbackMessageEl.classList.add('text-success');
      //   elements.feedbackMessageEl.classList.remove('text-danger');
      //   elements.feedbackMessageEl.textContent = i18Instance.t('interface.loadSuccess');
      // }
      // if (state.status === 'failed') {
      //   elements.feedbackMessageEl.textContent = i18Instance.t(state.error);
      //   elements.urlInput.classList.replace('is-valid', 'is-invalid');
      //   elements.feedbackMessageEl.classList.replace('text-success', 'text-danger');
      //   elements.submitButton.removeAttribute('disabled');
      // }
      // if (state.status === 'filling') {
      //   elements.feedbackMessageEl.textContent = '';
      // } else {
      //   elements.submitButton.removeAttribute('disabled');
      // }
      break;

    case 'feeds':
      elements.feedsEl.innerHTML = '';
      elements.feedsEl.append(createFeed(state, i18Instance));
      break;

    case 'viewedPostsIds':
    case 'posts':
      elements.postEl.innerHTML = '';
      elements.postEl.append(createPost(state, i18Instance));
      break;

    case 'error':
      elements.feedbackMessageEl.textContent = i18Instance.t(state.error);
      elements.urlInput.classList.remove('is-valid');
      elements.urlInput.classList.add('is-invalid');
      elements.feedbackMessageEl.classList.remove('text-success');
      elements.feedbackMessageEl.classList.add('text-danger');
      // }
      break;

    case 'modalPostId':
      elements.modalWindow.append(createModal(state));
      break;

    default:
      break;
  }
}
