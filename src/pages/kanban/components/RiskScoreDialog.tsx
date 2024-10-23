import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface RiskScoreDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  riskScore: number
}

export default function RiskScoreDialog({ isOpen, onOpenChange, riskScore }: RiskScoreDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Overall Risk Score</DialogTitle>
          <DialogDescription>
            Current risk assessment based on vulnerabilities.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold">{riskScore.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <Progress value={riskScore} className="w-full" />
          <p className="mt-4 text-sm text-center">
            {riskScore < 30 ? "Low risk. Keep monitoring." :
              riskScore < 70 ? "Moderate risk. Take action on critical items." :
                "High risk. Immediate attention required."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}