export default (data) => {
  // try {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const error = new Error(errorNode.textContent);
    error.isParsingError = true;
    // throw new Error('errors.invalidRss');
    throw error;
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

// const errorNode = data.querySelector('parsererror');
// if (errorNode) {
//   // Текст ошибки сохраняем для отладки
//   const error = new Error(errorNode.textContent);
//
//   // ошибка парсера помечается в таком же стиле,
//   // как ошибки в axios,
//   // чтобы было удобно их различать в обработчике
//   error.isParsingError = true;
//
//   throw error;
// }
