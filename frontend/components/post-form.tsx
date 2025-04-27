'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { axiosClient } from '@/app/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/image-upload';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/types/errors';

// Define types for tags
interface Tag {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
  description?: string;
}

// Define the form schema
const postSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  content: z
    .string()
    .min(100, { message: 'Content must be at least 100 characters long' }),
  summary: z
    .string()
    .max(300, { message: 'Summary cannot exceed 300 characters' })
    .min(10, { message: 'Summary must be at least 10 characters long' }),
  status: z.enum(['published', 'draft']),
  tags: z.string().optional(),
  coverImage: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  initialData?: {
    _id?: string;
    title?: string;
    content?: string;
    summary?: string;
    status?: 'published' | 'draft';
    tags?: string[];
    coverImage?: string;
  };
  isEditing?: boolean;
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [imageData, setImageData] = useState<{
    url: string;
    thumbnailUrl: string;
    responsiveUrls: { [key: string]: string };
  } | null>(
    initialData?.coverImage
      ? {
          url: initialData.coverImage,
          thumbnailUrl: initialData.coverImage,
          responsiveUrls: {},
        }
      : null
  );

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosClient.get('/tags');
        if (response.data && response.data.data) {
          setAvailableTags(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Setup form with default values
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      summary: initialData?.summary || '',
      status: initialData?.status || 'draft',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      coverImage: initialData?.coverImage || '',
    },
  });

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);

    try {
      // Process tags
      const tags = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      // Create slug from title
      const slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');

      const postData = {
        ...data,
        tags,
        slug,
        coverImage: imageData?.url || '',
      };

      if (isEditing && initialData?._id) {
        // Update existing post
        await axiosClient.put(`/posts/${initialData._id}`, postData);
        toast.success('Post updated successfully');
        router.push('/dashboard/posts');
      } else {
        // Create new post
        const response = await axiosClient.post('/posts', postData);
        toast.success('Post created successfully');
        router.push(`/dashboard/posts/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (data: {
    url: string;
    thumbnailUrl: string;
    responsiveUrls: { [key: string]: string };
  }) => {
    setImageData(data);
    form.setValue('coverImage', data.url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter post title"
                  {...field}
                  className="font-medium text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  existingImage={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary (required)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief summary of your post"
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">
                A concise summary of your post that will be displayed in post listings.
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here..."
                  {...field}
                  className="min-h-[300px]"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">
                Content must be at least 100 characters long.
              </p>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. javascript, react, web development"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {availableTags.length > 0 && (
          <div className="pt-2">
            <label className="text-sm font-medium mb-2 block">Popular tags:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 10).map((tag, index) => {
                // Extract tag name properly, handling both string and object formats
                const tagName = typeof tag === 'string' ? tag : tag.name || `tag-${index}`;
                return (
                  <Button
                    key={`tag-${index}-${tagName}`}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      const currentTags = form.getValues('tags') || '';
                      const tagsArray = currentTags.split(',').map(t => t.trim()).filter(Boolean);
                      if (!tagsArray.includes(tagName)) {
                        const newTags = [...tagsArray, tagName].join(', ');
                        form.setValue('tags', newTags);
                      }
                    }}
                  >
                    {tagName}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
}