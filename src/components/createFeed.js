const createFeed = ({title, description}) => {
    return `<li class="list-group-item border-0 border-end-0">
<h3 class="h6 m-0">${title}</h3>
<p class="m-0 small text-black-50">
${description}</p>
</li>`}
export default createFeed