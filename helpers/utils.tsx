// ============================================================================
// APPLICATION STATUS ENUM
// ============================================================================

export enum ApplicationStatus {
  NEW = "New",
  ACCEPTED = "Accepted",
  ACTIVE_LEASE = "Active_lease",
  EXPIRED = "Expired",
  ENDED = "Ended",
  REJECTED = "Rejected",
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Cleans and normalizes CSS class strings
 */
export const cls = (input: string): string =>
  input
    .replace(/\s+/gm, " ")
    .split(" ")
    .filter((cond: string) => typeof cond === "string")
    .join(" ")
    .trim();

/**
 * Formats a number with comma separators
 */
export const formatNumber = (num: string | number): string => {
  if (num === undefined || num === null) {
    return '0';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Formats currency values
 */
export const formatCurrency = (amount: number, currency: string = '₦'): string => {
  if (amount === 0) return `${currency}0.00`;
  return `${currency}${formatNumber(amount.toFixed(2))}`;
};

/**
 * Formats large currency values with abbreviations
 */
export const formatLargeCurrency = (amount: number, currency: string = '₦'): string => {
  if (amount === 0) return `${currency}0.00`;
  
  if (amount >= 1000000000) {
    return `${currency}${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${currency}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${currency}${(amount / 1000).toFixed(1)}K`;
  }
  
  return formatCurrency(amount, currency);
};

// ============================================================================
// DATE UTILITIES
// ============================================================================

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Formats a date string to "MMM, DD YYYY" format
 */
export const formatDate = (inputDate: string): string => {
  if (!inputDate) return '';
  
  try {
    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const monthIndex = parseInt(dateParts[1], 10) - 1;
    const day = dateParts[2];

    if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      throw new Error('Invalid month');
    }

    return `${MONTHS[monthIndex]}, ${day} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return inputDate;
  }
};

/**
 * Formats a date to a more readable format with time
 */
export const formatDateToWords = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Error formatting date to words:', error);
    return dateString;
  }
};

/**
 * Calculates the difference between two dates
 */
export const calculateDateDifference = (
  startDateString: string,
  endDateString: string
): string => {
  try {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date provided');
    }

    if (endDate < startDate) {
      return "End date must be after start date";
    }

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    if (years > 0) {
      parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months !== 1 ? "s" : ""}`);
    }
    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    }

    return parts.length > 0 ? parts.join(", ") : "Same day";
  } catch (error) {
    console.error('Error calculating date difference:', error);
    return "Invalid date range";
  }
};

/**
 * Gets relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error getting relative time:', error);
    return 'Unknown time';
  }
};

// ============================================================================
// FILE UTILITIES
// ============================================================================

/**
 * Gets the file extension from a filename
 */
export const getFileExtension = (filename: string): string | null => {
  if (!filename) return null;
  
  try {
    const parts = filename.split(".");
    if (parts.length > 1) {
      return parts.pop()?.toLowerCase() || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting file extension:', error);
    return null;
  }
};

/**
 * Handles file extension checking
 */
export const handleFileExtension = (file: string): string => {
  try {
    const fileExtension = file?.split(".").pop()?.toLowerCase() || '';
    return fileExtension;
  } catch (error) {
    console.error('Error handling file extension:', error);
    return '';
  }
};

/**
 * Validates file type based on extension
 */
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(filename);
  return extension ? allowedTypes.includes(extension) : false;
};

/**
 * Formats file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ============================================================================
// INPUT VALIDATION UTILITIES
// ============================================================================

/**
 * Prevents non-numeric input in input fields
 */
export const preventNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"];
  
  if (allowedKeys.includes(e.key)) {
    return;
  }
  
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Formats display value for number inputs
 */
export const formatDisplayValue = (value: string): string => {
  // Return raw value for empty, decimal point, or partial decimals
  if (value === "" || value === "." || /^\d+\.$/.test(value)) {
    return value;
  }
  
  try {
    // Remove commas for parsing
    const cleanedValue = value.toString().replace(/,/g, "");
    const num = parseFloat(cleanedValue);
    
    if (isNaN(num)) {
      return value; // Return raw value if not a valid number
    }
    
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error('Error formatting display value:', error);
    return value;
  }
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (Nigerian format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// ============================================================================
// APPLICATION STATUS UTILITIES
// ============================================================================

/**
 * Gets the display text for application status
 */
export const getApplicationStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.NEW:
      return 'New';
    case ApplicationStatus.ACCEPTED:
      return 'Accepted';
    case ApplicationStatus.ACTIVE_LEASE:
      return 'Active Lease';
    case ApplicationStatus.EXPIRED:
      return 'Expired';
    case ApplicationStatus.ENDED:
      return 'Ended';
    case ApplicationStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

/**
 * Gets the color class for application status
 */
export const getApplicationStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.NEW:
      return 'text-blue-600 bg-blue-100';
    case ApplicationStatus.ACCEPTED:
      return 'text-green-600 bg-green-100';
    case ApplicationStatus.ACTIVE_LEASE:
      return 'text-purple-600 bg-purple-100';
    case ApplicationStatus.EXPIRED:
      return 'text-orange-600 bg-orange-100';
    case ApplicationStatus.ENDED:
      return 'text-gray-600 bg-gray-100';
    case ApplicationStatus.REJECTED:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Safely gets data from localStorage
 */
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage for key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely sets data in localStorage
 */
export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data in localStorage for key "${key}":`, error);
  }
}

/**
 * Safely removes data from localStorage
 */
export function removeStoredData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage for key "${key}":`, error);
  }
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================



/**
 * Groups array items by a key
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sorts array by multiple criteria
 */
export function sortByMultiple<T>(
  array: T[],
  criteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction } of criteria) {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Removes undefined and null values from an object
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned = {} as Partial<T>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
}

// ============================================================================
// DEBOUNCE AND THROTTLE
// ============================================================================

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}
