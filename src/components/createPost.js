import createModal from "./createModal.js";
import {i18Instance} from "../app.js";


const createPost = ({link, title},i, readedPosts) => {
    const isReaded = readedPosts.includes(link)
    return `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
<a href=${link} class="${isReaded ? 'fw-normal' : 'fw-bold'} read-button" data-link="${link}" data-id="${i}" target="_blank" rel="noopener noreferrer">${title}</a>
<button type="button" class="btn btn-outline-primary btn-sm read-button open-modal"  data-link="${link}" data-id="${i}" data-bs-toggle="modal" data-bs-target="#modal">
${i18Instance.t('interface.preview')}
</button>
</li>`
}
export default createPost