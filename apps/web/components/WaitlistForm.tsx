"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits"),
  businessName: z.string().min(2, "Business name is too short").optional().or(z.literal("")),
  orders: z.enum(["0-100", "101-500", "500+"]),
});

type FormValues = z.infer<typeof formSchema>;

export function WaitlistForm() {
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      businessName: "",
      orders: "0-100",
    },
  });

  async function onSubmit(values: FormValues) {
    setStatus("LOADING");
    
    try {
      const res = await fetch("http://localhost:8000/api/v1/marketing/waitlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          phone_number: values.phone,
          survey_data: {
            business_name: values.businessName,
            estimated_monthly_orders: values.orders,
          }
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("SUCCESS");
    } catch {
      setStatus("ERROR");
    }
  }

  if (status === "SUCCESS") {
    return (
      <div className="p-6 border border-green-500/30 bg-green-500/10 rounded-lg text-center text-green-700 dark:text-green-400">
        <h3 className="text-xl font-bold mb-2">You are on the list! 🎉</h3>
        <p>We will notify you once your beta invite is ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-6 text-left">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="waitlist-email">Email Address *</FieldLabel>
              <Input
                {...field}
                id="waitlist-email"
                aria-invalid={fieldState.invalid}
                placeholder="merchant@shop.com"
                autoComplete="email"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="waitlist-phone">Phone Number *</FieldLabel>
              <Input
                {...field}
                id="waitlist-phone"
                aria-invalid={fieldState.invalid}
                placeholder="017XXXXX"
                type="tel"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="businessName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="waitlist-business">Business Name</FieldLabel>
              <Input
                {...field}
                id="waitlist-business"
                aria-invalid={fieldState.invalid}
                placeholder="My Awesome Store"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="orders"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="waitlist-orders">Estimated Monthly Orders</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="waitlist-orders" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select expected order volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-100">0 - 100</SelectItem>
                  <SelectItem value="101-500">101 - 500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button 
        type="submit" 
        disabled={status === "LOADING"}
        className="w-full h-12 text-lg font-bold mt-4"
      >
        {status === "LOADING" ? "Joining waitlist..." : "Join Waitlist"}
      </Button>

      {status === "ERROR" && (
        <p className="text-sm text-destructive mt-2 text-center text-balance font-medium">Something went wrong. Have you joined already?</p>
      )}
    </form>
  );
}
