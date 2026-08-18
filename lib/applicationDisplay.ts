const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const getApplicationJobTitle = (application: any): string | null => {
  if (hasText(application?.jobTitle)) {
    return application.jobTitle.trim();
  }
  if (hasText(application?.employment?.jobTitle)) {
    return application.employment.jobTitle.trim();
  }
  if (hasText(application?.applicant?.jobTitle)) {
    return application.applicant.jobTitle.trim();
  }
  return null;
};

export const getApplicationEmployer = (application: any): string | null => {
  if (hasText(application?.currentEmployer)) {
    return application.currentEmployer.trim();
  }
  if (hasText(application?.employment?.employer)) {
    return application.employment.employer.trim();
  }
  if (hasText(application?.applicant?.currentEmployer)) {
    return application.applicant.currentEmployer.trim();
  }
  return null;
};

export const getApplicationCurrentResidence = (application: any): string | null => {
  if (hasText(application?.currentResidence)) {
    return application.currentResidence.trim();
  }
  if (hasText(application?.currentAddress)) {
    return application.currentAddress.trim();
  }
  if (hasText(application?.applicant?.homeAddress)) {
    return application.applicant.homeAddress.trim();
  }
  return null;
};

export const getApplicationMonthlyIncome = (application: any): number | null => {
  const raw =
    application?.monthlyIncome ?? application?.applicant?.monthlyIncome ?? null;
  if (raw == null || raw === "") {
    return null;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
};

export const formatEndTenancySummary = (application: any): string | null => {
  const reason = application?.endTenancyReason?.trim();
  const comment = application?.endTenancyComment?.trim();
  if (!reason && !comment) {
    return null;
  }
  if (reason && comment) {
    return `${reason} — ${comment}`;
  }
  return reason || comment || null;
};
