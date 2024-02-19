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
export default createModal;
