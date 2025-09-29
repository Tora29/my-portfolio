import React from 'react'

const Hero = () => {
  return (
    <section className="relative h-[400px] flex items-center justify-end">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(12,13,21)] via-[rgb(23,24,32)] to-[rgb(108,95,62)]/20"></div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 mr-[100px] text-right">
        <h1 className="text-[rgb(199,195,187)] text-5xl md:text-6xl font-normal font-['Squada_One'] leading-tight mb-2">
          Tora29's Lab
        </h1>
        <p className="text-[rgb(199,195,187)] text-2xl md:text-3xl font-normal font-['Squada_One'] leading-tight">
          WEB ENGINEER
        </p>
      </div>
    </section>
  )
}

export default Hero
