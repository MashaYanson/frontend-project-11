import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import render from './render.js';
import translationRU from './locales/ru.js';
import translationENG from './locales/eng.js';
import getResponse from './getResponse.js';
import validation from './validationSchema.js';
import updateFeed from './updatePosts.js';

export default function App() {
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
  }).then(() => {
    yup.setLocale({
      string: {
        url: 'errors.urlInvalid',
        required: 'errors.urlRequired',

      },
      mixed: {
        notOneOf: 'errors.rssExists',
      },
    });
  });
  const state = {
    validation: true,
    feeds: [],
    posts: [],
    readedPosts: [],
    loadingStatus: null,
    textError: '',
    isError: false,
    modalIndex: null,

  };

  // eslint-disable-next-line no-use-before-define
  const watchedState = onChange(state, handleRender);
  const form = document.getElementById('urlform');

  function refreshFeeds() {
    setTimeout(function repeat() {
      const promises = watchedState.feeds.map((feed) => getResponse(feed.feedLink));
      Promise.all(promises).then((responses) => {
        responses.forEach((feed) => {
          updateFeed(watchedState, feed);
        });
      }).catch();
      setTimeout(repeat, 5000);
    }, 5000);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const urlInput = document.getElementById('inputAddress');
    const urlValue = urlInput.value;
    const links = watchedState.feeds.map(({ feedLink }) => feedLink);
    validation(urlValue, links, i18Instance)
      .then((value) => {
        watchedState.loadingStatus = 'loading';
        return getResponse(value, watchedState, i18Instance);
      })
      .then((feed) => {
        watchedState.loadingStatus = 'success';
        watchedState.textError = 'interface.loadSuccess';
        if (!watchedState.feeds.length) {
          refreshFeeds();
        }
        updateFeed(watchedState, feed);
      })
      .catch((error) => {
        watchedState.isError = true;
        watchedState.loadingStatus = 'failed';
        watchedState.textError = error.message;
        watchedState.validation = false;
      });
  }

  form.addEventListener('submit', handleSubmit);

  const posts = document.getElementById('content');
  posts.addEventListener('click', (e) => {
    const readPost = watchedState.readedPosts;
    if (e.target.dataset.readedLink && !readPost.includes(e.target.dataset.readedLink)) {
      watchedState.readedPosts.push(e.target.dataset.readedLink);
    }
    if (e.target.dataset.modalIndex) {
      watchedState.modalIndex = e.target.dataset.modalIndex;
    }
  });

  function handleRender() {
    render(watchedState, i18Instance);
  }
}
