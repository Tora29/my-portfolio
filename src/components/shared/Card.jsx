import React from 'react'

const Card = React.memo(
  ({
    children,
    className = '',
    onClick,
    variant = 'default',
    padding = true,
    rounded = 'lg',
    overflow = 'hidden',
    hover = false,
    ...props
  }) => {
    const baseClasses = 'relative'

    const variantClasses = {
      default: 'bg-[rgb(108,95,62)]',
      gradient:
        'bg-gradient-to-br from-[rgb(12,13,21)] via-[rgb(23,24,32)] to-[rgb(108,95,62)]/30',
      transparent: 'bg-transparent',
    }

    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }

    const overflowClasses = {
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      auto: 'overflow-auto',
    }

    const paddingClasses = padding ? 'p-8' : ''
    const hoverClasses = hover
      ? 'hover:shadow-lg transition-shadow cursor-pointer'
      : ''
    const clickableClasses = onClick ? 'cursor-pointer' : ''

    const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${roundedClasses[rounded]}
    ${overflowClasses[overflow]}
    ${paddingClasses}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `
      .replace(/\s+/g, ' ')
      .trim()

    return (
      <div className={combinedClasses} onClick={onClick} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
