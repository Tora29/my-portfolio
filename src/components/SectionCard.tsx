import { Card, Image, Heading } from './shared'

interface SectionCardProps {
  title: string
  imageSrc: string
  onClick?: () => void
}

const SectionCard = ({ title, imageSrc, onClick }: SectionCardProps) => {
  return (
    <Card
      className="w-[280px] sm:w-[340px] md:w-[380px] h-48 sm:h-56 md:h-60 group"
      variant="transparent"
      onClick={onClick}
      padding={false}
      hover
    >
      <Image
        src={imageSrc}
        alt={`${title} section`}
        className="absolute inset-0 w-full h-full object-cover"
        rounded="lg"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/50 rounded-lg group-hover:bg-black/40 transition-colors"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Heading
          as="h3"
          size="large"
          weight="semibold"
          className="text-2xl sm:text-3xl md:text-4xl"
        >
          {title}
        </Heading>
      </div>
    </Card>
  )
}

export default SectionCard
