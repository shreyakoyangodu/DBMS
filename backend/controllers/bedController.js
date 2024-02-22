const Bed = require('../models/Bed');

// Controller function to fetch all beds
exports.getAllBeds = async (req, res) => {
    try {
        const beds = await Bed.find();
        res.json(beds);
    } catch (error) {
        console.error('Error fetching beds:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to fetch bed by ID
exports.getBedById = async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);
        if (!bed) {
            return res.status(404).send('Bed not found');
        }
        res.json(bed);
    } catch (error) {
        console.error('Error fetching bed:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to update bed
exports.updateBed = async (req, res) => {
    try {
        const { number, type, availability } = req.body;
        const updatedBed = await Bed.findByIdAndUpdate(req.params.id, 
            { number, type, availability }, { new: true });
        if (!updatedBed) {
            return res.status(404).send('Bed not found');
        }
        res.json(updatedBed);
    } catch (error) {
        console.error('Error updating bed:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to delete bed
exports.deleteBed = async (req, res) => {
    try {
        const deletedBed = await Bed.findByIdAndDelete(req.params.id);
        if (!deletedBed) {
            return res.status(404).send('Bed not found');
        }
        res.json(deletedBed);
    } catch (error) {
        console.error('Error deleting bed:', error);
        res.status(500).send('Internal Server Error');
    }
};
