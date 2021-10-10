const path = require( 'path' )
const express = require( 'express' )
const isAdmin = require( '../middleware/is-admin' )
const shopController = require( '../controllers/shop' )
const isAuth = require( '../middleware/is-auth' )
const router = express.Router()
router.post( '/add-cart', isAuth, shopController.postAddCart )
module.exports = router