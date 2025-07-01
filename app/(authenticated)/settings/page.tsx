import { auth } from '@/lib/auth';
import { User, Bell, Shield, Database, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <a
              href="#profile"
              className="flex items-center space-x-3 rounded-lg bg-primary-50 px-3 py-2 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </a>
            <a
              href="#notifications"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </a>
            <a
              href="#privacy"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <Shield className="h-5 w-5" />
              <span>Privacy</span>
            </a>
            <a
              href="#data"
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <Database className="h-5 w-5" />
              <span>Data & Export</span>
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <Card id="profile">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center dark:bg-primary-900/20">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Name"
                  defaultValue={session?.user?.name || ''}
                  placeholder="Your full name"
                />
                <Input
                  label="Email"
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  placeholder="your@email.com"
                />
              </div>

              <Input
                label="Public Profile URL"
                defaultValue={`linknest.com/${session?.user?.name?.toLowerCase().replace(/\s+/g, '') || 'username'}`}
                helperText="This is how others will find your public bookmarks"
              />

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Weekly Digest
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get a summary of your bookmarking activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Disabled
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Product Updates
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Learn about new features and improvements
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card id="privacy">
            <CardHeader>
              <CardTitle>Privacy & Sharing</CardTitle>
              <CardDescription>
                Control who can see your bookmarks and profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Public Profile
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow others to find and view your public bookmarks
                    </p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Search Engine Indexing
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow search engines to index your public bookmarks
                    </p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Analytics
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Help us improve by sharing anonymous usage data
                    </p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Export */}
          <Card id="data">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export your data or delete your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Export Your Data
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Download all your bookmarks and data in JSON format
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Database className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 p-4 dark:border-red-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                        Delete Account
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}