import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings } from "lucide-react";

export default function SettingsPlaceholder() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your Pulse AI account and platform preferences.</p>
        </div>
      </div>
      <Card gradient className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <Settings className="w-16 h-16 text-zinc-700 mb-4" />
        <CardTitle className="text-xl text-zinc-300">Settings Module</CardTitle>
        <CardDescription className="max-w-md mt-2">
          API keys, team management, and notification settings will be displayed here.
        </CardDescription>
      </Card>
    </div>
  );
}
