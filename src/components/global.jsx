/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import styled from 'styled-components'

export const Flex = styled(motion.div)`
    display: flex;
    flex-direction: ${props => props.direction || 'column'};
    justify-content: ${props => props.justify || 'flex-start'};
    align-items: ${props => props.align || 'center'};
    gap: ${props => props.gap || '0px'};
    padding: ${props => props.padding || '0px'};
`

export const Icon = motion(
  forwardRef(({ src: Icon, style, ...props }, ref) => (
    <Icon
      ref={ref}
      style={{ 
        width: '24px', 
        height: '24px', 
        minWidth: '24px', 
        minHeight: '24px', 
        outline: 'none', 
        ...style 
      }}
      {...props}
    />
  ))
)

export const WhiteContainer = styled(motion.div)`
  border: 1px solid var(--interface-dark-background-border);
  box-shadow: 0 2px 6px 0 var(--interface-shadow);
  background: var(--interface-background-primary);
  border-radius: 14px;
`

export const SelectDot = styled(motion.div)`
  border-radius: 14px;
  width: 6px;
  height: 6px;
  background: var(--interface-color-primary);
`

export const LineVertical = styled.div`
  background: var(--interface-dark-background-border);
  border-radius: 100px;
  width: 1px;
  height: 24px;
`

export const LineHorizontal = styled.div`
  background: var(--interface-dark-background-border);
  border-radius: 100px;
  width: 100%;
  height: 1px;
`

const FontFamily = styled(motion.div)`
  font-family: var(--font-family);
`

const SecondFamily = styled(motion.div)`
  font-family: var(--second-family);
`

const ExtraBigFont = styled(FontFamily)`
  font-size: 30px;
`

const BigFont = styled(SecondFamily)`
  font-size: 24px;
`

const NormalFont = styled(FontFamily)`
  font-size: 16px;
`

const SmallFont = styled(FontFamily)`
  font-size: 14px;
`

const NanoFont = styled(FontFamily)`
  font-size: 12px;
`


export const ExtraBigFont700 = styled(ExtraBigFont)`
    font-weight: 700;
`

/// ...

export const BigFont700 = styled(BigFont)`
    font-weight: 700;
`

/// ...

export const NormalFont600 = styled(NormalFont)`
    font-weight: 600;
`

export const NormalFont500 = styled(NormalFont)`
    font-weight: 500;
`

/// ...

export const SmallFont500 = styled(SmallFont)`
    font-weight: 500;
`

/// ...

export const NanoFont700 = styled(NanoFont)`
  font-weight: 700;
`

export const NanoFont500 = styled(NanoFont)`
  font-weight: 500;
`