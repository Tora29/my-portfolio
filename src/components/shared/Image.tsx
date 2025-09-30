import { useState, SyntheticEvent, ImgHTMLAttributes } from 'react'

type ImageRounded =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'full'
  | 'l-lg'
  | 'r-lg'
  | 't-lg'
  | 'b-lg'
type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  src?: string
  alt?: string
  placeholder?: string
  aspectRatio?: number
  objectFit?: ImageObjectFit
  rounded?: ImageRounded
  loading?: 'lazy' | 'eager'
  onLoad?: (e: SyntheticEvent<HTMLImageElement>) => void
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void
  className?: string
  containerClassName?: string
}

/**
 * 画像を表示するコンポーネント
 * プレースホルダー、アスペクト比、ローディング状態、エラーハンドリングをサポート
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.src - 画像のURL
 * @param {string} props.alt - 画像の代替テキスト
 * @param {string} props.placeholder - エラー時または画像未設定時に表示するプレースホルダー画像のURL
 * @param {number} props.aspectRatio - 画像のアスペクト比 (例: 16/9)
 * @param {ImageObjectFit} props.objectFit - 画像のフィット方法 ('cover' | 'contain' | 'fill' | 'none' | 'scale-down')
 * @param {ImageRounded} props.rounded - 画像の角の丸み ('none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'l-lg' | 'r-lg' | 't-lg' | 'b-lg')
 * @param {('lazy'|'eager')} props.loading - 画像の読み込み方法 ('lazy' または 'eager')
 * @param {Function} props.onLoad - 画像の読み込み完了時のコールバック関数
 * @param {Function} props.onError - 画像の読み込みエラー時のコールバック関数
 * @param {string} props.className - 画像要素に追加するCSSクラス名
 * @param {string} props.containerClassName - コンテナ要素に追加するCSSクラス名
 * @returns {JSX.Element} 画像要素
 */
const Image = ({
  src,
  alt = '',
  placeholder = 'https://placehold.co/400x300',
  aspectRatio,
  objectFit = 'cover',
  rounded = 'none',
  loading = 'lazy',
  onLoad,
  onError,
  className = '',
  containerClassName = '',
  ...props
}: ImageProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const roundedClasses: Record<ImageRounded, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
    'l-lg': 'rounded-l-lg',
    'r-lg': 'rounded-r-lg',
    't-lg': 'rounded-t-lg',
    'b-lg': 'rounded-b-lg',
  }

  const objectFitClasses: Record<ImageObjectFit, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }

  /**
   * 画像の読み込み完了時のハンドラー
   *
   * @param {SyntheticEvent<HTMLImageElement>} e - イベントオブジェクト
   * @returns {void}
   */
  const handleLoad = (e: SyntheticEvent<HTMLImageElement>): void => {
    setImageLoaded(true)
    if (onLoad) onLoad(e)
  }

  /**
   * 画像の読み込みエラー時のハンドラー
   *
   * @param {SyntheticEvent<HTMLImageElement>} e - イベントオブジェクト
   * @returns {void}
   */
  const handleError = (e: SyntheticEvent<HTMLImageElement>): void => {
    setImageError(true)
    if (onError) onError(e)
  }

  const imgClasses = `
    w-full h-full
    ${objectFitClasses[objectFit]}
    ${roundedClasses[rounded]}
    ${!imageLoaded ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim()

  const containerClasses = aspectRatio
    ? `relative ${containerClassName}`
    : containerClassName

  const aspectRatioStyle = aspectRatio
    ? { paddingTop: `${(1 / aspectRatio) * 100}%` }
    : {}

  const imgElement = (
    <img
      src={imageError ? placeholder : src || placeholder}
      alt={alt}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      className={imgClasses}
      {...props}
    />
  )

  if (aspectRatio) {
    return (
      <div className={containerClasses}>
        <div style={aspectRatioStyle} />
        <div className="absolute inset-0">{imgElement}</div>
      </div>
    )
  }

  return imgElement
}

export default Image
