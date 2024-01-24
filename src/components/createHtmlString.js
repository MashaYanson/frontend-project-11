import createPost from "./createPost.js";
import createFeed from "./createFeed.js";

const createHtmlString = (state) => {
    return `<div class="row">
                                <div class="col-md-10 col-lg-8 order-1 mx-auto posts">
                                <div class="card border-0" >
                                <div class="card-body">
                                <h2 class="card-title h4">posts</h2>
                                </div>
                                <ul class="list-group border-0 rounded-0">${state.posts.map(createPost).join('')}</ul>
                                </div>
                                
                                </div>
                                <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds">
                                <div class="card border-0" >
                                <div class="card-body">
                                <h2 class="card-title h4">feeds</h2>
                                </div>
                                <ul class="list-group border-0 rounded-0">${state.feeds.map(createFeed).join('')}</ul>
                                </div>
                                </div>
                            </div>`
}
export default createHtmlString