import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChartContainer } from "@/components/ui/chart"
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'
import { Vulnerability } from '../data/schema'

interface AnalyticsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  vulnerabilities: Vulnerability[]
  columns: {
    [key: string]: {
      id: string
      title: string
      items: Vulnerability[]
    }
  }
}

export default function AnalyticsDialog({ isOpen, onOpenChange, vulnerabilities, columns }: AnalyticsDialogProps) {
  const severityDistribution = ['Critical', 'High', 'Medium', 'Low'].map(severity => ({
    name: severity,
    value: vulnerabilities.filter(v => v.severity === severity).length
  }))

  const statusDistribution = Object.entries(columns).map(([_, column]) => ({
    name: column.title,
    value: column.items.length
  }))

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Vulnerability Analytics</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-semibold mb-2">Severity Distribution</h3>
          <ChartContainer
            config={{
              Critical: { label: "Critical", color: "hsl(var(--chart-1))" },
              High: { label: "High", color: "hsl(var(--chart-2))" },
              Medium: { label: "Medium", color: "hsl(var(--chart-3))" },
              Low: { label: "Low", color: "hsl(var(--chart-4))" },
            }}
            className="h-[300px]"
          >
            <RadialBarChart
              width={300}
              height={300}
              innerRadius="10%"
              outerRadius="80%"
              data={severityDistribution}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 'auto']}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                label={{ fill: '#666', position: 'insideStart' }}
                background
                dataKey="value"
              />
            </RadialBarChart>
          </ChartContainer>

          <h3 className="font-semibold mb-2 mt-6">Status Distribution</h3>
          <ChartContainer
            config={Object.fromEntries(
              statusDistribution.map(({ name }) => [name, { label: name, color: `hsl(var(--chart-${Math.floor(Math.random() * 4) + 1}))` }])
            )}
            className="h-[300px]"
          >
            <RadialBarChart
              width={300}
              height={300}
              innerRadius="10%"
              outerRadius="80%"
              data={statusDistribution}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                
                domain={[0, 'auto']}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                label={{ fill: '#666', position: 'insideStart' }}
                background
                dataKey="value"
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}