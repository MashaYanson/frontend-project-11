const createModal = (state) => {
  const post = state.posts[state.modalIndex];

  const title = document.querySelector('.modal-title');
  const description = document.querySelector('.modal-body');
  const link = document.querySelector('.full-article');

  title.textContent = post?.title || '';
  description.textContent = post?.description || '';
  link.setAttribute('href', post?.link || '');

  // const content = document.createElement('div');
  // content.classList.add('modal-content');
  //
  // const header = document.createElement('div');
  // header.classList.add('modal-header');
  // content.append(header);
  //
  // const h5 = document.createElement('h5');
  // h5.classList.add('modal-title');
  // h5.textContent = post?.title || '';
  // header.append(h5);
  //
  // const btnClose = document.createElement('button');
  // btnClose.classList.add('btn-close');
  // return `
  //   <div class="modal-content">
  //     <div class="modal-header">
  //       <h5 class="modal-title">${post?.title || ''}</h5>
  //       <button type="button" class="btn-close" data-bs-dismiss="modal"
  //       aria-label="Close"></button>
  //     </div>
  //     <div class="modal-body text-break">
  //      ${post?.description || ''}
  //     </div>
  //     <div class="modal-footer">
  //
  //
  // <button type="button" class="btn btn-primary full-article"
  // href=${post?.link || ''}>${i18Instance.t('interface.readMoreButton')}
  // </button>
  //       <button type="button" class="btn btn-secondary close-modal" data-bs-dismiss="modal">
  //       ${i18Instance.t('interface.closeButton')}</button>
  //     </div> `;
};
export default createModal;
