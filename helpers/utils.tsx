export const cls = (input : any) =>
  input
    .replace(/\s+/gm, " ")
    .split(" ")
    .filter((cond: any) => typeof cond === "string")
    .join(" ")
    .trim();


    export const handleFileExtention = (file: any) => {
      const fileExtension = file?.split(".").pop().toLowerCase();
      return fileExtension;
    };


    //import * as html2pdf from 'html2pdf.js';
export const formatDate = (inputDate: any) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateParts = inputDate?.split("-");
  const year = dateParts?.[0];
  const monthIndex = parseInt(dateParts?.[1], 10) - 1; // Month is zero-based
  const day = dateParts?.[2];

  const formattedDate = `${months[monthIndex]}, ${day} ${year}`;

  return formattedDate;
};

export const formatNumber = (num: string) => {
  if (num === undefined || num === null) {
    return '0'; // or any default value you prefer
}

return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export const formatDateToWords = (dateString: any) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Use 12-hour format with AM/PM
  }).format(date);
};

  export const calculateDateDifference = (
    startDateString: string,
    endDateString: string,
    isSubmitRequest?: boolean
  ) => {
    const startDate: any = new Date(startDateString);
    const endDate : any= new Date(endDateString);

    // if(isSubmitRequest === true)

    // if (endDate < startDate) {
    //   alert("End date must be after start date.");
    // }

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

    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }, and ${days} day${days !== 1 ? "s" : ""}`;
  };


  export  const getFileExtension = (filename: string) => {
    if (filename) {
      const parts = filename.split(".");
      if (parts.length > 1) {
        return parts.pop()?.toLowerCase() || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  export const preventNonNumeric = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  
    if (allowedKeys.includes(e.key)) {
      return;
    }
  
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };
  
export const formatDisplayValue = (value: string) => {
  // Return raw value for empty, decimal point, or partial decimals
  if (value === "" || value === "." || /^\d+\.$/.test(value)) {
    return value;
  }
  // Remove commas for parsing
  const cleanedValue = value.toString().replace(/,/g, "");
  const num = parseFloat(cleanedValue);
  if (isNaN(num)) {
    return value; // Return raw value if not a valid number
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2, // Allow up to 2 decimal places
  });
};

export enum ApplicationStatus {
  NEW = 'New',
  ACCEPTED = 'Accepted',
  ACTIVE_LEASE = 'Active_lease',
  EXPIRED = 'Expired',
  ENDED = 'Ended',
  REJECTED = 'Rejected',
}
