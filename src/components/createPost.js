import createModal from "./createModal.js";

const createPost = ({link, title, description},i) => {
    return `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
<a href=${link} class="fw-bold" data-id="11" target="_blank" rel="noopener noreferrer">${title}</a>
<button type="button" class="btn btn-outline-primary btn-sm" data-id="11" data-bs-toggle="modal" data-bs-target="#modal${i}">
Просмотр
</button>${createModal(link, title, description, i)}
</li>`
}
export default createPost