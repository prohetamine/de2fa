import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import * as Redstone from '@prohetamine/redstone'

import { Flex, Icon, LineHorizontal, LineVertical, NormalFont500, SelectDot, WhiteContainer } from './global'
import iconPlus from './../assets/icon/plus.svg?react'
import iconProfiles from './../assets/icon/profiles.svg?react'
import iconProfile from './../assets/icon/profile.svg?react'
import iconAddProfile from './../assets/icon/add-profile.svg?react'
import iconLock from './../assets/icon/lock.svg?react'
import iconWallet from './../assets/icon/wallet.svg?react'

const IconButton = styled(motion.div)`
  padding: 12px;
  font-size: 0px;
  cursor: pointer;
  box-sizing: border-box;
`

const ContextMenuButton = styled(motion.div)`
  padding: 12px 16px;
  font-size: 0px;
  cursor: pointer;
  box-sizing: border-box;
`

const Wrapper = styled.div`
  position: relative;
  z-index: 9999;
  user-select: none;
`

const NavigationMenu = ({ profiles, selectProfile, onSelectProfile, onAddSlot, onAddProfile, onLock }) => {
  const [showProfile, setShowProfile] = useState(false)
  const { open } = Redstone.useApp()

  return (
    <Wrapper>
      <WhiteContainer>
        <Flex direction='row'>
          <IconButton
            whileTap={{ scale: 0.9 }}
            onTap={onAddSlot}
          >
            <Icon src={iconPlus} />
          </IconButton>
          <IconButton
            whileTap={{ scale: 0.9 }}
            onTap={() => setShowProfile(s => !s)}
          >
            <Icon src={selectProfile === -1 ? iconProfiles : iconProfile} />
          </IconButton>
          <IconButton
            whileTap={{ scale: 0.9 }}
            onTap={onLock}
          >
            <Icon src={iconLock} />
          </IconButton>
          <Flex>
            <LineVertical />
          </Flex>
          <IconButton
            whileTap={{ scale: 0.9 }}
            onTap={() => open()}
          >
            <Icon src={iconWallet} />
          </IconButton>
        </Flex>
      </WhiteContainer>
      <AnimatePresence>
        {
          showProfile && (
              <WhiteContainer 
                style={{ position: 'absolute', right: '97px', top: '56px', minWidth: '170px', maxWidth: '200px', color: 'var(--text-gray)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}        
              >
                {
                  profiles.length > 1 && (
                    <>
                      <SelectDot style={{ position: 'absolute', top: `calc(((${selectProfile + 1} + 1) * 48px - 3px) - 24px)`, left: '16px', zIndex: 999 }} />
                      <ContextMenuButton
                        onTap={() => {
                          onSelectProfile(-1)
                          setShowProfile(false)
                        }}
                      >
                        <Flex justify='space-between' direction='row' style={{ width: '100%' }}>
                          <Flex style={{ paddingLeft: '12px' }}>
                            <NormalFont500>All</NormalFont500>
                          </Flex>
                          <Icon src={iconProfiles} />
                        </Flex>
                      </ContextMenuButton>
                      <Flex style={{ padding: '0px 16px 0px 28px' }}>
                        <LineHorizontal />
                      </Flex>     
                    </>
                  )
                }
                {
                  profiles.length > 1 && profiles.map(profile => (
                    <ContextMenuButton 
                      key={profile.index}
                      onTap={() => {
                        onSelectProfile(profile.index)
                        setShowProfile(false)
                      }}
                    >
                      <Flex justify='space-between' direction='row' style={{ width: '100%' }} gap='12px'>
                        <Flex style={{ paddingLeft: '12px' }}>
                          <NormalFont500
                            style={{
                              textAlign: 'start',
                              wordBreak: 'break-word',
                              maxWidth: '120px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >{profile.name}</NormalFont500>
                        </Flex>
                        <Icon src={iconProfile} />
                      </Flex>
                    </ContextMenuButton>
                  ))
                }
                {
                  profiles.length > 1 && (
                    <Flex style={{ padding: '0px 16px 0px 28px' }}>
                      <LineHorizontal />
                    </Flex>
                  )
                }
                <ContextMenuButton
                  onTap={() => {
                    onAddProfile()
                    setShowProfile(false)
                  }}
                >
                  <Flex justify='space-between' direction='row' style={{ width: '100%' }}>
                    <Flex style={{ paddingLeft: '12px' }}>
                      <NormalFont500>Add profile</NormalFont500>
                    </Flex>
                    <Icon src={iconAddProfile} />
                  </Flex>
                </ContextMenuButton>
              </WhiteContainer>
            )
        }
      </AnimatePresence>
    </Wrapper>
  )
}

export default NavigationMenu