export default function EventDetailsLiveIndicator({className}:{className?:string}) {
  return (
    <div className={`w-5 h-5 animate-pulse bg-red-600 rounded-full ${className}`}/>    
  )
}