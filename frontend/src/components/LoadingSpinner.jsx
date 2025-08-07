import { Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

const LoadingSpinner = ({ 
  size = 'default', 
  className = '',
  text = 'Loading...',
  showText = true,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const Spinner = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 className={cn(
        "animate-spin text-primary-600",
        sizeClasses[size]
      )} />
      {showText && (
        <p className="mt-3 text-sm text-gray-600 font-medium">
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {Spinner}
      </div>
    )
  }

  return Spinner
}

export default LoadingSpinner