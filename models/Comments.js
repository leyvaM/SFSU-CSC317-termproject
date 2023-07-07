var db = require("../config/database");
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = `INSERT INTO comments (comment, fk_postId, fk_authorId, created) VALUES
    (?,?,?,now());`
    return db.query(baseSQL, [comment, postId, userId])
    .then(([results, fields]) => {
        if(results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        }else {
            return Promise.resolve(-1);
        }
    })
    .catch((error) => Promise.reject(error));
};

CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = `SELECT u.username, c.comment, c.created, c.id
    FROM comments c
    JOIN users u
    on u.id = c.fk_authorId
    WHERE c.fk_postId=?
    ORDER BY c.created DESC`;
    return db.query(baseSQL, [postId])
    .then(([results,fields]) => {
        return Promise.resolve(results);
    })
    .catch((error) => Promise.reject(error));
};

module.exports = CommentModel;