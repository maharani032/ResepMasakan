const path = require( 'path' )
const express = require( 'express' )
const isAdmin = require( '../middleware/is-admin' )
const shopController = require( '../controllers/shop' )
const isAuth = require( '../middleware/is-auth' )
const router = express.Router()
router.get( '/cart', isAuth, shopController.getCart )
router.post( '/cart-delete-item', isAuth, shopController.postDeleteItemCart )
router.post( '/add-cart', isAuth, shopController.postAddCart )
module.exports = router