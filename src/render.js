export default function render(state) {
    console.log(state);
    //рисуем инпут
    const urlInput = document.getElementById('inputAddress');
    if (state.validation) {
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        urlInput.focus()
    } else {
        urlInput.classList.remove('is-valid');
        urlInput.classList.add('is-invalid');
    }
    // рисуем список

    const createContainer = () => {
        const card = document.createElement('div')
        card.classList.add('card', 'border-0')

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const h2 = document.createElement('h2')
        h2.classList.add('card-title h4')
        h2.textContent('feed/post')

        cardBody.append(h2)
        card.append(cardBody)

        const ul = document.createElement('ul')
        ul.classList.add('list-group', 'border-0', 'rounded-0')
        card.append(ul)
    }
    // eslint-disable-next-line no-unused-vars
    const createPost = ({link, title, description}) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href=${link} class="fw-bold" data-id="11" target="_blank" rel="noopener noreferrer">${title}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="11" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li>`;
    // eslint-disable-next-line no-unused-vars
    const createFeed = ({title, description}) => `<li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${title}</h3><p class="m-0 small text-black-50">${description}</p></li>`;

    const htmlString = `<div class="row">
                                <div class="col-md-10 col-lg-8 order-1 mx-auto posts">
                                <div class="card border-0" >
                                <div class="card-body">
                                <h2 class="card-title h4">posts</h2>
                                </div>
                                <ul class="list-group border-0 rounded-0">${state.posts.map(createPost).join('')}</ul>
                                </div>
                                
                                </div>
                                <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds">
                                <div class="card border-0" >
                                <div class="card-body">
                                <h2 class="card-title h4">feeds</h2>
                                </div>
                                <ul class="list-group border-0 rounded-0">${state.feeds.map(createFeed).join('')}</ul>
                                </div>
                                </div>
                            </div>`
    console.log(htmlString)
    const el = document.getElementById('content')
    el.innerHTML = htmlString
    //el.innerHtml = htmlString
}

