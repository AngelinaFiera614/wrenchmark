
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Loader2 } from "lucide-react";

const UserPreferencesSection = () => {
  const { preferences, isLoading, updatePreferences } = useUserPreferences();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-accent-teal" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your Wrenchmark experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={preferences?.theme || 'system'}
            onValueChange={(value) => updatePreferences({ theme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="measurement_unit">Measurement Unit</Label>
          <Select
            value={preferences?.measurement_unit || 'metric'}
            onValueChange={(value) => updatePreferences({ measurement_unit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (kg, km/h, mm)</SelectItem>
              <SelectItem value="imperial">Imperial (lbs, mph, in)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-base">
              Enable notifications
            </Label>
            <Switch
              id="notifications"
              checked={preferences?.notifications_enabled ?? true}
              onCheckedChange={(checked) => updatePreferences({ notifications_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email_notifications" className="text-base">
              Email notifications
            </Label>
            <Switch
              id="email_notifications"
              checked={preferences?.email_notifications ?? true}
              onCheckedChange={(checked) => updatePreferences({ email_notifications: checked })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy_level">Privacy Level</Label>
          <Select
            value={preferences?.privacy_level || 'public'}
            onValueChange={(value) => updatePreferences({ privacy_level: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select privacy level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="friends">Friends Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesSection;
