const express = require( 'express' )
const commonController = require( '../controllers/common' )
const router = express.Router()
// / update - profil
router.get( '/event/:eventId', commonController.getEvent )
router.get( '/resep/:resepId', commonController.getResep )
router.post( '/like/:eventId', commonController.postLikeEvent )
router.post( '/like/resep/:resepId', commonController.postlikeResep )
router.post( '/dislike/resep/:resepId/:likeId', commonController.deleteLikeResep )
router.post( '/dislike/:eventId/:likeId', commonController.deleteLikeEvent )
router.post( '/comment/resep/:resepId', commonController.postCommentResep )
router.post( '/comment/event/:eventId', commonController.postComment )
router.post( '/delete-comment/:commentId', commonController.deleteComment )

module.exports = router
