const UserRoute = require('./user.route');
const WallRoute = require('./wall.route');

const WallController = require('../controllers/wall.controller');

let APIRoute = (App) => {
    /* Routes to visit the Home page */
    App.use('/', UserRoute);

    /* Routes for users feature or function */
    App.use('/api/users', UserRoute);

    /* Routes for user to logout */
    App.use('/logout', UserRoute);

    /* Routes to visit the Wall page */
    App.use('/wall', (req, res, next) => { new WallController(req, res).wallpage(); });

    /* Routes for wall feature or function */
    App.use('/api/wall', WallRoute)
}

module.exports = APIRoute;