"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { startOfToday } from "date-fns";
import { updateMaintenance } from "@/redux/slices/maintenanceSlice";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";

const AssignMaintenanceRequest = ({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      assignedTo: "",
      assigneePhoneNumber: "",
      extraNoteToTenant: "",
      scheduledDate: new Date(),
      scheduledTime: "",
    },
    validationSchema: Yup.object({
      assignedTo: Yup.string().required("Expert is required"),
      assigneePhoneNumber: Yup.string()
        .matches(/^0[789][01]\d{8}$/, "Enter a valid Nigerian phone number")
        .required("Phone is required")
        .max(11),
      scheduledDate: Yup.date().required("Scheduled date is required"),
      scheduledTime: Yup.string().required("Scheduled time is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await dispatch(
          updateMaintenance({
            id: JSON.stringify(id),
            formData: values,
          }) as any,
        ).unwrap();
        toast.success("Vendor visit scheduled. The tenant has been notified.");
        onSuccess?.();
      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(error?.message || error || "Unable to schedule the vendor.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Assign Expert to Request</h1>
      <p className=" text-[#807F94] mt-2 text-[13px]  mb-6">
        Kindly fill in all the necessary information, this details will be added
        to the tenants maintenance details
      </p>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label>Scheduled Date</Label>
              <div className="h-11 rounded-sm border border-[#E0E0E6] mt-4 px-2">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={formik.values.scheduledDate}
                    onChange={(newValue) => {
                      formik.setFieldValue("scheduledDate", newValue);
                    }}
                    minDate={startOfToday()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        variant: "standard",
                        InputProps: {
                          disableUnderline: true,
                        },
                        sx: {
                          fontSize: "12px",
                          backgroundColor: "white",
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "none",
                            borderColor: "#E0E0E6",
                          },
                          "& .Mui-focused": {
                            boxShadow: "none",
                          },
                          "& input": {
                            color: "#807F94",
                            padding: "8px 4px",
                          },
                        },
                      },
                      day: {
                        sx: {
                          backgroundColor: "#F5F5F5",
                          "&.Mui-selected": {
                            backgroundColor: "#007443", // selected day
                            color: "#ffffff",
                          },
                          "&.MuiPickersDay-today": {
                            border: "1px solid #3B82F6",
                            backgroundColor: "#007443",
                          },
                          "&.MuiPickersDay-today.Mui-selected": {
                            backgroundColor: "#007443",
                            color: "#fff",
                          },
                          "&:hover": {
                            backgroundColor: "#007443",
                            color: "#ffffff",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              {formik.errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-500">
                  {String(formik.errors.scheduledDate)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="scheduledTime">Scheduled time</Label>
                <Input
                  id="scheduledTime"
                  name="scheduledTime"
                  type="time"
                  className="mt-2"
                  value={formik.values.scheduledTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.scheduledTime &&
                  formik.errors.scheduledTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.scheduledTime}
                    </p>
                  )}
              </div>

              <div>
                <Label htmlFor="assignedTo">Assigned to</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  placeholder="e.g. AquaFix Plumbers"
                  className="mt-2"
                  value={formik.values.assignedTo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.assignedTo && formik.errors.assignedTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.assignedTo}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="assigneePhoneNumber">
                  Vendor phone number
                </Label>
                <Input
                  id="assigneePhoneNumber"
                  name="assigneePhoneNumber"
                  placeholder="0803-XXX-XXXX"
                  className="mt-2"
                  value={formik.values.assigneePhoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.assigneePhoneNumber &&
                  formik.errors.assigneePhoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.assigneePhoneNumber}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <Label htmlFor="extraNoteToTenant">
                Note for tenant (optional)
              </Label>
              <Textarea
                id="extraNoteToTenant"
                name="extraNoteToTenant"
                placeholder="Enter your notes here"
                className="mt-2"
                value={formik.values.extraNoteToTenant}
                onChange={formik.handleChange}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                disabled={loading}
                type="submit"
                className="bg-green-800 hover:bg-green-900 text-white"
              >
                {loading ? "Scheduling..." : "Schedule vendor"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AssignMaintenanceRequest;
