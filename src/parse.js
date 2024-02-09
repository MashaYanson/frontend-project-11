import {uniqueId} from "lodash";

export default (data, feedLink) => {
    try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(data, "application/xml");
        const titleElement = doc.getElementsByTagName("title")[0];
        // const linkElement = doc.getElementsByTagName("link")[0];
        const title = titleElement.textContent;
        const descriptionElem = doc.getElementsByTagName('description')[0];
        const description = descriptionElem.textContent
        const items = doc.getElementsByTagName('item');
        const posts = [...items].map((item)=>{
            const title = item.querySelector('title').textContent
            const description = item.querySelector('description').textContent
            const link = item.querySelector('link').textContent
            const postId = uniqueId();
            return {
                title,
                description,
                link,
                postId
            }
        })


        const feedTitle = title;
        const feedDescription = description;
        const feedId = uniqueId();
        return {
            title:feedTitle,
            description:feedDescription,
            feedId,
            feedLink,
            posts: posts || []
        }; 
    }
    catch(e){
        throw new Error('errors.invalidRss')
    }
   

}