import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/ENG.js';
import getResponse from "./getResponse.js";
import validation from "./validationSchema.js";

export default function App(){
  
    let state = {
        urls: [],
        validation: true,
        feeds: [],
        posts: [],
        loadingStatus: null,
        textError: '',
        isError: false,
        
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
    }).then(()=>{
        yup.setLocale({
            string:{
                url: i18Instance.t('errors.urlInvalid'),
                required: i18Instance.t('errors.urlRequired'),
               
            },
            mixed:{
                notOneOf : i18Instance.t('errors.urlExists'),
            }
        })
    })

    
    const watchedState = onChange(state, handleRender)
    const form = document.getElementById('urlform');
    form.addEventListener("submit", handleSubmit)
    

    function handleSubmit(event){
        event.preventDefault()
        const urlInput = document.getElementById('inputAddress');
        const urlValue = urlInput.value;
        
       validation(urlValue, watchedState.urls, i18Instance)
           .then((value)=> {getResponse(value,watchedState)})
            .catch((error)=>{
                watchedState.isError = true
                error.name = i18Instance.t('errors.invalidUrl')
                watchedState.textError = i18Instance.t('errors.invalidUrl');
                watchedState.validation = false
            })
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    }
}