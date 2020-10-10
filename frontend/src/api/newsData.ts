

const webScraper = async() => {
    const response = await fetch("http://localhost:4000", {method:"GET"})
    const data = await response.json()
    return data
}


export default webScraper