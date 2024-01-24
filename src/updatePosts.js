import getResponse from "./getResponse.js";

const updatePosts = (watchedState, time, i18Instance) => {
    
    const stateCopy = {...watchedState}
    const posts = stateCopy.posts
    const feeds = stateCopy.feeds
    
    const updateFeedProm = feeds.map((feed)=>getResponse(feed.feedLink, watchedState, i18Instance))
        
    
}
export default updatePosts