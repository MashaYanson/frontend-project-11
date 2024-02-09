import createModal from "./components/createModal.js";
import createFeed from "./components/createFeed.js";
import createPost from "./components/createPost.js";

export default function render(state, i18Instance) {
    
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
     const submitButton = document.getElementById('submitbtn')
    
     if (state.loadingStatus === 'loading') {
         submitButton.setAttribute('disabled', true)
         
     } else  {
        submitButton.removeAttribute('disabled')
    }
     

    
    //const el = document.getElementById('content')

    // if (!state.isError) {
    //     el.innerHTML = createHtmlString(state, i18Instance)
    // }
    // if(state.modalIndex !== null){
        const el = document.getElementById('modal-dialog')
        el.innerHTML = createModal(state, i18Instance)
    // }
   
    if (state.feeds.length > 0) {
        createFeed(state, i18Instance)
        createPost(state, i18Instance)
        
    }

}

