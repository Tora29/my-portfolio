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

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>): void => {
    setImageLoaded(true)
    if (onLoad) onLoad(e)
  }

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
