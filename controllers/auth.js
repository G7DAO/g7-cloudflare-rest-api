const Web3Token = require('web3-token');
const models = require('../models');
const jwt = require('jsonwebtoken');
const _c = require('../constants');

const db = models._user
const utility = models._utility

exports.userAuth = async (req, res) => {
  try {
    const _body = await req.body()

    if (typeof(_body) === "object" && utility.isEmpty(_body) === false) {
      const { signed_msg } = _body;
      const { address, body } = await Web3Token.verify(signed_msg);

      const data = await db.createUser(address)
      if (typeof(data) === "object" && utility.isEmpty(data) === false) {
        if (data["code"] === 200 || data["code"] === 201) {
          return res.send({
            status: 1,
            message: _c.GENERAL_SUCCESS_MESSAGE,
            data,
          }, data["code"], _c.GENERAL_SUCCESS_MESSAGE, _c.GENERAL_SUCCESS_MESSAGE)
        }
      }
    }

    return res.send({
      status: 0,
      message: _c.CREATE_ERROR_MESSAGE,
      data:null,
    }, _c.GENERAL_ERROR_CODE, _c.CREATE_ERROR_MESSAGE)

  } catch {
    return res.send({
      status: 0,
      message: _c.INTERNAL_SERVER_ERROR_MESSAGE,
      data:null,
    }, _c.INTERNAL_SERVER_ERROR_CODE, _c.INTERNAL_SERVER_ERROR_MESSAGE)
  }
}

exports.appAuth = async (req, res) => {
  try {
    const _body = await req.body()
    const _db = _c.USER_DATA

    if (typeof(_body) === "object" && utility.isEmpty(_body) === false) {
      const { username, password, key } = _body;
      let isValid = false;

      // loop through our Fake Data
      for(let i=0; i < _db.length; i++){
          // If username and password are correct
          if(_db[i].username === username &&
              _db[i].password === password &&
              _db[i].key === key
          ) {
              // If both are correct
              isValid = true;
              break;
          }
      }

      if(isValid) {
        // substitute full _db record for simply username as needed
        const token = jwt.sign({ username }, CF_TOKEN_SECRET);
        return res.send({
          status: 0,
          message: _c.GENERAL_SUCCESS_MESSAGE,
          data: {
            token,
          },
        }, _c.GENERAL_SUCCESS_CODE, _c.GENERAL_SUCCESS_MESSAGE)
      }
    }

    return res.send({
      status: 0,
      message: _c.AUTH_ERROR_MESSAGE,
      data:null,
    }, _c.AUTH_ERROR_CODE, _c.AUTH_ERROR_MESSAGE)

  } catch {
    return res.send({
      status: 0,
      message: _c.INTERNAL_SERVER_ERROR_MESSAGE,
      data:null,
    }, _c.INTERNAL_SERVER_ERROR_CODE, _c.INTERNAL_SERVER_ERROR_MESSAGE)
  }
}