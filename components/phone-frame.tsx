"use client"

interface PhoneFrameProps {
  children: React.ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="relative mx-auto h-[700px] w-[350px] overflow-hidden rounded-[40px] border-[12px] border-foreground bg-background shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-50 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground" />
        
        {/* Screen Content */}
        <div className="h-full w-full overflow-y-auto pt-8">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-foreground/30" />
      </div>
    </div>
  )
}
