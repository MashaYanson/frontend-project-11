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
        .url(i18n.t('urlInvalid'))
        .required(i18n.t('urlRequired'))
        .trim()
        .notOneOf(addedLinks, i18n.t('urlExists'))
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
                    alert(i18n.t('validation.urlExists'))
                }
            })
            .catch(()=>{
                watchedState.validation = false
                alert(i18n.t('validation.urlInvalid'))
            })
        
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this.urls)
        render(watchedState.urls)
    
    }
}