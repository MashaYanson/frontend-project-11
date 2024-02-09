import axios from "axios";
import parse from "./parse.js";

const getResponse = (link) => {
    const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`
    return axios.get(url, { timeout: 10000 }).then((resp)=>{
       const data = resp.data.contents
       return parse(data, link)
     }).catch((e)=>{
         console.dir(e)
        if(e.code === 'ERR_NETWORK') {
            throw new Error('errors.networkError')
        }else{
            throw new Error(e.message)
        }
    //      watchedState.isError = true
    //      // watchedState.loadingStatus = 'fail'
    //     watchedState.textError = i18Instance.t('errors.networkError')
    });
}
export default getResponse;