import React from 'react'
import { Card, Image, Heading } from './shared'

const SectionCard = ({ title, imageSrc, onClick }) => {
  return (
    <Card
      className="w-[380px] h-60 group"
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
      />
      <div className="absolute inset-0 bg-black/50 rounded-lg group-hover:bg-black/40 transition-colors"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Heading as="h3" size="large" weight="semibold">
          {title}
        </Heading>
      </div>
    </Card>
  )
}

export default SectionCard
