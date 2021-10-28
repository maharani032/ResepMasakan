
const path = require( 'path' )
const { check, body } = require( 'express-validator' )
const profilController = require( '../controllers/profil' )
const isAuth = require( '../middleware/is-auth' )
const express = require( 'express' )
const postController = require( '../controllers/resep' )
const { Resepupload } = require( '../util/eventUpload' )
const { Profilupload } = require( '../util/eventUpload' )
const router = express.Router()
router.get( '/profil', isAuth, profilController.getProfile )
router.get( '/', postController.getHome )
router.get( '/add-resep', isAuth, postController.getAddResep )
router.get( '/edit-resep/:resepId', isAuth, postController.getEditResep )
//post
router.post( '/update-profil', isAuth, Profilupload.single( 'profil-image' ), profilController.postUpdateProfil )
router.post( '/edit-resep/:resepId', isAuth, Resepupload.single( 'ImageResep' ),
    [
        check( 'namaResep', 'isi judul resep' ).not().isEmpty(),
        check( 'deskripsi', 'isi deskripsi' ).not().isEmpty(),
        check( 'selectionOption', 'isi kategory' ).not().isEmpty(),
        check( 'bahan', 'isi bahan Utama' ).not().isEmpty(),
        check( 'ImageResep' ).custom( ( value, { req } ) =>
        {
            if ( req.file.mimetype === 'image/png' ||
                req.file.mimetype === 'image/jpg' ||
                req.file.mimetype === 'image/jpeg' ) {
                return true;
            }
            else {
                return false; // return "falsy" value to indicate invalid data
            }
        } )
            .withMessage( 'isi imageResep' ),
    ],
    postController.postEditResep )
router.post( '/add-resep', isAuth
    , Resepupload.single( 'ImageResep' ),
    [
        check( 'namaResep', 'isi judul resep' ).not().isEmpty(),
        check( 'deskripsi', 'isi deskripsi' ).not().isEmpty(),
        check( 'selectionOption', 'isi kategory' ).not().isEmpty(),
        check( 'bahan', 'isi bahan Utama' ).not().isEmpty(),
        check( 'ImageResep' ).custom( ( value, { req } ) =>
        {
            if ( req.file.mimetype === 'image/png' ||
                req.file.mimetype === 'image/jpg' ||
                req.file.mimetype === 'image/jpeg' ) {
                return true;
            }
            else {
                return false; // return "falsy" value to indicate invalid data
            }
        } )
            .withMessage( 'isi imageResep' ),
    ], postController.postAddResep )
router.post( '/delete-resep/:resepId', isAuth, postController.postDeleteResep )
module.exports = router