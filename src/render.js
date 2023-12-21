export default function render(state){
    //рисуем инпут
    const urlInput = document.getElementById('inputAddress');
    if(state.validation){
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.focus()
    } else {
        urlInput.classList.add('is-invalid');
    }
    // рисуем список

   
}