export type VerificationNextStep =
  | "personal"
  | "employment"
  | "guarantor"
  | "documents"
  | "complete";

const hasText = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export const getVerificationNextStep = (
  response: any | null | undefined,
): VerificationNextStep => {
  if (!response) {
    return "personal";
  }

  const hasPersonal =
    hasText(response.fullName) ||
    hasText(response.firstName) ||
    hasText(response.lastName) ||
    hasText(response.email) ||
    hasText(response.phone);
  if (!hasPersonal) {
    return "personal";
  }

  const hasEmployment =
    hasText(response.employmentStatus) &&
    (hasText(response.companyName) || hasText(response.currentEmployer)) &&
    (hasText(response.roleInCompany) || hasText(response.jobTitle)) &&
    hasText(response.companyAddress) &&
    response.monthlyIncome != null &&
    Number(response.monthlyIncome) > 0 &&
    Boolean(response.dateJoined);
  if (!hasEmployment) {
    return "employment";
  }

  const hasGuarantor =
    hasText(response.guarantorFirstName) &&
    hasText(response.guarantorLastName) &&
    hasText(response.guarantorEmail) &&
    (hasText(response.guarantorPhone) || hasText(response.guarantorPhoneNumber)) &&
    hasText(response.guarantorEmploymentStatus) &&
    hasText(response.guarantorCompany) &&
    (hasText(response.guarantorAddress) || hasText(response.guarantorHomeAddress));
  if (!hasGuarantor) {
    return "guarantor";
  }

  const hasDocuments = Boolean(
    response.bankStatementUrl ||
      response.utilityBillUrl ||
      response.identificationDocumentUrl ||
      response.bankStatement ||
      response.proofOfEmployment ||
      response.workIdCard ||
      response.utilityBill ||
      response.governmentId ||
      response.identityDocument ||
      response.documentsUploaded,
  );
  if (!hasDocuments) {
    return "documents";
  }

  return "complete";
};

export const verificationStepPath = (
  verificationId: string,
  step: VerificationNextStep,
): string => {
  const base = `/dashboard/tenant/verification`;
  const query = `verificationId=${encodeURIComponent(verificationId)}`;
  if (step === "personal") {
    return `${base}/personal-info?${query}`;
  }
  if (step === "employment") {
    return `${base}/employment-info?${query}`;
  }
  if (step === "guarantor") {
    return `${base}/guarantor-info?${query}`;
  }
  if (step === "documents") {
    return `${base}/income-assessment?${query}`;
  }
  return `${base}?${query}&completed=1`;
};

export const isVerificationIncomplete = (
  response: any | null | undefined,
): boolean => {
  if (!response) {
    return true;
  }
  return getVerificationNextStep(response) !== "complete";
};
