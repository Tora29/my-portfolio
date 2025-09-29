import React from 'react'

export const Heading = ({
  as: Component = 'h2',
  size = 'medium',
  font = 'rubik',
  weight = 'normal',
  color = 'primary',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    small: 'text-xl md:text-2xl',
    medium: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
    xlarge: 'text-4xl md:text-5xl',
    xxlarge: 'text-5xl md:text-6xl',
  }

  const fontClasses = {
    rubik: "font-['Rubik']",
    squada: "font-['Squada_One']",
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses = {
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

export const Text = ({
  as: Component = 'p',
  size = 'base',
  font = 'rubik',
  weight = 'normal',
  color = 'primary',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  }

  const fontClasses = {
    rubik: "font-['Rubik']",
    squada: "font-['Squada_One']",
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const colorClasses = {
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

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  )
}

const Typography = { Heading, Text }
export default Typography
