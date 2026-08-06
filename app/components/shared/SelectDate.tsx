"use client";

import { useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const pickerTheme = createTheme({
  palette: {
    primary: {
      main: "#03442C",
      dark: "#023524",
      light: "#2B892B",
      contrastText: "#ffffff",
    },
  },
});

interface SelectDateProps {
  isOpen?: boolean;
  onChange?: (date: Date) => void;
  value?: string | Date | null;
  onClose?: (state: boolean) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  openTo?: "year" | "month" | "day";
}

const SelectDate = ({
  isOpen = false,
  value,
  onChange,
  onClose,
  disableFuture = false,
  disablePast = false,
  openTo = "day",
}: SelectDateProps) => {
  const [selected, setSelected] = useState<Dayjs | null>(null);

  const minDate = useMemo(() => {
    if (disableFuture) {
      return dayjs().subtract(100, "year").startOf("day");
    }
    if (disablePast) {
      return dayjs().startOf("day");
    }
    return undefined;
  }, [disableFuture, disablePast]);

  const maxDate = useMemo(() => {
    if (disableFuture) {
      return dayjs().endOf("day");
    }
    return undefined;
  }, [disableFuture]);

  const referenceDate = useMemo(() => {
    const parsed = value ? dayjs(value) : null;
    if (parsed?.isValid()) {
      return parsed;
    }
    if (disableFuture) {
      return dayjs().subtract(25, "year");
    }
    return dayjs();
  }, [value, disableFuture]);

  const pickerViews = useMemo(() => {
    if (disableFuture || openTo === "year") {
      return ["year", "month", "day"] as const;
    }
    if (openTo === "month") {
      return ["month", "day"] as const;
    }
    return ["day"] as const;
  }, [disableFuture, openTo]);

  const pickerOpenTo = disableFuture ? "day" : openTo;

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const parsed = value ? dayjs(value) : null;
    setSelected(parsed?.isValid() ? parsed : referenceDate);
  }, [isOpen, value, referenceDate]);

  const handleClose = () => {
    onClose?.(false);
  };

  const handleConfirm = () => {
    if (selected?.isValid()) {
      onChange?.(selected.toDate());
    }
    handleClose();
  };

  const title = disableFuture ? "Date of birth" : "Select date";
  const subtitle = selected?.isValid()
    ? selected.format("dddd, D MMMM YYYY")
    : "Pick a date below";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-1.5rem)] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-md"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="border-b border-gray-100 px-5 py-4">
            <DialogPrimitive.Title className="text-base font-semibold text-gray-900">
              {title}
            </DialogPrimitive.Title>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            {disableFuture && (
              <p className="mt-2 text-xs text-gray-500">
                Tap the month or year above the calendar to jump quickly.
              </p>
            )}
          </div>

          <ThemeProvider theme={pickerTheme}>
            <div className="flex justify-center px-2 py-1 [&_.MuiPickersLayout-root]:min-h-0 [&_.MuiDateCalendar-root]:mx-auto [&_.MuiPickersCalendarHeader-label]:text-sm [&_.MuiPickersCalendarHeader-label]:font-semibold">
              <StaticDatePicker
                value={selected}
                onChange={(next) => setSelected(next)}
                referenceDate={referenceDate}
                disableFuture={disableFuture}
                disablePast={disablePast}
                minDate={minDate}
                maxDate={maxDate}
                openTo={pickerOpenTo}
                views={[...pickerViews]}
                yearsOrder={disableFuture ? "desc" : "asc"}
                displayStaticWrapperAs="desktop"
                slotProps={{
                  toolbar: { hidden: true },
                  actionBar: { actions: [] },
                }}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  "& .MuiPickersYear-yearButton.Mui-selected": {
                    backgroundColor: "#03442C",
                    color: "#fff",
                  },
                  "& .MuiPickersYear-yearButton.Mui-selected:hover": {
                    backgroundColor: "#023524",
                  },
                  "& .MuiPickersMonth-monthButton.Mui-selected": {
                    backgroundColor: "#03442C",
                    color: "#fff",
                  },
                  "& .MuiPickersMonth-monthButton.Mui-selected:hover": {
                    backgroundColor: "#023524",
                  },
                  "& .MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "#03442C",
                    color: "#fff",
                  },
                  "& .MuiPickersDay-root.Mui-selected:hover": {
                    backgroundColor: "#023524",
                  },
                  "& .MuiPickersDay-today": {
                    borderColor: "#2B892B",
                  },
                  "& .MuiIconButton-root": {
                    color: "#03442C",
                  },
                }}
              />
            </div>
          </ThemeProvider>

          <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-5 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="border-gray-300 bg-white text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#03442C] text-white hover:bg-[#023524]"
              onClick={handleConfirm}
              disabled={!selected?.isValid()}
            >
              Confirm
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default SelectDate;
