/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import useWindowSize from '@rooks/use-window-size'
import { BigFont700, Flex, NormalFont500 } from './global'
import * as Redstone from '@prohetamine/redstone'
//import * as Redstone from '/Users/stas/Desktop/redstone'
import arrowTip1 from './../assets/icon/tip-1.svg?react'
import arrowTip2 from './../assets/icon/tip-2.svg?react'
import mainLogo from './../assets/main-logo.gif?inline'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import styled from 'styled-components'

const ArrowTip = motion(
  forwardRef(({ src: Icon, style, ...props }, ref) => (
    <Icon
      ref={ref}
      style={{ 
        outline: 'none',
        ...style 
      }}
      {...props}
    />
  ))
)

const Logo = styled.img`
    width: 200px;
    height: 200px;
    pointer-events: none; 
    user-select: none;
    -webkit-user-drag: none;
`

const FakeLink = styled(NormalFont500)`
    text-decoration: underline;
    text-decoration-skip-ink: none;
    color: var(--text-gray);
    user-select: none;
    cursor: pointer;

    &:hover {
        color: var(--interface-color-primary);
    }
`

const Tips = () => {
    const { innerWidth, innerHeight } = useWindowSize()
        , width = innerWidth > 370 ? 370 : innerWidth

    const { isConnected } = Redstone.useApp()

    return (
        <Flex 
            gap='12px' 
            align='flex-end' 
            style={{
                padding: '0px 12px', 
                maxWidth: `${width}px`, 
                width: '100%', 
                height: 'calc(100vh - 74px)',
                boxSizing: 'border-box',
                position: 'relative'
            }}
        >   
            {
                isConnected 
                    ? (
                        <Flex
                            style={{
                                width: '100%',
                                position: 'absolute',
                                right: '0px',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <ArrowTip 
                                src={arrowTip1} 
                                style={{
                                    position: 'absolute',
                                    right: '175px',
                                    width: '43px',
                                    height: '112px', 
                                }}
                            />
                            <BigFont700 
                                style={{ 
                                    position: 'absolute', 
                                    right: '40px',
                                    top: '92px',
                                    color: 'var(--interface-color-primary)' 
                                }}
                            >Add entry</BigFont700>
                        </Flex>
                    )
                    : (
                        <Flex
                            style={{
                                width: '100%',
                                position: 'absolute',
                                right: '0px',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <ArrowTip 
                                src={arrowTip2} 
                                style={{
                                    position: 'absolute',
                                    right: '30px',
                                    width: '47px',
                                    height: '112px', 
                                }}
                            />
                            <BigFont700 
                                style={{ 
                                    position: 'absolute', 
                                    right: '90px',
                                    top: '92px',
                                    color: 'var(--interface-color-primary)' 
                                }}
                            >Connect wallet</BigFont700>
                        </Flex>
                    )
            }
            {
                innerHeight > 520 
                    ? (
                        <Flex justify='center' style={{ width: '100%', height: 'calc(100vh - 74px)' }}>
                            <Logo src={mainLogo} alt="" />
                            <Flex direction='row' gap='6px' style={{ flexWrap: 'wrap', maxWidth: '200px', justifyContent: 'center' }}>
                                <FakeLink onTap={() => window.open('https://prohetamine.ru/web3', '_blank')}>prohetamine.ru/web3</FakeLink>
                                <FakeLink onTap={() => window.open('https://github.com/prohetamine/de2fa', '_blank')}>GitHub</FakeLink>
                                <FakeLink onTap={() => window.open('https://github.com/prohetamine/redstone', '_blank')}>Redstone</FakeLink>
                            </Flex>
                        </Flex>
                    )
                    : null
            }
        </Flex>
    )
}

export default Tips