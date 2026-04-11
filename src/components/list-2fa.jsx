/* eslint-disable no-unused-vars */
import useWindowSize from '@rooks/use-window-size'
import { useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { generate } from 'otplib'
import ContentLoader from 'react-content-loader'
import copy from 'copy-to-clipboard'
import { List, WindowScroller } from 'react-virtualized'
import { Flex, NormalFont600, NormalFont500, WhiteContainer, BigFont700, SmallFont500 } from './global'
import { Notify } from './notify'
import CircleClock from './circle-clock'
import DomainIcon from './domain-icon'
import ItemMenu from './item-menu'

import iconCopy from './../assets/icon/code.svg?react'
import iconProfile from './../assets/icon/profile.svg?react'

const WrapperItem = styled(motion.div)`
  height: 100px;
  width: 100%;
  position: relative;
`

const Item = ({ data, onEditProfile, onEdit, onDelete, onEdit2fa, isEdit2fa, isVisible }) => {
  const [code, setCode] = useState(null)
      , [interval, updateInterval] = useState(30)

  const notify = useContext(Notify)

  const { innerWidth } = useWindowSize()
      , width = innerWidth > 370 ? 370 : innerWidth

  useEffect(() => {
    if (data.secret) {
      const intervalId = setInterval(async () => {
        try {
          const token = await generate({ secret: data.secret })
              , remaining = 30 - (Math.floor(Date.now() / 1000) % 30)

          setCode(token)  
          updateInterval(remaining)
        } catch (err) {
          console.log(err)
          setCode('Err')  
          updateInterval(0)
        }
      }, 1000)
      
      return () => clearInterval(intervalId) 
    }
  }, [data.secret])

  return data.type === 'profile' 
            ? (
              <NormalFont600 
                onTap={onEditProfile}
                whileTap={{ scale: 0.9 }}
                style={{ 
                  color: 'var(--text-gray)'
                }}
              >{data.name}</NormalFont600>
            )
            : (
              <WrapperItem>
                <WhiteContainer 
                  style={{ 
                    maxHeight: '100px', 
                    height: '100px', 
                    position: 'relative', 
                    boxSizing: 'border-box', 
                    zIndex: 1 
                  }} 
                  animate={{ x: code && isVisible && isEdit2fa ? -136 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onTap={onEdit2fa}
                >
                  {
                    code && isVisible
                      ? (
                        <Flex 
                          padding='16px' 
                          justify='space-between' 
                          direction='row'
                          style={{
                            boxSizing: 'border-box', 
                            height: '100%'
                          }}
                        >
                          <Flex gap='16px' direction='row'
                            style={{ 
                              width: 'calc(100% - 48px - 16px)' 
                            }}
                          >
                            <DomainIcon 
                              domain={data.domain} 
                              symbol={data.title[0]} 
                            />
                            <Flex 
                              gap='0px' 
                              align='flex-start'
                              style={{ width: 'calc(100% - 48px - 16px)' }}
                            >
                              <NormalFont500 
                                style={{ 
                                  color: 'var(--text-gray)',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >{data.title}</NormalFont500>
                              <BigFont700 
                                onTap={() => {
                                  copy(code)
                                  notify({ content: `Copied code: ${code}`, icon: iconCopy })
                                }}
                                whileTap={{ scale: 0.9 }}
                                propagate={{ tap: false }}
                                style={{ 
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >{code.slice(0, 3)} {code.slice(3, 6)}</BigFont700>
                              <SmallFont500 
                                onTap={() => {
                                  copy(data.username)
                                  notify({ content: `Copied: ${data.username}`, icon: iconProfile })
                                }}
                                whileTap={{ scale: 0.9 }}
                                propagate={{ tap: false }}
                                style={{ 
                                  color: 'var(--text-light)',
                                  cursor: 'pointer',
                                  wordBreak: 'break-word',
                                  maxWidth: '100%',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >{data.username}</SmallFont500>
                            </Flex>
                          </Flex>
                          <CircleClock second={interval} />
                        </Flex>
                      ) 
                      : (
                        <ContentLoader
                          speed={2}
                          width={width}
                          height={100}
                          viewBox={`0 0 ${width} 100`}
                          backgroundColor='var(--interface-color-second)'
                          foregroundColor='var(--interface-background-second)'
                        >
                          {
                            width > 310 && (
                              <circle cx={width - 65} cy='48' r='20' />
                            ) 
                          }
                          <rect x='16' y='22' rx='8' ry='8' width='56' height='56' /> 
                          <rect x='87' y='18' rx='5' ry='5' width='90' height='18' />
                          <rect x='87' y='40' rx='5' ry='5' width='130' height='25' />
                          <rect x='87' y='70' rx='5' ry='5' width='70' height='15' />
                        </ContentLoader>
                      )
                  }
                </WhiteContainer>
                <ItemMenu 
                  onEdit={() => {
                    onEdit()
                    onEdit2fa()
                  }}
                  onDelete={() => {
                    onDelete()
                    onEdit2fa()
                  }}
                />
              </WrapperItem>
            )
}

const List2FA = ({ items, onEditProfile, onEdit, onDelete }) => {
  const { innerWidth } = useWindowSize()
        , width = innerWidth > 370 ? 370 : innerWidth

  const [edit2fa, setEdit2fa] = useState(-1)

  // fix rerender react-virtualized
  const key = useMemo(() => 
    JSON.stringify(items)
  , [items])

  return (
    <WindowScroller>
    {
      ({ height, isScrolling, onChildScroll, scrollTop }) => (
        <List
          key={key}
          autoHeight
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          scrollTop={scrollTop}
          width={innerWidth}
          rowCount={items.length}
          rowHeight={
            ({ index }) => 
              items[index].type === 'profile' 
                ? 32 
                : 112
          }
          rowRenderer={
            ({ key, index, isVisible, style }) => {
              const item = items[index]

              return (
                <Flex 
                  align='center' 
                  key={key} 
                  style={style}
                >
                  <Flex 
                    align='flex-start' 
                    style={{ 
                      maxWidth: `${width}px`, 
                      width: '100%', 
                      padding: '0px 12px', 
                      boxSizing: 'border-box', 
                      userSelect: 'none' 
                    }}
                  >
                    <Item 
                        data={item} 
                        onEditProfile={() => onEditProfile(item)}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                        onEdit2fa={() => setEdit2fa(_index => _index !== index ? index : -1)}
                        isEdit2fa={edit2fa === index}
                        isVisible={isVisible} 
                    />
                  </Flex>
                </Flex>
              )
            }
          }
        />
      )
    }
    </WindowScroller>
  )
}

export default List2FA