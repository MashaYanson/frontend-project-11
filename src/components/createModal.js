const createModal = (state, i18Instance) => {
  const post = state.posts[state.modalIndex];
  return `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${post?.title || ''}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
       ${post?.description || ''}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary full-article" href=${post?.link || ''}>${i18Instance.t('interface.readMoreButton')}</button>
        <button type="button" class="btn btn-secondary close-modal" data-bs-dismiss="modal">${i18Instance.t('interface.closeButton')}</button>
      </div>
`;
};
export default createModal;
