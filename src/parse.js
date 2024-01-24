import {uniqueId} from "lodash";

export default (res) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(res.data.contents, "application/xml");
    const titleElement = doc.getElementsByTagName("title")[0];
    const linkElement = doc.getElementsByTagName("link")[0];
    const title = titleElement.textContent;
    const descriptionElem = doc.getElementsByTagName('description')[0];
    const description = descriptionElem.textContent
    const items = doc.getElementsByTagName('item');
    const posts = [...items].map((item)=>{
        const title = item.querySelector('title').textContent
        const description = item.querySelector('description').textContent
        const link = item.querySelector('link').textContent
        return {
            title,
            description,
            link,
        }
    })
    
   
    const feedTitle = title;
    const feedDescription = description;
    const feedId = uniqueId();
    const feedLink = linkElement.textContent;
    return {
        title:feedTitle,
        description:feedDescription,
        feedId,
        feedLink,
        posts: posts || []
    };

}