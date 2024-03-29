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
          .filter((post) => feed.id === post.feedId)
          .map((post) => post.link);
        const newPosts = posts.filter((post) => !oldPostsLinks.includes(post.link));
        // eslint-disable-next-line max-len
        const newPostsWithId = newPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
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
  axios.get(url, { timeout: 10000 })
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
      if (e.isAxiosError) {
        watchedState.error = 'errors.networkError';
      } else if (e.isParsingError) {
        watchedState.error = 'errors.invalidRss';
      } else {
        watchedState.error = 'errors.unknownError';
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
    modalPost: null,
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

    const elements = {
      form: document.querySelector('form'),
      urlInput: document.getElementById('inputAddress'),
      posts: document.getElementById('content'),
      submitButton: document.getElementById('submitbtn'),
      postEl: document.getElementById('posts-container'),
      feedsEl: document.getElementById('feeds'),
      feedbackMessageEl: document.querySelector('.feedback'),
      modalTitle: document.querySelector('.modal-title'),
      modalDescription: document.querySelector('.modal-body'),
      modalLink: document.querySelector('.full-article'),
    };

    // eslint-disable-next-line max-len
    const watchedState = onChange(state, (path) => render(watchedState, i18Instance, path, elements));
    // const form = document.getElementById('urlform');

    function handleSubmit(event) {
      event.preventDefault();
      watchedState.status = 'filling';
      const formData = new FormData(event.target);
      const urlValue = formData.get('url');
      const links = watchedState.feeds.map(({ feedLink }) => feedLink);
      validation(urlValue, links)
        .then((value) => {
          watchedState.status = 'loading';
          addNewFeed(value, watchedState);
        })
        .catch((error) => {
          watchedState.status = 'failed';
          watchedState.error = error.message;
        });
    }

    elements.form.addEventListener('submit', handleSubmit);

    elements.posts.addEventListener('click', (e) => {
      const idClick = e.target.dataset.id;
      if (idClick) {
        const selectPost = watchedState.posts.find((post) => idClick === post.id);
        if (selectPost) {
          watchedState.modalPost = selectPost;
          watchedState.viewedPostsIds.push(selectPost.id);
        }
      }
    });
    refreshFeeds(watchedState);
  });
}
