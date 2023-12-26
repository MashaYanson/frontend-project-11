import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/ENG.js';

const validation = (url, addedLinks, i18 ) => {
    const schema = yup.string()
        .trim()
        .url(i18.t('errors.urlInvalid'))
        .required(i18.t('errors.urlRequired'))
        .notOneOf(addedLinks,i18.t('errors.urlExists'))
        .validate(url)
    return schema
}


export default function App(){
  
    let state = {
        urls: [],
        validation: true,
    }
    
    const i18Instance = i18n.createInstance();
    i18Instance.init({
        lng: 'ru',
        resources: {
            ru: {
                translation: translationRU,
            },
            eng: {
                translation: translationENG,
            },
        },
    })


    const watchedState = onChange(state, handleRender)
    const form = document.getElementById('urlform');
    form.addEventListener("submit", handleSubmit)
    

    function handleSubmit(event){
        event.preventDefault()
        const urlInput = document.getElementById('inputAddress');
        const urlValue = urlInput.value;
       validation(urlValue, watchedState.urls, i18Instance)
           .then((value)=>{
                watchedState.urls = [value, ...watchedState.urls];
                watchedState.validation = true
            })
            .catch((error)=>{
                error.name = i18Instance.t('errors.defaultError')
                alert(error);
                watchedState.validation = false

            })
        
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    
    }
}