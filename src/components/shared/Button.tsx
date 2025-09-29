import React, {
  MouseEvent,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'small' | 'medium' | 'large' | 'icon' | 'nav'

interface BaseButtonProps {
  children?: React.ReactNode
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

interface ButtonAsButton
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
  as?: 'button'
  href?: never
  target?: never
  rel?: never
}

interface ButtonAsAnchor
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
  as: 'a'
  href?: string
  target?: string
  rel?: string
}

type ButtonProps = ButtonAsButton | ButtonAsAnchor

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
  }: ButtonProps) => {
    const baseClasses =
      'font-["Rubik"] font-normal transition-all duration-200 flex items-center justify-center'

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        'bg-[rgb(12,13,21)] text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]',
      secondary:
        'bg-[rgb(108,95,62)] text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]/80',
      ghost:
        'bg-transparent text-[rgb(199,195,187)] hover:bg-[rgb(108,95,62)]/20',
      link: 'bg-transparent text-[rgb(199,195,187)] hover:text-[rgb(108,95,62)] underline-offset-2 hover:underline',
    }

    const sizeClasses: Record<ButtonSize, string> = {
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

    if (as === 'a') {
      return (
        <a
          className={combinedClasses}
          onClick={disabled ? undefined : onClick}
          href={href}
          target={target}
          rel={rel}
          {...(props as Omit<
            AnchorHTMLAttributes<HTMLAnchorElement>,
            keyof BaseButtonProps
          >)}
        >
          {children}
        </a>
      )
    }

    return (
      <button
        className={combinedClasses}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        {...(props as Omit<
          ButtonHTMLAttributes<HTMLButtonElement>,
          keyof BaseButtonProps
        >)}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
