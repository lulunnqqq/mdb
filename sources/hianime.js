import axios from "axios";
import cheerio from 'cheerio' 

const DOMAIN = `https://hianime.to`
const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
}

export const getInfo = async (callback) => {
    const url = `${DOMAIN}/filter?sort=recently_updated&page=`
    
    const res = [];

    for (let i = 1; i <= 400; i++) {
        console.log(`======== RUNNING PAGE ${i} ========`)
        const moviesInfo = [];
        const { data } = await axios.get(url + i, { headers })
        const $ = cheerio.load(data)
        $(".flw-item").each((key, item) => {
            const poster = $(item).find(".film-poster-img").attr("data-src");
            const duration = $(item).find(".fdi-duration").text();
            const type = $(item).find(".fdi-item").first().text();
            const title = $(item).find(".dynamic-name").text();
            const id = $(item).find(".film-poster-ahref").attr("data-id");
            const href = $(item).find(".film-poster-ahref").attr("href");
            moviesInfo.push({
                title, duration, type, poster, id, href
            })
            console.log({title, duration, type, poster, id, href})
        })

       

        for (const item of moviesInfo) {
            const { data: detail } = await axios.get(`${DOMAIN}${item.href}`, { headers: headers })
            const loadDetail = cheerio.load(detail);

            const quality = loadDetail(".film-stats .tick-quality").text();
            const totalEpisode = loadDetail(".film-stats .tick .tick-item.tick-sub").text();
            let desc = loadDetail(".item-title.w-hide .text").text();
            desc = desc.replace(/\\n+/ig, "").trim();
            let aired = "";
            let year = 0;
            let genres = [];
            const producers = [];
            loadDetail(".anisc-info .item.item-title").each((key, item) => {
                const t = loadDetail(item).text();
                if (t.toLowerCase().indexOf("aired") != -1) {
                    aired = t.replace(/aired *\:/i, "").trim();
                    aired = aired.replace(/to *.*/i, "").trim();
                }

                const genresType = loadDetail(item).find(".item-head").text();
               
                if (genresType.toLowerCase().indexOf("producers") != -1) {
                    loadDetail(item).find("a").each((key1, item1) => {
                        const gen = loadDetail(item1).text();
                        producers.push(gen)
                    })
                }
            })

            loadDetail(".anisc-info .item.item-list").each((key, item) => {
               

                const genresType = loadDetail(item).find(".item-head").text();
                if (genresType.toLowerCase().indexOf("genres") != -1) {
                    loadDetail(item).find("a").each((key1, item1) => {
                        const gen = loadDetail(item1).text();
                        genres.push(gen.trim())
                    })
                }

            })

            if (aired) {
                year = aired.match(/([0-9]+)$/i)
                year = year ? year[1] : 0
            }

            console.log({quality, totalEpisode, desc, aired, year, genres, producers})

            callback({
                title: item.title, 
                duration: item.duration, 
                type: item.type, 
                poster: item.poster,
                quality,
                total_episode: totalEpisode,
                desc,
                aired,
                year,
                genres,
                producers,
            })
            // res.push({
            //     title: item.title, 
            //     duration: item.duration, 
            //     type: item.type, 
            //     poster: item.poster,
            //     quality,
            //     total_episode: totalEpisode,
            //     desc,
            //     aired,
            //     year,
            //     genres,
            //     producers,
            // })

            
        }
        console.log(`======== DONE PAGE ${i} ========`)
        
    }


    return res;
}

const loadTrending = async (loadDetail, id) => {
    const resp = [];

    const filmsData = [];
    loadDetail(id).each((key, item) => {
        let title = loadDetail(item).find('.film-name a').text();
        let href = loadDetail(item).find(".film-name a").attr("href");
        let poster = loadDetail(item).find(".film-poster img").attr("data-src");

        console.log("TRENDING DATA", {title, href, poster});

        if (title && href) {
            filmsData.push({title, href, poster});
        }
    })

    for (const item of filmsData) {
        const { data: detail } = await axios.get(`${DOMAIN}${item.href}`, { headers: headers })
        const loadDetail = cheerio.load(detail);

        const quality = loadDetail(".film-stats .tick-quality").text();
        const totalEpisode = loadDetail(".film-stats .tick .tick-item.tick-sub").text();
        const type = loadDetail(".film-stats .tick .item").first().text();
        const duration = loadDetail(".film-stats .tick .item").last().text();
        let desc = loadDetail(".item-title.w-hide .text").text();
        desc = desc.replace(/\\n+/i, "").trim();
        let aired = "";
        let year = 0;
        let genres = [];
        const producers = [];
        loadDetail(".anisc-info .item.item-title").each((key, item) => {
            const t = loadDetail(item).text();
            if (t.toLowerCase().indexOf("aired") != -1) {
                aired = t.replace(/aired *\:/i, "").trim();
                aired = aired.replace(/to *.*/i, "").trim();
            }

            const genresType = loadDetail(item).find(".item-head").text();
           
            if (genresType.toLowerCase().indexOf("producers") != -1) {
                loadDetail(item).find("a").each((key1, item1) => {
                    const gen = loadDetail(item1).text();
                    producers.push(gen)
                })
            }
        })

        loadDetail(".anisc-info .item.item-list").each((key, item) => {
           

            const genresType = loadDetail(item).find(".item-head").text();
            if (genresType.toLowerCase().indexOf("genres") != -1) {
                loadDetail(item).find("a").each((key1, item1) => {
                    const gen = loadDetail(item1).text();
                    genres.push(gen.trim())
                })
            }

        })

        if (aired) {
            year = aired.match(/([0-9]+)$/i)
            year = year ? year[1] : 0
        }

        console.log({quality, totalEpisode, desc, aired, year, genres, producers})

        resp.push({
            title: item.title, 
            duration: duration, 
            type: type, 
            poster: item.poster,
            quality,
            total_episode: totalEpisode,
            desc,
            aired,
            year,
            genres,
            producers,
        })

    }

    return resp;
}

export const trending = async (callback) => {
    

    const { data: detail } = await axios.get(`https://hianime.to/tv`, { headers: headers })
    const loadDetail = cheerio.load(detail);

    const trendingDay = await loadTrending(loadDetail, "#top-viewed-day ul li")
    const trendingWeek = await loadTrending(loadDetail, "#top-viewed-week ul li")
    const trendingMonth = await loadTrending(loadDetail, "#top-viewed-month ul li")

    callback({ trendingDay, trendingWeek, trendingMonth })

    return ;
}