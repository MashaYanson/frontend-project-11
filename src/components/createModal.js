import {i18Instance} from "../app.js";
const createModal = (link, title, description,i) => {

    return `<div class="modal fade" id="modal${i}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
       ${description}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary full-article" href=${link}>${i18Instance.t('interface.readMoreButton')}</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18Instance.t('interface.closeButton')}</button>
      </div>
    </div>
  </div>
</div>`
}
export  default  createModal