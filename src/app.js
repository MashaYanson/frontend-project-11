import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';


i18n.init({
    lng: 'ru',
    resources: {
        ru: {
            translation: translationRU,
        },
    },
});

const validation = (url, addedLinks, i18n ) => {
    const schema = yup.string()
        .trim()
        .url(i18n.t('errors.urlInvalid'))
        .required(i18n.t('errors.urlRequired'))
        .notOneOf(addedLinks, i18n.t('errors.urlExists'))
        .validate(url)
    return schema
}


export default function App(){
    let state = {
        urls: [],
        validation: true,
    }

    
    const watchedState = onChange(state, handleRender)
    const form = document.getElementById('urlform');
    form.addEventListener("submit", handleSubmit)
    
   


    function handleSubmit(event){
        event.preventDefault()
        const urlInput = document.getElementById('inputAddress');
        const urlValue = urlInput.value;
        const schema = validation(urlValue, watchedState.urls, i18n)
        schema.
            then((value)=>{
                watchedState.urls = [value, ...watchedState.urls];
                watchedState.validation = true
            })
            .catch((error)=>{
                error.name = i18n.t('errors.defaultError')
                alert(error);
                watchedState.validation = false

            })
        
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    
    }
}