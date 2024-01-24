import axios from "axios";
import getParse from "./getParse.js";

const getResponse = (link, watchedState, i18Instance) => {
    const url = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`
    watchedState.loadingStatus = 'loading'
    return axios.get(url, { timeout: 10000 }).then((resp)=>{
        getParse(resp, link, watchedState, i18Instance )
    }).catch(()=>{
        watchedState.isError = true
        watchedState.loadingStatus = 'fail'
        watchedState.textError = i18Instance.t('errors.networkError')
    });
}
export default getResponse;