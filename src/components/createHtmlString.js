import createPost from "./createPost.js";
import createFeed from "./createFeed.js";
import {i18Instance} from "../app.js";
import createModal from "./createModal.js";

const makePostContainer = (state) => {
    if (state.posts.length > 0){
        return `<div class="card border-0">
        <div class="card-body">
            <h2 class="card-title h4">${i18Instance.t('interface.posts')}</h2>
        </div>
        <ul class="list-group border-0 rounded-0">${state.posts.map((item, i) => createPost(item, i, state.readedPosts)).join('')}</ul>
    </div>`
    }
   return ''
}

const makeFeedContainer = (state) => {
    if (state.feeds.length > 0){
        return `<div class="card border-0" >
                  <div class="card-body">
                       <h2 class="card-title h4">${i18Instance.t('interface.feeds')}</h2>
                  </div>
                    <ul class="list-group border-0 rounded-0">${state.feeds.map(createFeed).join('')}</ul>
                  </div>`
    }
    return ''
}


const createHtmlString = (state) => {
    return `<div class="row">
                                <div class="col-md-10 col-lg-8 order-1 mx-auto posts" id="posts-container">
                               ${makePostContainer(state)}
                                </div>
                                <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds">
                                ${makeFeedContainer(state)}
                                </div>
                            </div></div>`
}
export default createHtmlString