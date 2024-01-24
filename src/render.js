import createHtmlString from "./components/createHtmlString.js";

export default function render(state) {
 
    const errorMessageEl = document.getElementById('errortext')
    errorMessageEl.textContent = state.textError
    const urlInput = document.getElementById('inputAddress');
    if (!state.isError) {
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        urlInput.focus()
        errorMessageEl.classList.add('text-success')
        errorMessageEl.classList.remove('text-danger')
    } else {
        urlInput.classList.remove('is-valid');
        urlInput.classList.add('is-invalid');
        errorMessageEl.classList.remove('text-success')
        errorMessageEl.classList.add('text-danger')
    }


    // const createContainer = () => {
    //     const card = document.createElement('div')
    //     card.classList.add('card', 'border-0')
    //
    //     const cardBody = document.createElement('div')
    //     cardBody.classList.add('card-body')
    //
    //     const h2 = document.createElement('h2')
    //     h2.classList.add('card-title h4')
    //     h2.textContent('feed/post')
    //
    //     cardBody.append(h2)
    //     card.append(cardBody)
    //
    //     const ul = document.createElement('ul')
    //     ul.classList.add('list-group', 'border-0', 'rounded-0')
    //     card.append(ul)
    // }
 
    

    const el = document.getElementById('content')

    if (!state.isError) {
        el.innerHTML = createHtmlString(state)
    }
    //el.innerHtml = htmlString

}

