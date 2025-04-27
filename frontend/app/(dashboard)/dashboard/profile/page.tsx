'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateProfile } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

// Define the form schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(30, { message: 'Username cannot exceed 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  bio: z
    .string()
    .max(200, { message: 'Bio cannot exceed 200 characters' })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      updateProfile.mutate(data, {
        onSuccess: () => {
          toast.success('Profile updated successfully');
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
        <div className="h-[400px] bg-slate-100 rounded mt-6"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500">Update your profile information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="text-sm text-gray-500 mb-4">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Account created:</strong>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || updateProfile.isPending}
                >
                  {updateProfile.isPending ? 'Saving...' : 'Update Profile'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          To change your password, please use the link below. You will receive an email with instructions.
        </p>
        <Button variant="outline">Reset Password</Button>
      </div>
    </div>
  );
}