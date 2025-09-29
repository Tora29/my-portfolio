import React, { HTMLAttributes } from 'react'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
type HeadingSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
type TypographyFont = 'rubik' | 'squada'
type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
type TypographyColor = 'primary' | 'secondary' | 'dark' | 'light'

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag
  size?: HeadingSize
  font?: TypographyFont
  weight?: TypographyWeight
  color?: TypographyColor
  className?: string
  children?: React.ReactNode
}

export const Heading = ({
  as: Component = 'h2',
  size = 'medium',
  font = 'rubik',
  weight = 'normal',
  color = 'primary',
  className = '',
  children,
  ...props
}: HeadingProps) => {
  const sizeClasses: Record<HeadingSize, string> = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
    xlarge: 'text-4xl md:text-5xl',
    xxlarge: 'text-5xl md:text-6xl',
  }

  const fontClasses: Record<TypographyFont, string> = {
    rubik: "font-['Rubik']",
    squada: "font-['Squada_One']",
  }

  const weightClasses: Record<TypographyWeight, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses: Record<TypographyColor, string> = {
    primary: 'text-[rgb(199,195,187)]',
    secondary: 'text-[rgb(108,95,62)]',
    dark: 'text-[rgb(12,13,21)]',
    light: 'text-[rgb(23,24,32)]',
  }

  const combinedClasses = `
    ${sizeClasses[size]}
    ${fontClasses[font]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    leading-tight
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  )
}

type TextTag = 'p' | 'span' | 'div' | 'label'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'

interface BaseTextProps {
  as?: TextTag
  size?: TextSize
  font?: TypographyFont
  weight?: TypographyWeight
  color?: TypographyColor
  className?: string
  children?: React.ReactNode
}

type TextProps = BaseTextProps & HTMLAttributes<HTMLElement>

export const Text = ({
  as = 'p',
  size = 'base',
  font = 'rubik',
  weight = 'normal',
  color = 'primary',
  className = '',
  children,
  ...props
}: TextProps) => {
  const sizeClasses: Record<TextSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const fontClasses: Record<TypographyFont, string> = {
    rubik: "font-['Rubik']",
    squada: "font-['Squada_One']",
  }

  const weightClasses: Record<TypographyWeight, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses: Record<TypographyColor, string> = {
    primary: 'text-[rgb(199,195,187)]',
    secondary: 'text-[rgb(108,95,62)]',
    dark: 'text-[rgb(12,13,21)]',
    light: 'text-[rgb(23,24,32)]',
  }

  const combinedClasses = `
    ${sizeClasses[size]}
    ${fontClasses[font]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    leading-normal
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  const Component = as

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  )
}

const Typography = { Heading, Text }
export default Typography
