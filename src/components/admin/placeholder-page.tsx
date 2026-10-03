import { Card, CardContent, CardHeader, CardTitle } from '@white/ui';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-charcoal-500">
          This module is coming in a future phase. The route and navigation entry are
          already wired up — the full CRUD experience will be built here without
          restructuring the admin shell.
        </p>
      </CardContent>
    </Card>
  );
}
