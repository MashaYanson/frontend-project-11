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

const getResponse = (link) => {
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
  return axios.get(url, { timeout: 10000 }).then((resp) => {
    const data = resp.data.contents;
    return parse(data, link);
  }).catch((e) => {
    if (e.code === 'ERR_NETWORK') {
      throw new Error('errors.networkError');
    } else {
      throw new Error(e.message);
    }
  });
};
const makeId = (feed) => ({
  ...feed,
  id: uniqueId(),
  posts: feed.posts.map((post) => ({
    ...post,
    id: uniqueId(),
  })),
});

const updateFeed = (watchedState, feed) => {
  const links = watchedState.feeds.map(({ feedLink }) => feedLink);
  if (links.includes(feed.feedLink)) {
    const oldFeedIndex = watchedState.feeds.findIndex((item) => item.feedLink === feed.feedLink);
    const oldFeed = watchedState.feeds[oldFeedIndex];
    const oldPostsLinks = oldFeed.posts.map((post) => post.link);
    const newPosts = feed.posts.filter((post) => !oldPostsLinks.includes(post.link));
    const oldPosts = feed.posts.filter((post) => oldPostsLinks.includes(post.link));
    const newPostsWithId = newPosts.map((post) => ({ ...post, id: uniqueId() }));
    const updatedPosts = [...newPostsWithId, ...oldPosts];
    watchedState.feeds[oldFeedIndex] = { ...feed, id: oldFeed.id, posts: updatedPosts };
    watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
  } else {
    watchedState.feeds = [makeId(feed), ...watchedState.feeds];
    watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
  }
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
          console.log(watchedState);
          return getResponse(value, watchedState, i18Instance);
        })
        .then((feed) => {
          watchedState.status = 'success';

          if (!watchedState.feeds.length) {
            refreshFeeds();
          }
          updateFeed(watchedState, feed);
        })
        .catch((error) => {
          watchedState.status = 'failed';
          watchedState.error = error.message;
        })
        .finally(() => {
          watchedState.status = 'filling';
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
