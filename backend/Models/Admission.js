// Admission.js

class Admission {
    constructor(id, patientId, bedId, admissionDate) {
      this.id = id; // Unique identifier for the admission
      this.patientId = patientId; // ID of the admitted patient
      this.bedId = bedId; // ID of the assigned bed
      this.admissionDate = admissionDate; // Date and time of admission
      this.dischargeDate = null; // Date and time of discharge (initially null)
    }
  
    // Method to update discharge date
    updateDischargeDate(dischargeDate) {
      this.dischargeDate = dischargeDate;
    }
  
    // Method to track admission history
    static trackAdmissionHistory(admissions, patientId) {
      return admissions.filter(admission => admission.patientId === patientId);
    }
  
    // Method to assign bed to patient
    static assignBedToPatient(admissions, patientId, bedId, admissionDate) {
      // Check if the patient is already admitted
      const existingAdmission = admissions.find(admission => admission.patientId === patientId && !admission.dischargeDate);
      if (existingAdmission) {
        return { success: false, message: 'Patient is already admitted' };
      }
  
      // Create a new admission record
      const newAdmission = new Admission(admissions.length + 1, patientId, bedId, admissionDate);
      admissions.push(newAdmission);
      return { success: true, message: 'Bed assigned to patient successfully', admission: newAdmission };
    }
  }
  
  module.exports = Admission;
  