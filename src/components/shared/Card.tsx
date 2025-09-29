import React, { HTMLAttributes } from 'react'

type CardVariant = 'default' | 'gradient' | 'transparent'
type CardRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
type CardOverflow = 'hidden' | 'visible' | 'auto'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children?: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: CardVariant
  padding?: boolean
  rounded?: CardRounded
  overflow?: CardOverflow
  hover?: boolean
}

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
  }: CardProps) => {
    const baseClasses = 'relative'

    const variantClasses: Record<CardVariant, string> = {
      default: 'bg-[rgb(108,95,62)]',
      gradient:
        'bg-gradient-to-br from-[rgb(12,13,21)] via-[rgb(23,24,32)] to-[rgb(108,95,62)]/30',
      transparent: 'bg-transparent',
    }

    const roundedClasses: Record<CardRounded, string> = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }

    const overflowClasses: Record<CardOverflow, string> = {
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
