import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/ENG.js';
import getResponse from "./getResponse.js";
import validation from "./validationSchema.js";
import updateFeed from "./updatePosts.js";

export default function App(){
  
    let state = {
        validation: true,
        feeds: [],
        posts: [],
        loadingStatus: null,
        textError: '',
        isError: false,
        readedPosts : [],
        
    }
    // watchedState.urls
    // watchedState.feeds.map(({link})+>link)
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

function refreshFeeds(){
    setTimeout(function repeat() {
        const promises = watchedState.feeds.map((feed)=>{
            return getResponse(feed.feedLink)
        })
        Promise.all(promises).then((responses) => {
            responses.forEach((feed) => {
                updateFeed(watchedState, feed)
            })
        }).catch()
        setTimeout(repeat, 5000);
    }, 5000);
}
    function handleSubmit(event){
        event.preventDefault()
        const urlInput = document.getElementById('inputAddress');
        const urlValue = urlInput.value;
        const links = watchedState.feeds.map(({feedLink})=>feedLink);
        console.log(links)
       validation(urlValue, links, i18Instance)
           .then((value)=> {
               
               return getResponse(value,watchedState, i18Instance)
            // getResponse (resp)=> updateFeed(parse(response))
           })
           .then((feed)=>{
               console.log(feed)
              
               if(!watchedState.feeds.length){
                   refreshFeeds();
               }
               updateFeed(watchedState,feed)
              
           })
            .catch((error)=>{
                watchedState.isError = true
                error.name = i18Instance.t('errors.invalidUrl')
                watchedState.textError = error.message
                watchedState.validation = false
            })
    }
    
   
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    }
}