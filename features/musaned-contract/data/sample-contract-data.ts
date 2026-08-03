import type { MusanedContractData } from "../types/musaned-contract";

/** Empty shell — all fields render as underlines / placeholders. */
export const emptyMusanedContractData: MusanedContractData = {};

/**
 * Demo payload mirroring a typical API response.
 * Replace with live API data in production.
 */
export const sampleMusanedContractData: MusanedContractData = {
  employer: {
    name: "Abdullah Mohammed Al-Harbi",
    nationalId: "1045678901",
    address: "Al Olaya District, Riyadh",
    addressLine2: "Kingdom of Saudi Arabia",
    civilStatus: "Married",
    contactNumber: "+966501234567",
  },
  saudiRecruitmentAgency: {
    name: "Al-Nour Recruitment Office",
    licenseNo: "1234/HRSD",
    address: "King Fahd Road, Riyadh",
    officialRepresentative: "Khalid Al-Otaibi",
    contactNumber: "+966112345678",
    passportNumber: "A12345678",
    dateAndPlaceOfIssue: "12/01/2024 - Riyadh",
    addressLine2: "P.O. Box 12345, Riyadh 11564",
  },
  domesticWorker: {
    name: "Maria Santos Reyes",
    addressInPhilippines: "123 Mabini St., Quezon City",
    addressInPhilippinesLine2: "Metro Manila, Philippines",
    civilStatus: "Single",
    contactNumbers: "+639171234567",
    passportNumber: "P9876543A",
    dateAndPlaceOfIssue: "05/03/2023 - Manila",
    address: "123 Mabini St., Quezon City",
    addressLine2: "Metro Manila, Philippines",
  },
  philippineRecruitmentAgency: {
    name: "Pacific Care Manpower Agency",
    licenseNo: "POEA-123-456-789",
    address: "Ermita, Manila, Philippines",
    contactNumber: "+63281234567",
    officialRepresentative: "Jose Ramirez",
    passportNumber: "P1122334B",
    dateAndPlaceOfIssue: "10/08/2022 - Manila",
  },
  siteOfEmployment: "Riyadh, Kingdom of Saudi Arabia",
  monthlySalary: "1500",
  signatures: {
    domesticWorker: "",
    employer: "",
    philippineRecruitmentAgency: "",
    saudiRecruitmentAgency: "",
  },
  annex: {
    employerName: "Abdullah Mohammed Al-Harbi",
    employerNationalId: "1045678901",
    employerContactNo: "+966501234567",
    workerName: "Maria Santos Reyes",
    workerPassportNo: "P9876543A",
    monthlySalary: "SAR 1,500",
    contractDuration: "2 years",
    duties: {
      cleaning: true,
      washingIroning: true,
      cooking: true,
      babysitting: false,
      elderlyCare: false,
    },
    otherDuties: ["Grocery shopping", "General household assistance", "", ""],
  },
};
