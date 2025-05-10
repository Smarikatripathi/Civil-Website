import * as React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-8", className)} {...props} />
));
Form.displayName = "Form";

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label ref={ref} className={cn("block", className)} {...props} />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => <div ref={ref} {...props} />);
FormControl.displayName = "FormControl";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-destructive", className)}
    {...props}
  >
    {children}
  </p>
));
FormMessage.displayName = "FormMessage";

export { Form, FormItem, FormLabel, FormControl, FormMessage };
