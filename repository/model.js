/**
 * =================== CREATE TABLE ===================
 */

export const createTableAnimeInfo = () => {
    return `
    CREATE TABLE IF NOT EXISTS animes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL UNIQUE,
        poster TEXT,
        duration TEXT,
        type TEXT,
        quality TEXT,
        total_episode INTEGER,
        description TEXT,
        year TEXT,
        source TEXT,
        aired TEXT,
        created_at INTEGER,
        updated_at INTEGER
      );
    `
}




export const createTableGenres = () => {
    return `
    CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `
}

export const createTableInfoGenres = () => {
    return `
    CREATE TABLE IF NOT EXISTS genres_anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        genres_id INTEGER,
        anime_id INTEGER
      );
    `
}

export const createTableProducer = () => {
    return `
    CREATE TABLE IF NOT EXISTS producers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `
}

export const createTableInfoProducer = () => {
    return `
    CREATE TABLE IF NOT EXISTS producer_anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        producer_id INTEGER,
        anime_id INTEGER
      );
    `
}


export const createTableTrending = () => {
    return `
    CREATE TABLE IF NOT EXISTS trending (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        top INTEGER,
        type TEXT,
        anime_id INTEGER
      );
    `
}

/**
 * =================== INSERT DATA ===================
 */

/**
 * 
 * @param {title TEXT NOT NULL UNIQUE,
        poster TEXT,
        duration TEXT,
        type TEXT,
        quality TEXT,
        total_episode INTEGER,
        description TEXT,
        year TEXT,
        source TEXT,
        aired TEXT,
        created_at INTEGER,
        updated_at INTEGER,} param0 
 */
export const insertAnime = () => {
    return `
    INSERT INTO animes (title, poster, duration, type, quality, total_episode, description, year, source, aired, created_at, updated_at) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )
    `
}

export const insertGenres = () => {
    return `
    INSERT INTO genres (name) VALUES (
        ?
    )
    `
}

export const insertProducer = () => {
    return `
    INSERT INTO producers (name) VALUES (
        ?
    )
    `
}

export const insertInfoGenres = () => {
    return `
    INSERT INTO genres_anime (genres_id, anime_id) VALUES (
        ?,
        ?
    )
    `
}

export const insertInfoProducer = () => {
    return `
    INSERT INTO producer_anime (producer_id, anime_id) VALUES (
        ?,
        ?
    )
    `
}

export const insertTrending = () => {
    return `
    INSERT INTO trending (top, type, anime_id) VALUES (
        ?,
        ?,
        ?
    )
    `
}


/**
 * =================== UPDATE DATA ===================
 */
export const updateAnime = () => {
    return `
    UPDATE animes SET
        title = ?,
        poster = ?,
        duration = ?,
        type = ?,
        quality = ?,
        total_episode = ?,
        description = ?,
        year = ?,
        source = ?,
        aired = ?,
        updated_at = ?
    WHERE id = ?
    `
}


/**
 * =================== DELETE DATA ===================
 */

export const deleteTrendingByType = (type) => {
    return `
    DELETE FROM trending WHERE type = "${type}"
    `
}

/**
 * =================== SELECT DATA ===================
 */

export const findAnimeByTitle = (title) => {
    return `
    SELECT * FROM animes WHERE title = "${title}"
    `
}

export const findGenresByTitle = (title) => {
    return `
    SELECT * FROM genres WHERE name = "${title}"
    `
}

export const findProducerByTitle = (title) => {
    return `
    SELECT * FROM producers WHERE name = "${title}"
    `
}
