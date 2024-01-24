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

    
    const el = document.getElementById('content')

    if (!state.isError) {
        el.innerHTML = createHtmlString(state)
    }

}

