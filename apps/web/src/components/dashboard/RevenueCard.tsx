import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { formatCentavos } from "#/lib/format";

interface Props {
  title: string;
  amount: number;
  description?: string;
}

export default function RevenueCard({ title, amount, description }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {formatCentavos(amount)}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
