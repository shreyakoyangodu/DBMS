// Bed.js

class Bed {
    constructor(id, number, type, availability) {
      this.id = id; // Unique identifier for the bed
      this.number = number; // Bed number
      this.type = type; // Type of bed (e.g., ICU, general ward)
      this.availability = availability; // Availability status of the bed (true or false)
    }
  
    // Method to update bed availability
    updateAvailability(availability) {
      this.availability = availability;
    }
  
    // Method to get bed information
    getBedInfo() {
      return {
        id: this.id,
        number: this.number,
        type: this.type,
        availability: this.availability
      };
    }
  }
  
  module.exports = Bed;
  