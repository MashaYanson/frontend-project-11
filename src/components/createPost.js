const createPosts = (state, i18Instance) => {
  const { posts } = state;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18Instance.t('interface.posts');

  cardBody.append(h2);
  card.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  card.append(ul);

  posts.forEach((post, i) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    ul.append(li);
    const isReaded = state.viewedPostsIds.includes(post.id) ? 'fw-normal' : 'fw-bold';

    const a = document.createElement('a');
    a.classList.add(isReaded);
    a.dataset.readedLink = post.id;
    a.dataset.id = i;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');

    a.setAttribute('href', post.link);
    a.textContent = post.title;

    li.append(a);

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.modalIndex = i;
    button.dataset.readedLink = post.id;
    button.dataset.id = post.id;
    button.setAttribute('type', 'button');
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18Instance.t('interface.preview');

    li.append(button);
  });

  return card;
};
export default createPosts;
