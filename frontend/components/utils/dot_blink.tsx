import { cn } from "@/lib/utils";


export default function DotBlink({className, variant='online', ...props}: {className?:string, variant?:"online"|"offline"}) {
  return (
      <span className={cn("inline-block rounded-full animate-pulse shadow-lg h-3 w-3", variant === 'online' ? 'dot-online' : 'dot-offline', className)}/>
  )
}