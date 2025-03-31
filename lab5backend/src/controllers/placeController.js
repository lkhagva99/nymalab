const Place = require('../models/Place');

// @desc    Get all places
// @route   GET /api/places
// @access  Private
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find()
      .populate('createdBy', 'username')
      .sort('-createdAt');
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
// @access  Private
const getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('createdBy', 'username');

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a place
// @route   POST /api/places
// @access  Private
const createPlace = async (req, res) => {
  try {
    const { name, location, description, imageUrl, website } = req.body;

    if (!name || !location || !description) {
      return res.status(400).json({ message: 'Please provide name, location, and description' });
    }

    const place = await Place.create({
      name,
      location,
      description,
      imageUrl,
      website,
      createdBy: req.user._id,
    });

    res.status(201).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a place
// @route   PUT /api/places/:id
// @access  Private
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user is the creator of the place
    if (place.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'username');

    res.json(updatedPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a place
// @route   DELETE /api/places/:id
// @access  Private
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user is the creator of the place
    if (place.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await place.remove();

    res.json({ message: 'Place removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
}; 