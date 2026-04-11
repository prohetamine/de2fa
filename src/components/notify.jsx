/* eslint-disable react-refresh/only-export-components */
import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Icon, NormalFont600 } from './global'
import useWindowSize from '@rooks/use-window-size'

export const Notify = createContext(null)

const Body = styled(motion.div)`
  position: fixed;
  bottom: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 999;
  user-select: none;
`

const Containter = styled(motion.div)`
  border-radius: 100px;
  padding: 16px 28px;
  box-shadow: 0 2px 6px 0 var(--interface-shadow);
  background: var(--interface-color-second);
  border: 1px solid var(--interface-background-border);
`

const NotifyItem = ({ data }) => {
  const [hide, setHide] = useState(false)
  const { innerWidth } = useWindowSize()

  useEffect(() => {
    const timeId = setTimeout(() => {
      setHide(true)
    }, 2000)

    return () => clearTimeout(timeId)
  }, [])

  return (
    <AnimatePresence>
      {
        !hide && (
          <Containter
            onTap={() => setHide(true)}
            initial={{ opacity: 0, y: 10, marginTop: 0 }}
            animate={{ opacity: 1, y: 0, marginTop: 10 }}
            exit={{ opacity: 0, y: -10, marginTop: 0 }}
          > 
            <Flex gap='12px' direction='row'>
              {
                data.icon && (
                  <Icon src={data.icon} />
                )
              }
              <NormalFont600 
                style={{
                  color: 'var(--interface-color-primary)',
                  wordBreak: 'break-word',
                  maxWidth: innerWidth < 300 ? `${innerWidth - 120}px` : `230px`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {data.content}
              </NormalFont600>
            </Flex>
          </Containter>
        )
      }
    </AnimatePresence>
  )
}


export const NotifyProvider = ({ children }) => {
  const [notify, setNotify] = useState([])

  return (
    <Notify.Provider 
      value={
        notify => 
          setNotify(
            s => [
              ...s,
              notify
            ]
          )
      }
    > 
      <Body>
        <AnimatePresence>
        {
          notify.map((data, key) => (
            <NotifyItem key={key} data={data} />
          ))
        }
        </AnimatePresence>
      </Body>
      {children}
    </Notify.Provider>
  )
}
