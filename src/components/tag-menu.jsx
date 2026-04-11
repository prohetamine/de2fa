import { motion } from 'framer-motion'
import { Flex, LineVertical, SelectDot, SmallFont500, WhiteContainer } from './global'
import styled from 'styled-components'
import { useRef } from 'react'

const Button = styled(motion.div)`
  padding: 12px;
  font-size: 0px;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
`

const TagMenu = ({ tags, onSelectTag, selectTag }) => {
    const containerRef = useRef(null)

    const handleWheel = (e) => {
        e.preventDefault()
        containerRef.current.scrollLeft += e.deltaY
    }

    return (
        <WhiteContainer 
            ref={containerRef}
            onWheel={handleWheel}
            style={{ 
                maxWidth: '100%',
                boxSizing: 'border-box', 
                overflowX: 'scroll'
            }}
        >
            <Flex direction='row'>
                <Button onTap={() => onSelectTag('all')}>
                    <Flex direction='row'>
                        <SelectDot 
                            initial={{ scale: 0 }}
                            animate={{ scale: selectTag === 'all' ? 1 : 0 }}
                            exit={{ scale: 0 }}
                        />
                        <SmallFont500 style={{ color: 'var(--text-gray)', marginLeft: selectTag === 'all' ? '6px' : '0px'  }}>All</SmallFont500>
                    </Flex>
                </Button>
                <LineVertical style={{ height: '12px' }} />
                {
                    tags.map((tag, key) => (
                        <Flex key={key} direction='row'>
                            <Button 
                                onTap={() => onSelectTag(tag)}
                            >
                                <Flex direction='row'>
                                    <SelectDot 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: selectTag === tag ? 1 : 0 }}
                                        exit={{ scale: 0 }}
                                    />
                                    <SmallFont500 style={{ color: 'var(--text-gray)', marginLeft: selectTag === tag ? '6px' : '0px' }}>{tag[0]?.toUpperCase() || 'Empty'}{tag.slice(1)}</SmallFont500>
                                </Flex>
                            </Button>
                            {
                                tags.length - 1 !== key && (<LineVertical style={{ height: '12px' }} />)
                            }
                        </Flex>
                    ))
                }
            </Flex>
        </WhiteContainer>
    )
}

export default TagMenu