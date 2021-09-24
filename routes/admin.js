const path = require( 'path' );
const express = require( 'express' );
const adminController = require( '../controllers/admin' );
const isAdmin = require( '../middleware/is-admin' )
// const isAuth = require( "../middleware/is-auth" )
const router = express.Router();
router.get( '/add-event', isAdmin, adminController.getPostEvent );
router.post( '/add-event', isAdmin, adminController.postPostEvent );
module.exports = router;