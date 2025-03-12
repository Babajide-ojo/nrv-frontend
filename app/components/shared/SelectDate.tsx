import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DateTimePicker, LocalizationProvider, MobileDatePicker, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button, TextField } from "@mui/material";
import dayjs from "dayjs";
import { ThemeProvider, createTheme } from "@mui/material";

interface SelectDateProps {
  isOpen?: boolean;
  onChange?: any;
  value?: any;
  onClose?: (state: boolean) => void;
}

const SelectDate = ({
  isOpen,
  value,
  onChange,
  onClose,
}: SelectDateProps) => {
  const [selected, setSelected] = useState<any>(null);

  const customTheme = createTheme({
    palette: {
      primary: {
        main: "#234e87", // Change to your desired primary color
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      const parsedValue = dayjs(value);
      if (parsedValue.isValid()) {
        setSelected(parsedValue);
      } else {
        setSelected(null);
      }
    }
  }, [isOpen, value]);

  if (!isOpen) return null;
  return (
    <ThemeProvider theme={customTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          openTo="year"
          views={['year', 'month', 'day']}
          yearsOrder="asc"
          open={isOpen}
          onClose={() => onClose && onClose(false)}
          value={selected}
          onAccept={() => {
            onChange && onChange(selected);
            setSelected(null);
          }}
          onChange={setSelected}
          slots={{
            textField: (textFieldProps) => <div style={{ display: "none" }} />,
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default SelectDate;
