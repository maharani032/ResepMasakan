const path = require( 'path' );
const express = require( 'express' );
const adminController = require( '../controllers/admin' );
const isAdmin = require( '../middleware/is-admin' );
const router = express.Router();
router.get( '/add-event', isAdmin, adminController.getPostEvent );
router.post( '/add-event', isAdmin, adminController.postPostEvent );
router.get( '/edit-event/:eventId', isAdmin, adminController.getEditEvent )
router.post( '/edit-event', isAdmin, adminController.postEditEvent )
router.post( '/delete-event/:eventId', isAdmin, adminController.deleteEvent )
module.exports = router;