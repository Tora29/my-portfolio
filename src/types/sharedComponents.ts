import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'

// Button Component Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'small' | 'medium' | 'large' | 'icon' | 'nav'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'size'> {
  children: ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  as?: 'button' | 'a'
  href?: string
  target?: string
  rel?: string
}

// Card Component Types
export type CardVariant = 'default' | 'gradient' | 'transparent'
export type CardRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type CardOverflow = 'hidden' | 'visible' | 'auto'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: CardVariant
  padding?: boolean
  rounded?: CardRounded
  overflow?: CardOverflow
  hover?: boolean
}

// IconButton Component Types
export type IconDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse'
export type IconSpacing = 'none' | 'tight' | 'normal' | 'loose'

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon
  label?: string
  direction?: IconDirection
  iconSize?: number
  spacing?: IconSpacing
  buttonProps?: Partial<ButtonProps>
}

// NavLink Component Types
export interface NavLinkProps extends Omit<ButtonProps, 'children'> {
  to: string
  children: ReactNode
  scrollBehavior?: ScrollBehavior
  scrollOffset?: number
  external?: boolean
  buttonProps?: Partial<ButtonProps>
}

// Divider Component Types
export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerSpacing = 'none' | 'tight' | 'normal' | 'loose'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation
  thickness?: string
  color?: string
  opacity?: number
  spacing?: DividerSpacing
  className?: string
}

// Gradient Component Types
export type GradientType = 'brand' | 'dark' | 'light' | 'primary' | 'secondary'
export type GradientDirection = 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l' | 'tl'

export interface GradientProps extends HTMLAttributes<HTMLDivElement> {
  type?: GradientType
  direction?: GradientDirection
  opacity?: number
  overlay?: boolean
  className?: string
  children?: ReactNode
}

// Typography Component Types
export type HeadingSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
export type FontFamily = 'rubik' | 'squada'
export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
export type TextColor = 'primary' | 'secondary' | 'dark' | 'light'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
  size?: HeadingSize
  font?: FontFamily
  weight?: FontWeight
  color?: TextColor
  className?: string
  children: ReactNode
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div'
  size?: TextSize
  font?: FontFamily
  weight?: FontWeight
  color?: TextColor
  className?: string
  children: ReactNode
}

// Image Component Types
export type ImageRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'l-lg' | 'r-lg' | 't-lg' | 'b-lg'
export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  placeholder?: string
  aspectRatio?: number
  objectFit?: ImageObjectFit
  rounded?: ImageRounded
  loading?: 'lazy' | 'eager'
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
  className?: string
  containerClassName?: string
}