const router = require('express').Router()
const Profile = require('./Profile')
const Repos = require('./Repos')

router.get('/profile', Profile.getProfile)

router.get('/repos', Repos.getRepos)

module.exports = router