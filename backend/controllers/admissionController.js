const Admission = require('../models/Admission');

// Controller function to handle patient admission
exports.admitPatient = async (req, res) => {
    try {
        const { patientId, bedId, admissionDate } = req.body;
        const newAdmission = new Admission({ patientId, bedId, admissionDate });
        await newAdmission.save();
        res.status(201).json(newAdmission);
    } catch (error) {
        console.error('Error admitting patient:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to fetch all admissions
exports.getAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find();
        res.json(admissions);
    } catch (error) {
        console.error('Error fetching admissions:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to fetch admission by ID
exports.getAdmissionById = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id);
        if (!admission) {
            return res.status(404).send('Admission not found');
        }
        res.json(admission);
    } catch (error) {
        console.error('Error fetching admission:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to update admission
exports.updateAdmission = async (req, res) => {
    try {
        const { patientId, bedId, admissionDate } = req.body;
        const updatedAdmission = await Admission.findByIdAndUpdate(req.params.id, 
            { patientId, bedId, admissionDate }, { new: true });
        if (!updatedAdmission) {
            return res.status(404).send('Admission not found');
        }
        res.json(updatedAdmission);
    } catch (error) {
        console.error('Error updating admission:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Controller function to delete admission
exports.deleteAdmission = async (req, res) => {
    try {
        const deletedAdmission = await Admission.findByIdAndDelete(req.params.id);
        if (!deletedAdmission) {
            return res.status(404).send('Admission not found');
        }
        res.json(deletedAdmission);
    } catch (error) {
        console.error('Error deleting admission:', error);
        res.status(500).send('Internal Server Error');
    }
};
