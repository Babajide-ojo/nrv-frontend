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

