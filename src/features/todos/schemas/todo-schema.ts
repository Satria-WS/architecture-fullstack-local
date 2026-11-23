import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const updateTodoSchema = z.object({
  id: z.string().min(1, "Invalid todo id"),
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export const toggleTodoSchema = z.object({
  id: z.string().min(1, "Invalid todo id"),
});

export const deleteTodoSchema = z.object({
  id: z.string().min(1, "Invalid todo id"),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;

