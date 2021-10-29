const path = require( 'path' )
const express = require( 'express' )
const { check, body } = require( 'express-validator' )
const adminController = require( '../controllers/admin' )
const bahanController = require( '../controllers/bahan' )
const isAdmin = require( '../middleware/is-admin' )
const { Eventupload, Bahanupload } = require( '../util/eventUpload' )
const router = express.Router()
router.get( '/add-event', isAdmin, adminController.getPostEvent )
router.get( '/edit-event/:eventId', isAdmin, adminController.getEditEvent )
router.get( '/add-product', isAdmin, bahanController.getAddProduct )
router.get( '/edit-bahan/:bahanId', isAdmin, bahanController.EditProduct )
router.post( '/edit-product/:bahanId', isAdmin, Bahanupload.single( 'ImageBahan' ), bahanController.postEditProduct )

router.post( '/add-product', isAdmin, Bahanupload.single( 'ImageBahan' ), bahanController.postAddProduct )
router.post( '/edit-event/:eventId', isAdmin, Eventupload.single( 'ImageEvent' ), [
    check( 'nameEvent', 'isi judul event' ).not().isEmpty(),
    check( 'tempat', 'isi tempat' ).not().isEmpty(),
    check( 'deskripsi', 'isi deskripsi' ).not().isEmpty(),
    check( 'Ondate' ).custom( ( value, { req } ) =>
    {
        let enteredDate = new Date( value )
        let today = new Date()
        if ( enteredDate < today ) {

            return false
        } else {
            return true
        }
    } ).withMessage( 'tanggal kadaluarsa(tanggal acara tidak boleh kurang dari tanggal hari ini' ),
    // check( 'selectionOption', 'isi kategory' ).not().isEmpty(),
    // check( 'ImageEvent' ).custom( ( value, { req } ) =>
    // {
    //     if ( req.file.mimetype === 'image/png' ||
    //         req.file.mimetype === 'image/jpg' ||
    //         req.file.mimetype === 'image/jpeg' ) {
    //         return true;
    //     }
    //     else {
    //         return false; // return "falsy" value to indicate invalid data
    //     }
    // } ).withMessage( 'isi imageResep' ),

    check( 'harga' ).custom( ( value, { req } ) =>
    {
        let category = req.body.Category;
        if ( category == 'bayar' ) {
            if ( value <= 0 ) {
                return false
            }
            else {
                return true;
            }
        } else if ( category == 'free' ) {
            return true
        }
    } ).withMessage( 'Harga tidak boleh kurang dari sama dengan 0' ),
    check( 'Kapasitas', 'isi kapasitas' ).not().isEmpty(),
], adminController.postEditEvent )
router.post( '/add-event', isAdmin, Eventupload.single( 'ImageEvent' ), [
    check( 'nameEvent', 'isi judul event' ).not().isEmpty(),
    check( 'tempat', 'isi tempat' ).not().isEmpty(),
    check( 'deskripsi', 'isi deskripsi' ).not().isEmpty(),
    check( 'Ondate' ).custom( ( value, { req } ) =>
    {
        let enteredDate = new Date( value )
        let today = new Date()
        if ( enteredDate < today ) {

            return false
        } else {
            return true
        }
    } ).withMessage( 'tanggal kadaluarsa(tanggal acara tidak boleh kurang dari tanggal hari ini' ),
    // check( 'selectionOption', 'isi kategory' ).not().isEmpty(),
    check( 'ImageEvent' ).custom( ( value, { req } ) =>
    {
        if ( req.file.mimetype === 'image/png' ||
            req.file.mimetype === 'image/jpg' ||
            req.file.mimetype === 'image/jpeg' ) {
            return true;
        }
        else {
            return false; // return "falsy" value to indicate invalid data
        }
    } ).withMessage( 'isi imageResep' ),

    check( 'harga' ).custom( ( value, { req } ) =>
    {
        let category = req.body.Category;
        if ( category == 'bayar' ) {
            if ( value <= 0 ) {
                return false
            }
            else {
                return true;
            }
        } else if ( category == 'free' ) {
            return true
        }
    } ).withMessage( 'Harga tidak boleh kurang dari sama dengan 0' ),
    check( 'Kapasitas', 'isi kapasitas' ).not().isEmpty(),
], adminController.postPostEvent )
router.post( '/delete-bahan/:bahanId', isAdmin, bahanController.DeleteProduct )
router.post( '/delete-event/:eventId', isAdmin, adminController.deleteEvent )
module.exports = router