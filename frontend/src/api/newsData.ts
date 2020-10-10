import cheerio from "cheerio"
import axios from "axios"

const webScraper = async() => {
    const {data:html} = await axios.get("https://www.google.com/search?q=armenia&oq=armenia&tbm=nws&hl=en")
    const selector = cheerio.load(html)
    const text = selector(".zBAuLc").text()

    return text
}


export default webScraper