import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

/**
 * パーティクル背景コンポーネント
 * Canvas上にアニメーションするパーティクルを描画し、マウスとの相互作用を提供する
 *
 * @returns {JSX.Element} パーティクル背景を含むReactコンポーネント
 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Canvas サイズ管理
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /**
     * Canvasのサイズをウィンドウサイズに合わせて調整する
     *
     * @returns {void}
     */
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // パーティクル初期化
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
  }, [])

  // マウストラッキング
  useEffect(() => {
    /**
     * マウス移動イベントのハンドラー
     * マウスの現在位置を記録する（スクロール位置を考慮）
     *
     * @param {MouseEvent} e - マウスイベントオブジェクト
     * @returns {void}
     */
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // アニメーションループ
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /**
     * パーティクルのアニメーションループ
     * パーティクルの移動、マウスとの相互作用、描画、線の接続を処理する
     *
     * @returns {void}
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        // パーティクルの移動
        particle.x += particle.vx
        particle.y += particle.vy

        // 画面端の処理
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // マウスとの相互作用
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          particle.x -= (dx / distance) * force * 2
          particle.y -= (dy / distance) * force * 2
        }

        // パーティクルの描画
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(199, 195, 187, ${particle.opacity})`
        ctx.fill()

        // 近くのパーティクルを線で結ぶ
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(199, 195, 187, ${0.1 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none z-[5]"
      style={{ height: '100%' }}
    />
  )
}

export default ParticleBackground
