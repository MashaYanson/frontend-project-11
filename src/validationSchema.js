import * as yup from "yup";

const validation = (url, addedLinks) => {
    const schema = yup.string()
        .trim()
        .url()
        .required()
        .notOneOf(addedLinks)
        .validate(url)
    return schema
}
export default validation