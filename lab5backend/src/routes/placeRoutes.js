const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  getPlacesByUser,
} = require('../controllers/placeController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getPlaces)
  .post(protect, createPlace);

router.route('/:id')
  .get(getPlace)
  .put(protect, updatePlace)
  .delete(protect, deletePlace);

router.route('/:id/places')
  .get(getPlacesByUser);


module.exports = router; 