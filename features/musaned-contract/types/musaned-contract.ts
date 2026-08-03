export type PartyPerson = {
  name?: string | null;
  nationalId?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  civilStatus?: string | null;
  contactNumber?: string | null;
};

export type RecruitmentAgency = {
  name?: string | null;
  licenseNo?: string | null;
  address?: string | null;
  addressLine2?: string | null;
  officialRepresentative?: string | null;
  contactNumber?: string | null;
  passportNumber?: string | null;
  dateAndPlaceOfIssue?: string | null;
};

export type DomesticWorker = {
  name?: string | null;
  addressInPhilippines?: string | null;
  addressInPhilippinesLine2?: string | null;
  civilStatus?: string | null;
  contactNumbers?: string | null;
  passportNumber?: string | null;
  dateAndPlaceOfIssue?: string | null;
  address?: string | null;
  addressLine2?: string | null;
};

export type AnnexDuties = {
  cleaning?: boolean | null;
  washingIroning?: boolean | null;
  cooking?: boolean | null;
  babysitting?: boolean | null;
  elderlyCare?: boolean | null;
};

export type AnnexData = {
  employerName?: string | null;
  employerNationalId?: string | null;
  employerContactNo?: string | null;
  workerName?: string | null;
  workerPassportNo?: string | null;
  monthlySalary?: string | null;
  contractDuration?: string | null;
  duties?: AnnexDuties;
  otherDuties?: Array<string | null | undefined>;
};

export type SignatureDates = {
  domesticWorker?: string | null;
  employer?: string | null;
  philippineRecruitmentAgency?: string | null;
  saudiRecruitmentAgency?: string | null;
};

/**
 * API response shape for the Musaned Filipino domestic-worker contract.
 * Pass the full object as `<MusanedContract data={apiResponse} />`.
 */
export type MusanedContractData = {
  employer?: PartyPerson;
  saudiRecruitmentAgency?: RecruitmentAgency;
  domesticWorker?: DomesticWorker;
  philippineRecruitmentAgency?: RecruitmentAgency;
  siteOfEmployment?: string | null;
  monthlySalary?: string | null;
  signatures?: SignatureDates;
  annex?: AnnexData;
};
