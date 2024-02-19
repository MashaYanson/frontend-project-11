const updateFeed = (watchedState, feed) => {
  const links = watchedState.feeds.map(({ feedLink }) => feedLink);
  if (links.includes(feed.feedLink)) {
    console.log('refresh placeholder');
  } else {
    watchedState.feeds = [feed, ...watchedState.feeds];
    watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
    // watchedState.validation = true;
    watchedState.status = 'success';
    // watchedState.isError = false;
  }
};
export default updateFeed;
