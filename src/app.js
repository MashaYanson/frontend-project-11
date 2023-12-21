import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";


export default function App(){
    let state = {
        urls: [],
        validation: true,
    }

    
    const watchedState = onChange(state, handleRender)
    const form = document.getElementById('urlform');
    form.addEventListener("submit", handleSubmit)

    const urlSchema = yup.string().url().required();
    function handleSubmit(event){
        event.preventDefault()
        const urlInput = document.getElementById('inputAddress');
        const urlValue = urlInput.value;
        urlSchema
            .validate(urlValue)
            .then(()=>{
                if (!watchedState.urls.includes(urlValue)){
                    watchedState.urls = [urlValue, ...watchedState.urls];
                    watchedState.validation = true
                } else {
                    watchedState.validation = false
                    alert('URL уже существует')
                }
            })
            .catch(()=>{
                watchedState.validation = false
                alert('Невалидный URL. Пожалуйста, введите корректный URL.')
            })
        
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this.urls)
        render(watchedState.urls)
    
    }
}