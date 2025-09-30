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

/**
 * 見出しテキストを表示するコンポーネント
 * h1〜h6タグまたはdivタグとして描画でき、サイズ、フォント、太さ、色をカスタマイズ可能
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {HeadingTag} props.as - 描画するHTMLタグ ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div')
 * @param {HeadingSize} props.size - 見出しのサイズ ('small' | 'medium' | 'large' | 'xlarge' | 'xxlarge')
 * @param {TypographyFont} props.font - フォントファミリー ('rubik' | 'squada')
 * @param {TypographyWeight} props.weight - フォントの太さ ('light' | 'normal' | 'medium' | 'semibold' | 'bold')
 * @param {TypographyColor} props.color - テキストの色 ('primary' | 'secondary' | 'dark' | 'light')
 * @param {string} props.className - 追加のCSSクラス名
 * @param {React.ReactNode} props.children - 見出し内に表示する子要素
 * @returns {JSX.Element} 見出し要素
 */
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

/**
 * 本文テキストを表示するコンポーネント
 * p、span、div、labelタグとして描画でき、サイズ、フォント、太さ、色をカスタマイズ可能
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {TextTag} props.as - 描画するHTMLタグ ('p' | 'span' | 'div' | 'label')
 * @param {TextSize} props.size - テキストのサイズ ('xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl')
 * @param {TypographyFont} props.font - フォントファミリー ('rubik' | 'squada')
 * @param {TypographyWeight} props.weight - フォントの太さ ('light' | 'normal' | 'medium' | 'semibold' | 'bold')
 * @param {TypographyColor} props.color - テキストの色 ('primary' | 'secondary' | 'dark' | 'light')
 * @param {string} props.className - 追加のCSSクラス名
 * @param {React.ReactNode} props.children - テキスト内に表示する子要素
 * @returns {JSX.Element} テキスト要素
 */
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
