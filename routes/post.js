
const path = require( 'path' )
const profilController = require( '../controllers/profil' )
const isAuth = require( '../middleware/is-auth' )
const express = require( 'express' )
const postController = require( '../controllers/resep' )
const { Resepupload } = require( '../util/eventUpload' )
const router = express.Router()
router.get( '/profil', isAuth, profilController.getProfile )
router.get( '/', postController.getHome )
router.get( '/add-resep', isAuth, postController.getAddResep )
//post
router.post( '/add-resep', isAuth, Resepupload.single( 'ImageResep' ), postController.postAddResep )
module.exports = router