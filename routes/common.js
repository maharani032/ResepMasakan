const express = require( 'express' )
const isAuth = require( '../middleware/is-auth' )
const { check, body } = require( 'express-validator' )
const commonController = require( '../controllers/common' )
const router = express.Router()
// / update - profil
router.get( '/events', commonController.getEvents )
router.get( '/about', commonController.getAbout )
router.get( '/event/:eventId', commonController.getEvent )
router.get( '/resep/:resepId', commonController.getResep )
router.get( '/reseps', commonController.getReseps )
router.get( '/reseps/:kategori', commonController.getResepsCategory )

router.post( '/like/:eventId', isAuth, commonController.postLikeEvent )
router.post( '/like/resep/:resepId', isAuth, commonController.postlikeResep )
router.post( '/dislike/resep/:resepId/:likeId', isAuth, commonController.deleteLikeResep )
router.post( '/dislike/:eventId/:likeId', isAuth, commonController.deleteLikeEvent )

router.post( '/comment/resep/:resepId', isAuth, [
    check( 'Komentar', 'komentar tidak boleh kosong' ).not().isEmpty(),
], commonController.postCommentResep )
router.post( '/comment/event/:eventId', isAuth, [ check( 'Komentar', 'komentar tidak boleh kosong' ).not().isEmpty(), ], commonController.postComment )
router.post( '/delete-comment/:commentId', commonController.deleteComment )

module.exports = router
