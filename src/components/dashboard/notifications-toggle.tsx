'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export function NotificationsToggle() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Get gentle reminders and encouragement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
          <Label htmlFor="notifications-switch" className="flex-1">
            Enable Push Notifications
          </Label>
          <Switch id="notifications-switch" />
        </div>
      </CardContent>
    </Card>
  );
}
