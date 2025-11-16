import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TemplateControl } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateCustomizationFormProps {
  controls: TemplateControl[];
  onSubmit: (values: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
  submitLabel?: string;
}

function buildFormSchema(controls: TemplateControl[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  controls.forEach((control) => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (control.controlType) {
      case "color":
        fieldSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color");
        break;
      case "font":
        fieldSchema = z.string().min(1, "Font family is required");
        break;
      case "text":
        fieldSchema = z.string().min(1, "Text is required");
        break;
      // case "number": - Type not supported in schema
      // // Build base number schema with constraints
      // let baseNumberSchema = z.coerce.number();
      // if (control.minValue !== null) {
      // baseNumberSchema = baseNumberSchema.min(control.minValue);
      // }
      // if (control.maxValue !== null) {
      // baseNumberSchema = baseNumberSchema.max(control.maxValue);
      // }
      // 
      // // Wrap with preprocessing to handle empty values
      // fieldSchema = z.preprocess(
      // (val) => {
      // // Convert empty strings to undefined for proper validation
      // if (val === "" || val === null || val === undefined) {
      // return undefined;
      // }
      // return val;
      // },
      // control.required ? baseNumberSchema : baseNumberSchema.optional()
      // );
      // break;
      // case "select": - Type not supported in schema
      // if (control.options && typeof control.options === 'object' && 'values' in control.options) {
      // const options = (control.options as { values: string[] }).values;
      // fieldSchema = z.enum(options as [string, ...string[]]);
      // } else {
      // fieldSchema = z.string();
      // }
      // break;
      // case "toggle": - Type not supported in schema
      // fieldSchema = z.boolean();
      // break;
      default:
        fieldSchema = z.string();
    }
    
    if (!control.required) {
      fieldSchema = fieldSchema.optional();
    }
    
    shape[control.id] = fieldSchema;
  });
  
  return z.object(shape);
}

export function TemplateCustomizationForm({
  controls,
  onSubmit,
  defaultValues = {},
  submitLabel = "Generate with Template"
}: TemplateCustomizationFormProps) {
  const formSchema = buildFormSchema(controls);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: controls.reduce((acc, control) => {
      if (defaultValues[control.id] !== undefined) {
        acc[control.id] = defaultValues[control.id];
      } else if (control.defaultValue !== null && control.defaultValue !== undefined) {
        acc[control.id] = control.defaultValue;
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  const renderControlInput = (control: TemplateControl) => {
    switch (control.controlType) {
      case "color":
        return (
          <FormField
            key={control.id}
            control={form.control}
            name={control.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {control.label}
                  {control.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={field.value || "#000000"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-16 h-10 p-1 rounded-md"
                      data-testid={`input-${control.id}`}
                    />
                    <Input
                      type="text"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                      data-testid={`input-${control.id}-hex`}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "font":
        return (
          <FormField
            key={control.id}
            control={form.control}
            name={control.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {control.label}
                  {control.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  {control.options && typeof control.options === 'object' && 'values' in control.options ? (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger data-testid={`select-${control.id}`}>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        {((control.options as { values: string[] }).values || []).map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      {...field}
                      placeholder="e.g., Inter, Arial, Helvetica"
                      data-testid={`input-${control.id}`}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "text":
        return (
          <FormField
            key={control.id}
            control={form.control}
            name={control.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {control.label}
                  {control.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={control.defaultValue || "Enter text"}
                    data-testid={`input-${control.id}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      // case "number": - Type not supported in schema
      // return (
      // <FormField
      // key={control.id}
      // control={form.control}
      // name={control.id}
      // render={({ field }) => (
      // <FormItem>
      // <FormLabel>
      // {control.label}
      // {control.required && <span className="text-destructive ml-1">*</span>}
      // </FormLabel>
      // <FormControl>
      // <Input
      // type="number"
      // {...field}
      // min={control.minValue ?? undefined}
      // max={control.maxValue ?? undefined}
      // placeholder={control.defaultValue || "0"}
      // data-testid={`input-${control.id}`}
      // />
      // </FormControl>
      // {(control.minValue !== null || control.maxValue !== null) && (
      // <FormDescription>
      // Range: {control.minValue ?? "∞"} - {control.maxValue ?? "∞"}
      // </FormDescription>
      // )}
      // <FormMessage />
      // </FormItem>
      // )}
      // />
      // );
      // 
      // case "select": - Type not supported in schema
      // return (
      // <FormField
      // key={control.id}
      // control={form.control}
      // name={control.id}
      // render={({ field }) => (
      // <FormItem>
      // <FormLabel>
      // {control.label}
      // {control.required && <span className="text-destructive ml-1">*</span>}
      // </FormLabel>
      // <FormControl>
      // <Select onValueChange={field.onChange} defaultValue={field.value}>
      // <SelectTrigger data-testid={`select-${control.id}`}>
      // <SelectValue placeholder="Select an option" />
      // </SelectTrigger>
      // <SelectContent>
      // {control.options && typeof control.options === 'object' && 'values' in control.options
      // ? ((control.options as { values: string[] }).values || []).map((option) => (
      // <SelectItem key={option} value={option}>
      // {option}
      // </SelectItem>
      // ))
      // : null}
      // </SelectContent>
      // </Select>
      // </FormControl>
      // <FormMessage />
      // </FormItem>
      // )}
      // />
      // );
      // 
      // case "toggle": - Type not supported in schema
      // return (
      // <FormField
      // key={control.id}
      // control={form.control}
      // name={control.id}
      // render={({ field }) => (
      // <FormItem className="flex items-center justify-between rounded-md border p-4">
      // <div className="space-y-0.5">
      // <FormLabel className="text-base">
      // {control.label}
      // </FormLabel>
      // {control.defaultValue && (
      // <FormDescription>
      // Default: {control.defaultValue}
      // </FormDescription>
      // )}
      // </div>
      // <FormControl>
      // <Switch
      // checked={field.value}
      // onCheckedChange={field.onChange}
      // data-testid={`switch-${control.id}`}
      // />
      // </FormControl>
      // </FormItem>
      // )}
      // />
      // );
      // 
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          {controls
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((control) => renderControlInput(control))}
        </div>
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              {controls.length} controls
            </Badge>
            {controls.filter(c => c.required).length > 0 && (
              <span className="text-xs">
                * Required fields
              </span>
            )}
          </div>
          <Button type="submit" size="lg" data-testid="button-submit-customization">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
