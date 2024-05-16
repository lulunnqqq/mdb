
import { getInfo, trending } from './sources/hianime.js'
import sqlite3 from 'sqlite3'
const verbose = sqlite3.verbose();
import {open} from 'sqlite'
import { promisify } from 'util';
import {
    createTableAnimeInfo, 
    insertAnime, 
    findAnimeByTitle, 
    updateAnime,
    insertGenres,
    insertInfoProducer,
    insertInfoGenres,
    insertProducer,
    insertTrending,
    findGenresByTitle,
    findProducerByTitle,
    createTableGenres,
    createTableInfoGenres,
    createTableProducer,
    createTableInfoProducer,
    createTableTrending,
    deleteTrendingByType
} from './repository/model.js'

const getTrending = async () => {
    const db = await open({
        filename: process.cwd() + "/db/anime.db",
        driver: verbose.Database
    })

    await db.exec(createTableTrending())

    await trending(async (data) => {

        if (data.trendingDay && data.trendingDay.length > 0) {
            await db.exec(deleteTrendingByType("day"))
        }
        if (data.trendingWeek && data.trendingWeek.length > 0) {
            await db.exec(deleteTrendingByType("week"))
        }
        if (data.trendingMonth && data.trendingMonth.length > 0) {
            await db.exec(deleteTrendingByType("month"))
        }

        for (const index in data.trendingDay) {
            const findTitle = await db.get(findAnimeByTitle(data.trendingDay[index].title));
            let animeID = findTitle ? findTitle.id : 0
            if (!findTitle) {
                animeID = await checkAndInsertAnime(db, "hianime", data.trendingDay[index])
            }

            await db.run(insertTrending(), [
                index+1,
                "day",
                animeID
            ])
        }

        for (const index in data.trendingWeek) {
            const findTitle = await db.get(findAnimeByTitle(data.trendingWeek[index].title));
            let animeID = findTitle ? findTitle.id : 0
            if (!findTitle) {
                animeID = await checkAndInsertAnime(db, "hianime", data.trendingWeek[index])
            }

            await db.run(insertTrending(), [
                index+1,
                "week",
                animeID
            ])
        }

        for (const index in data.trendingMonth) {
            const findTitle = await db.get(findAnimeByTitle(data.trendingMonth[index].title));
            let animeID = findTitle ? findTitle.id : 0
            if (!findTitle) {
                animeID = await checkAndInsertAnime(db, "hianime", data.trendingMonth[index])
            }

            await db.run(insertTrending(), [
                index+1,
                "month",
                animeID
            ])
        }  
    })
}

const getInfoAnime = async () => {

        const db = await open({
            filename: process.cwd() + "/db/anime.db",
            driver: verbose.Database
        })
    
        const source = "hianime";
        await db.exec(createTableAnimeInfo())
        await db.exec(createTableGenres())
        await db.exec(createTableInfoGenres())
        await db.exec(createTableProducer())
        await db.exec(createTableInfoProducer())

        await getInfo(async (data) => {

            await checkAndInsertAnime(db, source, data)
        });   
    
}

const checkAndInsertAnime = async (db, source, data) => {
    const findTitle = await db.get(findAnimeByTitle(data.title));

    if (findTitle) {

        await db.run(updateAnime(), [
            data.title,
            data.poster,
            data.duration,
            data.type,
            data.quality,
            data.total_episode,
            data.desc,
            data.year,
            source,
            data.aired,
            Date.now(),
            findTitle.id,
        ])
        return findTitle.id;
    }
            
        // title, poster, duration, type, quality, total_episode, description, year, source, aired, created_at, updated_at
    const resultInsert = await db.run(insertAnime(), [
        data.title,
        data.poster,
        data.duration,
        data.type,
        data.quality,
        data.total_episode,
        data.desc,
        data.year,
        source,
        data.aired,
        Date.now(),
        Date.now()
    ])
    const animeId = resultInsert.lastID


    for (const item of data.genres) {
        const findGenre = await db.get(findGenresByTitle(item));
        console.log({findGenre})
        if (!findGenre) {
            const respGenres = await db.run(insertGenres(), [item]);
            const genresID = respGenres.lastID;
            await db.run(insertInfoGenres(), [genresID, animeId])
        }
    }

    for (const item of data.producers) {
        const findProducer = await db.get(findProducerByTitle(item));
        if (!findProducer) {
            const respProducer = await db.run(insertProducer(), [item]);
            const producerID = respProducer.lastID;
            await db.run(insertInfoProducer(), [producerID, animeId])
        }
    }

    return animeId;
}

getTrending();