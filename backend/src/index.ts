import cheerio from "cheerio"
import axios from "axios"
import express from "express"
import cors from "cors"

const getNews = async() => {
    const {data:html} = await axios.get("https://news.google.com/search?q=covid-19+armenia+when:2d&hl=en-US&gl=US&ceid=US:en")
    const selector = cheerio.load(html)
    // const text = selector(".zBAuLc").text()
    const allResult:any[] = []
   selector("main.HKt8rc").find("article.MQsxIb").each(function(_, el){
       const link = `https://news.google.com${selector(el).find("a").attr("href")}`
       const title = selector(el).find("h3").text()
       const source = selector(el).find("a.wEwyrc").text()
       const date = selector(el).find("time").text()
       allResult.push({link, title, source, date})
    })
    const result = allResult.slice(0, 10)
    return result
}


const app = express()

app.use(cors({origin: "http://localhost:3000"}))

getNews();

app.get("/", async(_, res)=>{
    const news = await getNews()
    res.send(JSON.stringify(news, null, 0))})

app.listen(4000, ()=> console.log("✅ Express Server listening."))