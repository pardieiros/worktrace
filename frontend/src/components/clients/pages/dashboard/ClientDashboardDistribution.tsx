import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { useTranslation } from "react-i18next";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#1E88E5", "#43A047", "#FB8C00", "#8E24AA", "#00ACC1", "#F4511E", "#5E35B1", "#3949AB"];

export interface ClientDistributionDatum {
  name: string;
  value: number;
}

interface ClientDashboardDistributionProps {
  data: ClientDistributionDatum[];
  isLoading: boolean;
}

export function ClientDashboardDistribution({ data, isLoading }: ClientDashboardDistributionProps) {
  const { t } = useTranslation();

  return (
    <Card className="border border-primary/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">{t("client.dashboard.sections.distribution")}</h2>
        <span className="text-sm text-primary/60">
          {t("client.dashboard.sections.distributionHint", "Hours logged per project")}
        </span>
      </div>
      <div className="mt-6 h-80">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}h`}
                contentStyle={{ borderRadius: 12, border: "1px solid rgba(99, 102, 241, 0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}


