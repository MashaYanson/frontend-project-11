
const updateFeed = (watchedState, feed) => {
    const links = watchedState.feeds.map(({feedLink})=>feedLink)
   if(links.includes(feed.feedLink)){
       console.log('refresh placeholder')
       //просмотренные посты 
       // новые посты 
       // 

   }
   else {
        watchedState.feeds = [feed,...watchedState.feeds]
        watchedState.posts = watchedState.feeds.reduce((acc, feed) => {
            return [...acc, ...feed.posts]
        }, []);
        watchedState.validation = true
        watchedState.loadingStatus = 'success'
        watchedState.isError = false
    }
   
}
export default updateFeed