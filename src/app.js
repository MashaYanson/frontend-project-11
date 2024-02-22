import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import render from './render.js';
import translationRU from './locales/ru.js';
import translationENG from './locales/eng.js';
import getResponse from './getResponse.js';
import validation from './validationSchema.js';
import updateFeed from './updateFeed.js';

export default function App() {
  const state = {
    feeds: [],
    posts: [],
    viewedPostsIds: [],
    status: 'filling',
    error: '',
    modalPostId: null,
  };

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
    // eslint-disable-next-line no-use-before-define
    const watchedState = onChange(state, (path) => render(watchedState, i18Instance, path));
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
          watchedState.status = 'loading';
          return getResponse(value, watchedState, i18Instance);
        })
        .then((feed) => {
          watchedState.status = 'success';
          watchedState.error = 'interface.loadSuccess';
          if (!watchedState.feeds.length) {
            refreshFeeds();
          }
          updateFeed(watchedState, feed);
        })
        .catch((error) => {
          watchedState.status = 'failed';
          watchedState.error = error.message;
        });
    }

    form.addEventListener('submit', handleSubmit);

    const posts = document.getElementById('content');
    posts.addEventListener('click', (e) => {
      const readPost = watchedState.viewedPostsIds;
      if (e.target.dataset.readedLink && !readPost.includes(e.target.dataset.readedLink)) {
        watchedState.viewedPostsIds.push(e.target.dataset.readedLink);
        // записываем в стейт как прочитанный
        console.log(e.target.dataset);
      }
      if (e.target.dataset.modalIndex) {
        watchedState.modalPostId = e.target.dataset.modalIndex;
        // записываем в стейт айди модалки
        console.log(watchedState.modalPostId);
        console.log(e.target.dataset);
      }
    });
  });
}
// {
//   dataSet : {
//   }<div id='aaa' data-readed-link="12445"
// }
