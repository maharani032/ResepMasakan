const express = require( 'express' )
const commonController = require( '../controllers/common' )
const router = express.Router()
router.get( '/event/:eventId', commonController.getEvent )
router.post( '/comment/event/:eventId', commonController.postComment )
module.exports = router
