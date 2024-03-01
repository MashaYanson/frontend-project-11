import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import render from './render.js';
import translationRU from './locales/ru.js';
import translationENG from './locales/eng.js';
import parse from './parse.js';

const validation = (url, addedLinks) => yup.string()
  .trim()
  .url()
  .required()
  .notOneOf(addedLinks)
  .validate(url);
const makeId = (feed) => ({
  ...feed,
  id: uniqueId(),
  posts: feed.posts.map((post) => ({
    ...post,
    id: uniqueId(),
  })),
});

const addNewFeed = (link, watchedState) => {
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
  return axios.get(url, { timeout: 10000 })
    .then((resp) => {
      const data = resp.data.contents;
      const feed = parse(data, link);
      watchedState.status = 'success';
      watchedState.feeds = [makeId(feed), ...watchedState.feeds];
      watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
    }).catch((e) => {
      watchedState.status = 'failed';
      if (e.code === 'ERR_NETWORK') {
        watchedState.error = 'errors.networkError';
      } else {
        watchedState.error = e.message;
      }
    });
};

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
      if (watchedState.feeds.length > 0) {
        console.log('refresh');
        // eslint-disable-next-line max-len
        const promises = watchedState.feeds.map((feed) => {
          const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.feedLink)}`;
          return axios.get(url, { timeout: 10000 })
            .then((resp) => {
              const data = resp.data.contents;
              return parse(data, feed.feedLink);
            }).catch((e) => {
              console.error(e.message);
            });
        });
        Promise.all(promises).then((responses) => {
          responses.forEach((feed) => {
            // eslint-disable-next-line max-len
            const oldFeedIndex = watchedState.feeds.findIndex((item) => item.feedLink === feed.feedLink);
            const oldFeed = watchedState.feeds[oldFeedIndex];
            const oldPostsLinks = oldFeed.posts.map((post) => post.link);
            const newPosts = feed.posts.filter((post) => !oldPostsLinks.includes(post.link));
            const oldPosts = feed.posts.filter((post) => oldPostsLinks.includes(post.link));
            const newPostsWithId = newPosts.map((post) => ({ ...post, id: uniqueId() }));
            const updatedPosts = [...newPostsWithId, ...oldPosts];
            watchedState.feeds[oldFeedIndex] = { ...feed, id: oldFeed.id, posts: updatedPosts };
            // eslint-disable-next-line max-len
            watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
          });
        });
      }

      setTimeout(refreshFeeds, 5000);
    }

    function handleSubmit(event) {
      event.preventDefault();
      watchedState.status = 'filling';
      const urlInput = document.getElementById('inputAddress');
      const urlValue = urlInput.value;
      const links = watchedState.feeds.map(({ feedLink }) => feedLink);
      validation(urlValue, links, i18Instance)
        .then((value) => {
          watchedState.status = 'loading';
          console.log(watchedState);
          addNewFeed(value, watchedState);
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
    refreshFeeds();
  });
}
