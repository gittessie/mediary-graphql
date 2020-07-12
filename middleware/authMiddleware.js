const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ') || !authHeader.length > 7){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let validToken;
    try{
        validToken = jwt.verify(token, 'TODO_CHANGE_THIS_TO_LONG_SECRET_KEY');
    }catch(e){
        console.log(e);
        throw e;
    }
    if(!validToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userID = validToken.userID;
    return next();
}