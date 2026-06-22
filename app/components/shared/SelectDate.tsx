"use client";

import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const parsed = value ? dayjs(value) : null;
    setSelected(parsed?.isValid() ? parsed : dayjs());
  }, [isOpen, value]);

  const handleClose = () => {
    onClose?.(false);
  };

  const handleConfirm = () => {
    if (selected?.isValid()) {
      onChange?.(selected.toDate());
    }
    handleClose();
  };

  const handleDaySelect = (next: Dayjs | null) => {
    setSelected(next);
    if (next?.isValid()) {
      onChange?.(next.toDate());
      handleClose();
    }
  };

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
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-[201] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">Select date</DialogPrimitive.Title>
          <StaticDatePicker
            value={selected}
            onChange={handleDaySelect}
            disableFuture={disableFuture}
            disablePast={disablePast}
            openTo={openTo}
            views={
              openTo === "year"
                ? ["year", "month", "day"]
                : openTo === "month"
                  ? ["month", "day"]
                  : ["day"]
            }
            slotProps={{
              actionBar: { actions: [] },
              day: {
                sx: {
                  "&.Mui-selected": {
                    backgroundColor: "#03442C",
                    color: "#ffffff",
                    "&:hover": { backgroundColor: "#023524" },
                  },
                  "&.MuiPickersDay-today": {
                    border: "1px solid #2B892B",
                  },
                  "&:hover": { backgroundColor: "rgba(3, 68, 44, 0.08)" },
                },
              },
            }}
          />
          <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-nrvPrimaryGreen hover:bg-[#023524] text-white"
              onClick={handleConfirm}
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
