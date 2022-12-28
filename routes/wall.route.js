const { Router } = require('express');

const WallController = require('../controllers/wall.controller');

const WallRoute = Router();

/* Route to create a message */
WallRoute.post('/create_message', (req, res, next) => {
    new WallController(req, res).createMessage();
});

/* Route to create a comment */
WallRoute.post('/create_comment', (req, res, next) => {
    new WallController(req, res).createComment();
});

/* Route to delete a message */
WallRoute.post('/delete_message/:message_id', (req, res, next) => {
    new WallController(req, res).deleteMessage();
});

/* Route to delete a comment */
WallRoute.post('/delete_comment/:comment_id', (req, res, next) => {
    new WallController(req, res).deleteComment();
});

module.exports = WallRoute;