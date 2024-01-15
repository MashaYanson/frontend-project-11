export default (res) => {
    console.log('init parser')
    console.log(res)
    const parser = new DOMParser()
    const doc = parser.parseFromString(res.data.contents, "application/xml");
    console.log('parsed doc')
    console.log(doc)
    // const channel = doc.querySelector('channel');
    // const titleChannel = doc.querySelector('channel title').textContent;
    const titleElement = doc.getElementsByTagName("title")[0];
    console.log('element!')
    console.log(titleElement)
    const title = titleElement.textContent;
    const descriptionElem = doc.getElementsByTagName('description')[0];
    const description = descriptionElem.textContent
    console.log('readed feed title and desc')
   const items = doc.getElementsByTagName('item');
    console.log('start reading items')
    console.log(items)
    const posts = [...items].map((item,i)=>{
        const title = item.querySelector('title').textContent
        const description = item.querySelector('description').textContent
        const link = item.querySelector('link').textContent
        if(i === 0){
            console.log('reading post');
            // console.log(item);
            console.log({title,description,link})
        } 
        return {
            title,
            description,
            link,
        }
    })
    const feed = {
        title,
        description,
    }
    // console.log('creating feed')
    // console.log(feed)
    // console.log('creating posts')
    // console.log(posts)
  
 
    return {feed, posts}
    // {
    //     title: titleValue,
    //     author: authorName,
    //   
    // };
}