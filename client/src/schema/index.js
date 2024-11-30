import { z } from "zod";

export const orderSchema = z.object({
  client: z.string().min(1, { message: "Client name is required" }),
  phone1: z
    .string()
    .min(10, { message: "please put a valid phone number" })
    .regex(/^[0-9]+$/, { message: "Phone number should contain only numbers" }),
  phone2: z.string().optional(),
  wilaya: z.string().min(1, { message: "Wilaya is required" }),
  commune: z.string().min(1, { message: "Commune is required" }),
  product_sku: z.string().min(1, { message: "Product SKU is required" }),
  product_name: z.string().min(1, { message: "Product ref is required" }),
        price: z
        .string() // Accept strings initially
        .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) > 0, {
          message: 'Product price must be a positive number',
        })
        .transform((str) => parseFloat(str)), // Convert to number after validation
        quantity: z
        .string() // Accept strings initially
        .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) > 0, {
          message: 'Product quantity must be a positive number',
        }).transform((str) => parseFloat(str)),
        shipping_price: z
        .string().default(0).optional(),

  shipping_type: z.enum(["home", "desk"]).optional().default("home"),
  note: z.string().max(500, { message: "Note cannot exceed 500 characters" }).optional(),
});
export const updatedOrderSchema = z.object({
  client: z.string().min(1, { message: "Client name is required" }),
  phone1: z
    .string()
    .min(10, { message: "Primary phone number should be at least 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number should contain only numbers" }),
  phone2: z
    .string()
    .regex(/^[0-9]+$/, { message: "Secondary phone number should contain only numbers" })
    .optional(),
  wilaya: z.string().min(1, { message: "Wilaya is required" }),
  commune: z.string().min(1, { message: "Commune is required" }),

  shipping_type: z.enum(["home", "desk"]).optional().default("home"),
  note: z.string().max(500, { message: "Note cannot exceed 500 characters" }).optional(),
  attempt: z.string().optional(),
});
export const userSchema = z.object({
    fullname: z.string().min(1, { message: "fullname is required" }),
    phone: z
      .string()
      .min(10, { message: "Primary phone number should be at least 10 digits" })
      .regex(/^[0-9]+$/, { message: "Phone number should contain only numbers" }),
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
  username: z.string().min(3, {message: "username is required"}),
  gender: z.enum(["male", "female"]),
  state: z.string().optional(),
  role: z.enum(['admin', 'confirmatrice']),
  orderConfirmedPrice: z
  .string() // Accept strings initially
  .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) >= 0, {
    message: 'order confirmprice  must be a positive number',
  }).transform((str) => parseFloat(str)).default(0),
  handleLimit: z
  .string() // Accept strings initially
  .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) >= 0, {
    message: 'handle limit  must be a positive number',
  }).transform((str) => parseFloat(str)).default(0),


})


export const updatedUserSchema = z.object({
  fullname: z.string().min(1, { message: "fullname is required" }),
  phone: z
    .string()
    .min(10, { message: "Primary phone number should be at least 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number should contain only numbers" }),
email: z.string().email("Invalid email").trim(),
username: z.string().min(3, {message: "username is required"}),
gender: z.enum(["male", "female"]),
state: z.string().optional(),
role: z.enum(['admin', 'confirmatrice']),
password: z.string().optional(),
orderConfirmedPrice: z
.string() // Accept strings initially
.refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) >= 0, {
  message: 'order confirmprice  must be a positive number',
}).transform((str) => parseFloat(str)).default(0),
handleLimit: z
.string() // Accept strings initially
.refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) >= 0, {
  message: 'handle limit  must be a positive number',
}).transform((str) => parseFloat(str)).default(0),
})

export const updatedMeSchema = z.object({
  fullname: z.string().min(1, { message: "fullname is required" }),
  phone: z
    .string()
    .min(10, { message: "Primary phone number should be at least 10 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number should contain only numbers" }),
email: z.string().email("Invalid email").trim(),
username: z.string().min(3, {message: "username is required"}),
state: z.string().optional(),

})


export const updatePasswordSchema = z
  .object({
    password: z.string().min(1, { message: "password is required" }),
    newPassword: z.string().min(1, { message: "new password is required" }),
    confirmNewPassword: z.string().min(1, { message: "confirm new password is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
      });
    }
  });

  export const productSchema = z.object({
    name: z.string().min(1, { message: "Product Name is required" }),
    selling_price: z
    .string() // Accept strings initially
    .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) > 0, {
      message: 'Product price must be a positive number',
    })
    .transform((str) => parseFloat(str)), // Convert to number after validation
    quantity: z
    .string() // Accept strings initially
    .refine((str) => !isNaN(parseFloat(str)) && parseFloat(str) > 0, {
      message: 'Product quantity must be a positive number',
    }).transform((str) => parseFloat(str)),
    product_sku: z.string().min(1, { message: 'Product SKU is required' }),
    facebook_url: z
    .string()
    .optional(), // Make this field optional
  youtube_url: z
    .string()
    .optional(), // Make this field optional
    description: z.string().optional(),
    image: z
    .union([
      z.instanceof(File).refine((file) => file.size <= 2_000_000, {
        message: "Max image size is 2MB",
      }),
      z.null(),
      z.undefined(),
    ]),

  })