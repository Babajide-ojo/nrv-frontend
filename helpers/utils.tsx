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