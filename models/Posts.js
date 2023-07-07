var db = require("../config/database");
const PostModel = {};

PostModel.create = (title, description, photoPath, thumbnail, fk_userId) => {
    let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userId) VALUE (?,?,?,?, now(), ?);;';
    return db.execute(baseSQL,[title, description, photoPath, thumbnail, fk_userId])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((error) => Promise.reject(error));
};

PostModel.search = (searchTerm) => {
    let baseSQL = "SELECT id, title, description, thumbnail,\
    concat_ws(' ', title, description) AS haystack\
    FROM posts\
    HAVING haystack like ?;";
    let sqlReadySearchTerm = "%" + searchTerm + "%";
    return db.execute(baseSQL, [sqlReadySearchTerm])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((error) => Promise.reject(error));
};

PostModel.getRecentPosts = (numberOfPosts) => {
    let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT ?';
    return db.query(baseSQL,[numberOfPosts])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((error) => Promise.reject(error));
};

PostModel.getPostById = (postId) => {
    let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
    FROM users u \
    JOIN posts p \
    ON u.id=fk_userId \
    WHERE p.id=?;";

    return db
    .execute(baseSQL,[postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((error) => Promise.reject(error));
};

module.exports = PostModel;