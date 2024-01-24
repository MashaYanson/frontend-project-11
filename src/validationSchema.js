import * as yup from "yup";

const validation = (url, addedLinks, i18Instance ) => {
    const schema = yup.string()
        .trim()
        .url(i18Instance.t('urlInvalid'))
        .required(i18Instance.t('urlRequired'))
        .notOneOf(addedLinks, i18Instance.t('urlExists'))
        .validate(url)
    return schema
}
export default validation