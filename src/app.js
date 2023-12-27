import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/ENG.js';
import axios from "axios";

const validation = (url, addedLinks) => {
    const schema = yup.string()
        .trim()
        .url()
        .required()
        .notOneOf(addedLinks)
        .validate(url)
    return schema
}

const getResponse = (link) => {
    const url = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`
    return axios.get(url); 
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
           .then((value)=>{
               getResponse(value)
                   .then((resp)=>{
                       //парсинг resp.data.content
                   console.log(resp)
                       watchedState.urls = [value, ...watchedState.urls];
                       watchedState.validation = true
               })
            })
            .catch((error)=>{
                error.name = i18Instance.t('errors.defaultError')
                alert(error.message);
                watchedState.validation = false

            })
        
    }
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    
    }
}