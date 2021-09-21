const express = require( 'express' );
const postController = require( '../controllers/post' );
const router = express.Router();

router.get( '/', postController.getHome );
module.exports = router;