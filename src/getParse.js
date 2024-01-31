import parse from "./parse.js";

const getParse= (resp, value, watchedState, i18Instance) => {
    try {
        const feed = parse(resp, value)
        watchedState.feeds = [feed,...watchedState.feeds]
        watchedState.posts = watchedState.feeds.reduce((acc, feed) => {
            return [...acc, ...feed.posts]
        }, []);

        watchedState.validation = true
        watchedState.loadingStatus = 'success'
        watchedState.textError = i18Instance.t('interface.loadSuccess')
        watchedState.isError = false
    } catch (e){
        console.log('parse error')
        throw  new Error('errors.invalidRss')
        // watchedState.isError = true
        // watchedState.textError = i18Instance.t('errors.invalidRss');
    }
}
export default getParse