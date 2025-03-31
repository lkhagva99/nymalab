const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
} = require('../controllers/placeController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getPlaces)
  .post(protect, createPlace);

router.route('/:id')
  .get(protect, getPlace)
  .put(protect, updatePlace)
  .delete(protect, deletePlace);

module.exports = router; 