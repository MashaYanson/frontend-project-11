export default (res) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(res, "application/xml");
    // const channel = doc.querySelector('channel');
    // const titleChannel = doc.querySelector('channel title').textContent;
    const titleElement = doc.getElementsByTagName("title")[0];
    const titleValue = titleElement.textContent;
   
    const descriptionElem = doc.getElementsByTagName('description')[0];
    const descriptionValue = descriptionElem.textContent
 
  
    
   const items = doc.getElementsByTagName('item');
    console.log(items)
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

    const feed = {
        titleValue,
        descriptionValue,
        posts
    }
    
    console.log(feed)
  

    return feed
    // {
    //     title: titleValue,
    //     author: authorName,
    //   
    // };
}