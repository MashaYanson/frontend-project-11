export default function render(state){
    //рисуем инпут
    const urlInput = document.getElementById('inputAddress');
    if(state.validation){
        urlInput.value = '';
        urlInput.classList.remove('is-invalid');
        urlInput.classList.add('is-valid');
        urlInput.focus()
    } else {
        urlInput.classList.remove('is-valid');
        urlInput.classList.add('is-invalid');
    }
    // рисуем список

   const htmlString = `<section>
                            <div class="row">
                                <div class="col-md-10 col-lg-8 order-1 mx-auto posts">
                                posts
                                </div>
                                <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds">
                                feeds
                                </div>
                            </div>
                        </section>`
    console.log(htmlString)
    // const el = getelemenbyid
    //el.innerHtml = htmlString
}

