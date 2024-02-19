export default (data, feedLink) => {
  // try {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('errors.invalidRss');
  } else {
    const titleElement = doc.getElementsByTagName('title')[0];
    const title = titleElement.textContent;
    const descriptionElem = doc.getElementsByTagName('description')[0];
    const description = descriptionElem.textContent;
    const items = doc.getElementsByTagName('item');
    const posts = [...items].map((item) => {
      // eslint-disable-next-line no-shadow
      const title = item.querySelector('title').textContent;
      // eslint-disable-next-line no-shadow
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      return {
        title,
        description,
        link,
      };
    });

    const feedTitle = title;
    const feedDescription = description;

    return {
      title: feedTitle,
      description: feedDescription,
      feedLink,
      posts: posts || [],
    };
  }
};
