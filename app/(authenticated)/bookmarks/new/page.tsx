'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Link as LinkIcon,
  Globe,
  Lock,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function NewBookmarkPage() {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: [] as string[],
    isPublic: false,
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUrlBlur = async () => {
    if (!formData.url || formData.title) return;

    setIsLoading(true);
    try {
      // Simulate metadata fetching
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFormData((prev) => ({
        ...prev,
        title: 'Auto-fetched Title',
        description: 'Auto-fetched description from the URL...',
      }));
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate
      const newErrors: Record<string, string> = {};
      if (!formData.url) newErrors.url = 'URL is required';
      if (!formData.title) newErrors.title = 'Title is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to bookmarks page
      window.location.href = '/bookmarks';
    } catch (error) {
      console.error('Failed to save bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/bookmarks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookmarks
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Add New Bookmark
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Save a new link to your collection
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Bookmark Details</CardTitle>
          <CardDescription>
            Enter the URL and we'll try to fetch the title and description
            automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL */}
            <div>
              <Input
                label="URL"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                onBlur={handleUrlBlur}
                error={errors.url}
                required
              />
            </div>

            {/* Title */}
            <div>
              <Input
                label="Title"
                placeholder="Bookmark title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                error={errors.title}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-primary-400"
                rows={3}
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Privacy
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPublic: false }))
                  }
                  className={`flex w-full items-center space-x-3 rounded-lg border p-4 text-left transition-colors ${
                    !formData.isPublic
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <Lock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Private
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Only you can see this bookmark
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, isPublic: true }))
                  }
                  className={`flex w-full items-center space-x-3 rounded-lg border p-4 text-left transition-colors ${
                    formData.isPublic
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <Globe className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Public
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Anyone can see this bookmark
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link href="/bookmarks">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" loading={isLoading}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Save Bookmark
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      {(formData.title || formData.description) && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your bookmark will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.title && (
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {formData.title}
                </h3>
              )}
              {formData.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.description}
                </p>
              )}
              {formData.url && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new URL(formData.url).hostname}
                </p>
              )}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
