import { z } from 'zod';

export const PasswordSchema = z
    .string()
    .min(8, 'val_password_min')
    .regex(/[A-Z]/, 'val_password_uppercase')
    .regex(/[^a-zA-Z0-9]|[0-9]/, 'val_password_number_special');

export const RegisterUserSchema = z.object({
    email: z.string().email('val_email_invalid'),
    password: PasswordSchema,
});

export const LoginUserSchema = z.object({
    email: z.string().email('val_email_invalid'),
    password: z.string().min(1, 'val_password_required'),
});

export const VerifyEmailSchema = z.object({
    token: z.string().min(1, 'val_token_required'),
});

export const CreateGiftListSchema = z.object({
    name: z.string().min(3, 'val_name_min').max(50, 'val_name_max'),
    imageUrl: z.string().optional().nullable().or(z.literal('')),
});

export const UpdateGiftListSchema = z.object({
    name: z.string().min(3, 'val_name_min').max(50, 'val_name_max').optional(),
    imageUrl: z.string().optional().nullable().or(z.literal('')),
});

export const CreateGiftItemSchema = z.object({
    name: z.string().min(3, 'val_name_min').max(50, 'val_name_max'),
    description: z.string().max(200, 'val_desc_max').optional().nullable(),
    url: z.string().url('val_url_invalid').optional().nullable().or(z.literal('')),
    imageUrl: z.string().optional().nullable().or(z.literal('')),
    preference: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export const UpdateGiftItemSchema = CreateGiftItemSchema.partial();

export const GuestAccessSchema = z.object({
    language: z.string().min(2).max(5).default('en'),
});

export const UpdateGuestAccessNameSchema = z.object({
    customName: z.string().min(1, 'val_name_min_1').max(50, 'val_name_max'),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email('val_email_invalid'),
});

export const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'val_token_required'),
    password: PasswordSchema,
});

export const ResendVerificationSchema = z.object({
    email: z.string().email('val_email_invalid'),
});

// Infer types
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type CreateGiftListInput = z.infer<typeof CreateGiftListSchema>;
export type UpdateGiftListInput = z.infer<typeof UpdateGiftListSchema>;
export type CreateGiftItemInput = z.infer<typeof CreateGiftItemSchema>;
export type UpdateGiftItemInput = z.infer<typeof UpdateGiftItemSchema>;
export type GuestAccessInput = z.infer<typeof GuestAccessSchema>;
export type UpdateGuestAccessNameInput = z.infer<typeof UpdateGuestAccessNameSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>;
