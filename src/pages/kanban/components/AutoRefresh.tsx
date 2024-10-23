import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/custom/button'
import { RefreshCw } from 'lucide-react'

interface AutoRefreshProps {
  onRefresh: () => void
}

export default function AutoRefresh({ onRefresh }: AutoRefreshProps) {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(60000) 

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isAutoRefreshEnabled) {
      intervalId = setInterval(onRefresh, refreshInterval)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAutoRefreshEnabled, refreshInterval, onRefresh])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="autoRefresh">Auto Refresh:</Label>
        <Checkbox
          id="autoRefresh"
          checked={isAutoRefreshEnabled}
          onCheckedChange={(checked) => setIsAutoRefreshEnabled(checked as boolean)}
        />
      </div>
      {isAutoRefreshEnabled && (
        <Select
          value={refreshInterval.toString()}
          onValueChange={(value) => setRefreshInterval(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Refresh Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30000">30 seconds</SelectItem>
            <SelectItem value="60000">1 minute</SelectItem>
            <SelectItem value="300000">5 minutes</SelectItem>
            <SelectItem value="600000">10 minutes</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" /> Refresh Now
      </Button>
    </div>
  )
}