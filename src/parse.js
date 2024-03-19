export default (data) => {
  // try {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('errors.invalidRss');
  } else {
    const titleElement = doc.getElementsByTagName('title')[0];
    const feedTitle = titleElement.textContent;
    const descriptionElem = doc.getElementsByTagName('description')[0];
    const feedDescription = descriptionElem.textContent;
    const items = doc.getElementsByTagName('item');
    const posts = [...items].map((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      return {
        title,
        description,
        link,
      };
    });

    return {
      title: feedTitle,
      description: feedDescription,
      posts: posts || [],
    };
  }
};
