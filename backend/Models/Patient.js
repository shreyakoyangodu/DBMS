// Patient.js

class Patient {
    constructor(id, name, age, gender, medicalCondition) {
      this.id = id; // Unique identifier for the patient
      this.name = name; // Patient's name
      this.age = age; // Patient's age
      this.gender = gender; // Patient's gender
      this.medicalCondition = medicalCondition; // Patient's medical condition
    }
  
    // Method to update patient information
    updateInfo(name, age, gender, medicalCondition) {
      this.name = name;
      this.age = age;
      this.gender = gender;
      this.medicalCondition = medicalCondition;
    }
  
    // Method to get patient details
    getPatientDetails() {
      return {
        id: this.id,
        name: this.name,
        age: this.age,
        gender: this.gender,
        medicalCondition: this.medicalCondition
      };
    }
  }
  
  module.exports = Patient;
  