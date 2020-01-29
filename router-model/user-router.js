const express = require('express');
const bcrypt = require('bcryptjs')
const UserDB = require('./user-model.js');
const restrict = require('../middleware/restrict')
const jwt = require('jsonwebtoken')
const router = express.Router();

function makeToken(user) {
  
      const payload = {
        sub: user.id,
        username: user.username,
      }
  
      const options = {
        expiresIn: '1d',
      }
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'thesecret',
        options,
      )
      return token
  }

router.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    const bcryptHash = bcrypt.hashSync(password, 10);

    const user = {
      username,
      password: bcryptHash,
    };
  
    UserDB.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    UserDB.findBy({ username })
      .first()
      .then(user => {    
        if (user && bcrypt.compareSync(password, user.password)) {

            const token = makeToken(user)

          res.status(200).json({ message: `Welcome ${user.username}!`, token: token });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' })
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
});

router.get('/', restrict, (req, res) => {

    UserDB.getUsers()
      .then(users => {
        res.status(200).json(users)
      })
      .catch(error => {
        res.status(500).json(error)
      })
})

module.exports = router;