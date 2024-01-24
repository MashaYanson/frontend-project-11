import axios from "axios";
import getParse from "./getParse.js";

const getResponse = (link,watchedState) => {
    const url = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`
    watchedState.loadingStatus = 'loading'
    return axios.get(url, { timeout: 10000 }).then((resp)=>{
        getParse(resp, link, watchedState)
    }).catch(()=>{
        watchedState.textError = 'ошибка загрузки'
    });
}
export default getResponse;