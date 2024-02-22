// Discharge.js

class Discharge {
    constructor(id, admissionId, dischargeDate, reason) {
      this.id = id; // Unique identifier for the discharge
      this.admissionId = admissionId; // ID of the associated admission
      this.dischargeDate = dischargeDate; // Date and time of discharge
      this.reason = reason; // Reason for discharge
    }
  
    // Method to update discharge reason
    updateReason(reason) {
      this.reason = reason;
    }
  
    // Method to mark bed as vacant
    static markBedAsVacant(beds, bedId) {
      const bedIndex = beds.findIndex(bed => bed.id === bedId);
      if (bedIndex !== -1) {
        beds[bedIndex].availability = true;
        return { success: true, message: 'Bed marked as vacant successfully' };
      } else {
        return { success: false, message: 'Bed not found' };
      }
    }
  }
  
  module.exports = Discharge;
  