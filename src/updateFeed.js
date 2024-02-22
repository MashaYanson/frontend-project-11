import { uniqueId } from 'lodash';

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
    watchedState.status = 'success';
  } else {
    watchedState.feeds = [makeId(feed), ...watchedState.feeds];
    watchedState.posts = watchedState.feeds.reduce((acc, item) => [...acc, ...item.posts], []);
    watchedState.status = 'success';
  }
};
export default updateFeed;
