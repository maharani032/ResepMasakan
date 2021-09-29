
const path = require( 'path' )
const profilController = require( '../controllers/profil' )
const isAuth = require( '../middleware/is-auth' )
const express = require( 'express' )
const postController = require( '../controllers/resep' )
const router = express.Router()
router.get( '/profil', isAuth, profilController.getProfile )
router.get( '/', postController.getHome )
module.exports = router