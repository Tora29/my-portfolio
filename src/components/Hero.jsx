import React from 'react'
import { Image, Heading, Text } from './shared'
import { SITE_INFO } from '../config/constants'
import mainImage from '../assets/mainImage.png'

const Hero = () => {
  return (
    <section className="relative h-[400px] flex items-center justify-end">
      <Image
        src={mainImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 mr-[100px] text-right">
        <Heading as="h1" size="xxlarge" font="squada" className="mb-2">
          {SITE_INFO.title}
        </Heading>
        <Text size="2xl" font="squada" className="md:text-3xl">
          {SITE_INFO.subtitle}
        </Text>
      </div>
    </section>
  )
}

export default Hero
