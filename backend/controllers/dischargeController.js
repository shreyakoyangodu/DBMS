const Discharge = require('../models/Discharge');

// Controller function to handle patient discharge
exports.dischargePatient = async (req, res) => {
    try {
        const { admissionId, dischargeDate } = req.body;
        const newDischarge = new Discharge({ admissionId, dischargeDate });
        await newDischarge.save();
        res.status(201).json(newDischarge);
    } catch (error) {
        console.error('Error discharging patient:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to fetch all discharges
exports.getAllDischarges = async (req, res) => {
    try {
        const discharges = await Discharge.find();
        res.json(discharges);
    } catch (error) {
        console.error('Error fetching discharges:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to fetch discharge by ID
exports.getDischargeById = async (req, res) => {
    try {
        const discharge = await Discharge.findById(req.params.id);
        if (!discharge) {
            return res.status(404).send('Discharge not found');
        }
        res.json(discharge);
    } catch (error) {
        console.error('Error fetching discharge:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to update discharge
exports.updateDischarge = async (req, res) => {
    try {
        const { admissionId, dischargeDate } = req.body;
        const updatedDischarge = await Discharge.findByIdAndUpdate(req.params.id, 
            { admissionId, dischargeDate }, { new: true });
        if (!updatedDischarge) {
            return res.status(404).send('Discharge not found');
        }
        res.json(updatedDischarge);
    } catch (error) {
        console.error('Error updating discharge:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to delete discharge
exports.deleteDischarge = async (req, res) => {
    try {
        const deletedDischarge = await Discharge.findByIdAndDelete(req.params.id);
        if (!deletedDischarge) {
            return res.status(404).send('Discharge not found');
        }
        res.json(deletedDischarge);
    } catch (error) {
        console.error('Error deleting discharge:', error);
        res.status(500).send('Internal Server Error');
    }
};
