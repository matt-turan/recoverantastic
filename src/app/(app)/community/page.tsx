import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community</h2>
          <p className="text-muted-foreground">
            Connect with others on the same journey.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The community features are currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <Users className="size-16 text-muted-foreground" />
          <p className="text-muted-foreground">Check back later for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
