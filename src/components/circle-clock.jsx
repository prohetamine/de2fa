import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { NanoFont700 } from './global'

const Canvas = styled.canvas``

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 5px;
`

const CircleClock = ({ second }) => {
  const canvasRef = useRef()
      , secondRef = useRef(second)
      , [ctx, setCtx] = useState(null)
      
  useEffect(() => {
    secondRef.current = second
  }, [second])

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      const ctx = canvas.getContext('2d')
      setCtx(ctx)      
    }
  }, [canvasRef])

  useEffect(() => {
    if (ctx) {
      const size = 48

      const centerX = size / 2
          , centerY = size / 2
          , radius = 20;

      const particles = []
          , maxParticles = 200

      function createParticle(angle) {
        const size = Math.random() * 1 + 0.4
            , alpha = Math.random() * 0.5 + 0.3

        const speed = Math.random() * 0.05 + 0.05
            , vx = (Math.random() - 0.5) * speed
            , vy = -Math.random() * speed * 0.1

        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            vx,
            vy,
            size,
            alpha,
            decay: Math.random() * 0.01 + 0.005
        }
      }

      const darkBackgroundBorder = getComputedStyle(document.documentElement)
                      .getPropertyValue('--interface-dark-background-border')
                      .trim()

      const colorPrimary = getComputedStyle(document.documentElement)
                .getPropertyValue('--interface-color-primary')
                .trim()

      const draw = progress => {
        ctx.clearRect(0, 0, size, size)
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = darkBackgroundBorder
        ctx.lineWidth = 3
        ctx.stroke()

        const startAngle = -Math.PI / 2
        const endAngle = startAngle + 2 * Math.PI * progress

        if (progress > 0) {
            for (let i = 0; i < 3; i++) {
                if (particles.length < maxParticles) {
                    particles.push(createParticle(endAngle))
                }
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.x += p.vx
            p.y += p.vy
            p.alpha -= p.decay
            p.size += 0.001

            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha.toFixed(2)})`
            ctx.fill()

            if (p.alpha <= 0) particles.splice(i, 1)
        }

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
        ctx.strokeStyle = colorPrimary
        ctx.lineWidth = 3
        ctx.stroke()
      }

      const intervalId = setInterval(() => {
        const progress = secondRef.current / 30
        if (secondRef.current) {
          secondRef.current -= 0.01
        }
        draw(progress)
      }, 10)

      return () => clearInterval(intervalId)
    }
  }, [ctx])

  return (
    <Wrapper>
      <Canvas ref={canvasRef} width='48' height='48'></Canvas>
      <NanoFont700 style={{ color: 'var(--text-primary)', position: 'absolute' }}>{second}s</NanoFont700>
    </Wrapper>
  )
}

export default CircleClock