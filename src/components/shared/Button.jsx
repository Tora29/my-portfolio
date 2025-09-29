import React from 'react'

const Button = React.memo(
  ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    className = '',
    as = 'button',
    href,
    target,
    rel,
    ...props
  }) => {
    const baseClasses =
      'font-["Rubik"] font-normal transition-all duration-200 flex items-center justify-center'

    const variantClasses = {
      primary:
        'bg-[rgb(12,13,21)] text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]',
      secondary:
        'bg-[rgb(108,95,62)] text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]/80',
      ghost:
        'bg-transparent text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]/20',
      link: 'bg-transparent text-[rgb(199,195,187)] hover:text-[rgb(108,95,62)] underline-offset-2 hover:underline',
    }

    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm rounded-md',
      medium: 'px-4 py-2 text-base rounded-lg',
      large: 'px-6 py-3 text-lg rounded-lg',
      icon: 'w-10 h-10 rounded-lg',
      nav: 'w-24 h-16 rounded-lg',
    }

    const widthClasses = fullWidth ? 'w-full' : ''
    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer'

    const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim()

    const Component = as === 'a' ? 'a' : 'button'

    return (
      <Component
        className={combinedClasses}
        onClick={disabled ? undefined : onClick}
        disabled={disabled && Component === 'button'}
        href={Component === 'a' ? href : undefined}
        target={Component === 'a' ? target : undefined}
        rel={Component === 'a' ? rel : undefined}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'

export default Button
