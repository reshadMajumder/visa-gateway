import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon = null,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
