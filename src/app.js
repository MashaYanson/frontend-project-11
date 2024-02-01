import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/eng.js';
import getResponse from "./getResponse.js";
import validation from "./validationSchema.js";
import updateFeed from "./updatePosts.js";

export const i18Instance = i18n.createInstance();
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
            notOneOf : i18Instance.t('errors.rssExists'),
        }
    })
})
export default function App(){
  
    let state = {
        validation: true,
        feeds: [],
        posts: [],
        readedPosts : [],
        loadingStatus: null,
        textError: '',
        isError: false,
        
        
    }
    // watchedState.urls
    // watchedState.feeds.map(({link})+>link)
    

    
    const watchedState = onChange(state, handleRender)
    const form = document.getElementById('urlform');
    form.addEventListener("submit", handleSubmit)
    
     const posts = document.getElementById('content')
        posts.addEventListener('click', (e)=> {
            if (e.target.classList.contains('read-button')) {
                //console.log(e.target.dataset.link);
                watchedState.readedPosts.push(e.target.dataset.link)
            }
        })
           
    //         const idClick = e.target.dataset.id;
    //         console.log(idClick)
    //     })
    

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
       validation(urlValue, links, i18Instance)
           .then((value)=> {
               watchedState.loadingStatus = 'loading'
               return getResponse(value,watchedState, i18Instance)
            // getResponse (resp)=> updateFeed(parse(response))
           })
           .then((feed)=>{
               watchedState.loadingStatus = 'success'
               watchedState.textError = i18Instance.t('interface.loadSuccess')
               if(!watchedState.feeds.length){
                   refreshFeeds();
               }
               updateFeed(watchedState,feed)
              
           })
            .catch((error)=>{
                console.log('error')
                console.log(error.message)
                watchedState.isError = true
                error.name = i18Instance.t(error)
                watchedState.textError = i18Instance.t(error.message)
                watchedState.validation = false
                // watchedState.isError = true
                // error.name = i18Instance.t('errors.invalidUrl')
                // watchedState.textError = error.message
                // watchedState.validation = false
            })
    }
    

   
    function handleRender (path, value, previousValue, applyData){
        console.log(applyData, this)
        render(watchedState)
    }
}
