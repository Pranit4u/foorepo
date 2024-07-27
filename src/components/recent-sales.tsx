
export function RecentSales({advice}: { advice: { [key: string]: string } }) {
  return (
    <div className="space-y-8">
      {Object.keys(advice).map((key) => (
        <div className="flex items-center">
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{key}</p>
          <p className="text-sm text-muted-foreground">
            {advice[key]}
          </p>
        </div>
      </div>
      ))}
    </div>
  )
}