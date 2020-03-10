module.exports = function auth() { //later you can define user levels here
    return function authorization(req, res, next) {
        try { //TODO ==> FIX
            if (!req.headers.authorization) {
                return res.status(401).json({ message: 'Not Authorized, Include your player_id' });
            }
            req.user = { _id: req.headers.authorization };
            next(null, req, res, next);
        } catch (error) {
            next(error);
        }
    };
};