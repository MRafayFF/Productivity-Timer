import { CompletedInterval } from "@/hooks/use-timer";

interface IntervalHistoryProps {
  completedIntervals: CompletedInterval[];
  totalIntervals: number;
}

export function IntervalHistory({ completedIntervals, totalIntervals }: IntervalHistoryProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-card rounded-sm shadow-lg p-6 border border-border">
      <h3 className="text-lg font-medium text-card-foreground mb-4">Interval History</h3>
      
      {Array.from({ length: totalIntervals }, (_, index) => {
        const intervalNumber = index + 1;
        const completed = completedIntervals.find(ci => ci.interval === intervalNumber);
        
        return (
          <div key={intervalNumber} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-sm mr-3 border ${
                completed ? 'bg-primary border-primary' : 'bg-transparent border-muted-foreground'
              }`} />
              <span className={completed ? 'text-card-foreground' : 'text-muted-foreground'}>
                Interval {intervalNumber}
              </span>
            </div>
            <div className={`text-sm ${completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
              {completed ? `Completed at ${formatTime(completed.completedAt)}` : 'Pending'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
