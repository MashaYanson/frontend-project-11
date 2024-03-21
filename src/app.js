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
const makeId = (feed) => {
  const feedId = uniqueId();
  return {
    ...feed,
    id: feedId,
    posts: feed.posts.map((post) => ({
      ...post,
      id: uniqueId(),
      feedId,
    })),
  };
};

const addProxy = (feedLink) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.append('disableCache', 'true');
  url.searchParams.append('url', feedLink);
  return url.toString();
};

const refreshFeeds = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => {
    const url = addProxy(feed.feedLink);
    return axios.get(url, { timeout: 10000 })
      .then((resp) => {
        const data = resp.data.contents;
        const { posts } = parse(data);
        const oldPostsLinks = watchedState.posts
          .filter((post) => feed.feedId === post.feedId)
          .map((post) => post.link);
        const newPosts = posts.filter((post) => !oldPostsLinks.includes(post.link));
        const newPostsWithId = newPosts.map((post) => ({ ...post, id: uniqueId() }));
        watchedState.posts = newPostsWithId.concat(watchedState.posts);
      })
      .catch((error) => {
        console.error(error);
      });
  });
  Promise.all(promises)
    .then(() => {
      setTimeout(() => refreshFeeds(watchedState), 5000);
    });
};

const addNewFeed = (link, watchedState) => {
  const url = addProxy(link);
  return axios.get(url, { timeout: 10000 })
    .then((resp) => {
      const data = resp.data.contents;
      const { posts, ...feed } = makeId(parse(data, link));
      const linkedFeed = { ...feed, feedLink: link };
      watchedState.status = 'success';
      watchedState.feeds = [linkedFeed, ...watchedState.feeds];
      watchedState.posts = [...posts, ...watchedState.posts];
    })
    .catch((e) => {
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

    function handleSubmit(event) {
      event.preventDefault();
      watchedState.status = 'filling';
      const urlInput = document.getElementById('inputAddress');
      const urlValue = urlInput.value;
      const links = watchedState.feeds.map(({ feedLink }) => feedLink);
      validation(urlValue, links, i18Instance)
        .then((value) => {
          watchedState.status = 'loading';
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
      }
      if (e.target.dataset.modalIndex) {
        watchedState.modalPostId = e.target.dataset.modalIndex;
        // записываем в стейт айди модалки
      }
    });
    refreshFeeds(watchedState);
  });
}
