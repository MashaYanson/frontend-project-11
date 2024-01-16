import onChange from "on-change";
import * as yup from 'yup';
import render from "./render.js";
import i18n from 'i18next';
import translationRU from './locales/ru.js';
import translationENG from './locales/ENG.js';
import axios from "axios";
import parse from './parse.js'
import {uniqueId} from 'lodash';
import {value} from "lodash/seq.js";

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
    return axios.get(url, { timeout: 10000 }); 
}

const createFeed = (parsedRss, value) => {
    const feedTitle = parsedRss.title;
    const feedDescription = parsedRss.description;
    const feedId = uniqueId();
    const feedLink = value;
    return {
        title:feedTitle,
        description:feedDescription,
        feedId,
        feedLink,
        posts: parsedRss.posts || []
    };
}

// const createPost = () => {
//    
// }

export default function App(){
  
    let state = {
        urls: [],
        validation: true,
        feeds: [],
        posts: []
      
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
           .then((value)=> getResponse(value))
           .then((resp)=> {
               const feed = createFeed(parse(resp), value)
               watchedState.urls = [value, ...watchedState.urls]
               watchedState.feeds = [feed,...watchedState.feeds]
               watchedState.posts = watchedState.feeds.reduce((acc, feed) => {
                   return [...acc, ...feed.posts]
               }, []);
               
               watchedState.validation = true
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