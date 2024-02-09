import parse from "./parse.js";

const getParse= (resp, value, watchedState) => {
    try {
        const feed = parse(resp, value)
        watchedState.feeds = [feed,...watchedState.feeds]
        watchedState.posts = watchedState.feeds.reduce((acc, feed) => {
            return [...acc, ...feed.posts]
        }, []);

        watchedState.validation = true
        watchedState.loadingStatus = 'success'
        watchedState.textError = 'interface.loadSuccess'
        watchedState.isError = false
    } catch (e){
      
        // watchedState.isError = true
        // watchedState.textError = i18Instance.t('errors.invalidRss');
    }
}
export default getParse