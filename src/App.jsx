import useWindowSize from '@rooks/use-window-size'
import { useContext, useEffect, useState } from 'react'
import sleep from 'sleep-promise'
import { useStasPay } from 'stas-pay'
import * as Redstone from '@prohetamine/redstone'
//import * as Redstone from '/Users/stas/Desktop/redstone'
import { Flex } from './components/global'
import NavigationMenu from './components/navigation-menu'
import Logo from './components/logo'
import TagMenu from './components/tag-menu'
import useDecryptAndLogic from './lib/use-decrypt-and-logic'
import List2FA from './components/list-2fa'
import { ModalWindowContext } from './components/modal-window'
import { encrypt } from './lib/encrypt-decrypt'
import Loader from './components/loader'
import { useLocalStorage } from 'usehooks-ts'
import Tips from './components/tips'

const App = () => {
  const { innerWidth } = useWindowSize()
      , width = innerWidth > 370 ? 370 : innerWidth

  const showModalWindow = useContext(ModalWindowContext)

  const [selectProfile, setSelectProfile] = useState(-1)
      , [selectTag, setSelectTag] = useState('all')
      , [loading, setLoading] = useState(false)

  const { isConnected } = Redstone.useApp()
      , profilesList = Redstone.useList('profiles', { self: true, watch: false, load: isConnected })
      , slotsList = Redstone.useList('slot', { self: true, watch: false, load: isConnected })
      , slotsCount = Redstone.useCounter('slots-count', { 
          self: true, 
          watch: false, 
          load: isConnected, 
          stas: true,
          paymentAddress: '0xbcfA1b80C39F9a378b12b257934BE409Bc93eC60'
        })
      , cert = Redstone.useCertificate(`slots-count`, { load: isConnected, paymentAddress: '0xbcfA1b80C39F9a378b12b257934BE409Bc93eC60' })
      , confirm = useStasPay()

  /*window.cert = async () => {
    const commission = await cert.getCommission()
        , isConfirm = await confirm(commission)
    
    if (isConfirm) {
      await cert.updateValue(100)
    }
  }*/

  const [passwordStorage, setPasswordStorage] = useLocalStorage('pwd', '')
      , [isLogoutWithReload] = useLocalStorage('lwr', true)    
      , [password, setPassword] = useState(null)

  useEffect(() => {
    if (!isLogoutWithReload && passwordStorage) {
      setPassword(passwordStorage)
    }
  }, [isLogoutWithReload, passwordStorage])

  const {
    visibleProfiles,
    profiles,
    tags,
    items,
    isError,
    isDecrypt
  } = useDecryptAndLogic(
    slotsList.value, 
    profilesList.value, 
    password, 
    selectProfile, 
    selectTag
  )

  const freeSlots = 15
      , allowSlotsCount = slotsCount.value.count + freeSlots
      , isRequirePay = allowSlotsCount <= items.filter(item => item.type === 'item').length

  const isLoaded = (
    (
      items.length > 0 || 
      slotsList.status === 'success' && 
      profilesList.status === 'success'
    ) && 
    (items.length > 0 || isDecrypt) &&
    !loading
  ) || !isConnected

  useEffect(() => {
    if (!password && isConnected) {
      const timeId = setTimeout(async () => {
        if (passwordStorage) {
          setPassword(passwordStorage)
          return
        }

        const [, password, isLogoutWithReload] = await showModalWindow('Decrypt')

        if (!isLogoutWithReload) {
          setPasswordStorage(password)
        } else {
          setPassword(password)
        }
      }, 100)

      return () => clearTimeout(timeId)
    }
  }, [password, isConnected])

  useEffect(() => {
    if (isError && password && isDecrypt) {
      const timeId = setTimeout(async () => {
        
        const [isRetry] = await showModalWindow('InvalidPassword')
        if (isRetry) {
          setPasswordStorage('')
          setPassword(null)
        }
      }, 100)

      return () => clearTimeout(timeId)
    }
  }, [password, isError, isDecrypt])
  
  return (
    <Flex>
      <Flex gap='12px' padding='12px' align='flex-start' style={{ maxWidth: `${width}px`, width: '100%', boxSizing: 'border-box' }}>
        <Flex gap='12px' justify='space-between' direction='row' style={{ width: '100%' }}>
          <Logo onTap={() => setSelectProfile(-1)} />
          <NavigationMenu 
            profiles={visibleProfiles}
            selectProfile={selectProfile}
            onSelectProfile={index => setSelectProfile(index)}
            onLock={() => {
              setPasswordStorage('')
              setPassword(null)
            }}
            onAddSlot={async () => {
              if (isRequirePay) {
                const [isAdd] = await showModalWindow('AddEntryPayRequest', {
                  value: [allowSlotsCount]
                })

                if (isAdd) {
                  if (cert.value === 0) {
                    const commission = await cert.getCommission()
                        , isConfirm = await confirm(commission)
                    
                    if (isConfirm) {
                      for (;;) {
                        const isCertified = await cert.updateValue(100)
                        if (!isCertified) {
                          const [isRetry] = await showModalWindow('TransactionFailed')
                          
                          if (!isRetry) {
                            break
                          }
                        } else {
                          break
                        }
                      }
                    }
                    return
                  }

                  for (;;) {
                    const commission = await slotsCount.getCommission()
                        , isConfirm = await confirm(commission)

                    if (isConfirm) {
                      const isUpdate = await slotsCount.updateValue()
                      if (!isUpdate) {
                        const [isRetry] = await showModalWindow('TransactionFailed')
                        
                        if (!isRetry) {
                          break
                        }
                      } else {
                        const [isCreate, ...data] = await showModalWindow('Create2FaEntry', {
                          value: [profiles]
                        })

                        if (isCreate) {
                          for (;;) {
                            setLoading(true)
                            await sleep(100)
                            const encrypted = await encrypt(JSON.stringify(data), password)
                            const isUpdate = await slotsList.addValue(encrypted)
                            setLoading(false)
                            if (!isUpdate) {
                              const [isRetry] = await showModalWindow('TransactionFailed')
                              
                              if (!isRetry) {
                                break
                              }
                            } else {
                              break
                            }
                          }
                        }
                        break
                      }
                    } else {
                      const [isRetry] = await showModalWindow('TransactionFailed')
                        
                      if (!isRetry) {
                        break
                      }
                    }
                  }
                }
                return
              }

              const [isCreate, ...data] = await showModalWindow('Create2FaEntry', {
                value: [profiles]
              })

              if (isCreate) {
                for (;;) {
                  setLoading(true)
                  await sleep(100)
                  const encrypted = await encrypt(JSON.stringify(data), password)
                  const isUpdate = await slotsList.addValue(encrypted)
                  setLoading(false)
                  if (!isUpdate) {
                    const [isRetry] = await showModalWindow('TransactionFailed')
                    
                    if (!isRetry) {
                      break
                    }
                  } else {
                    break
                  }
                }
              }
            }}
            onAddProfile={async () => {
              const [isAdd, name] = await showModalWindow('CreateProfile')
              
              if (isAdd) {
                for (;;) {
                  setLoading(true)
                  await sleep(100)
                  const encrypted = await encrypt(name, password)
                  const isUpdate = await profilesList.addValue(encrypted)
                  setLoading(false)
                  if (!isUpdate) {
                    const [isRetry] = await showModalWindow('TransactionFailed')
                    
                    if (!isRetry) {
                      break
                    }
                  } else {
                    break
                  }
                }
              }
            }}
          />
        </Flex>
        {
          isLoaded && tags.length > 0 && (
            <TagMenu
              tags={tags}
              selectTag={selectTag}
              onSelectTag={tag => setSelectTag(tag)}
            />
          )
        }
      </Flex>
      {
        isLoaded 
          ? (
            <List2FA 
              items={items} 
              onEditProfile={async profile => {
                const [isEdit, newName] = await showModalWindow('EditProfile', {
                  value: [profile.name]
                })

                if (isEdit) {
                  for (;;) {
                    setLoading(true)
                    await sleep(100)
                    const encrypted = await encrypt(newName, password)
                    const isUpdate = await profilesList.updateValue(profile, encrypted)
                    setLoading(false)
                    if (!isUpdate) {
                      const [isRetry] = await showModalWindow('TransactionFailed')
                      
                      if (!isRetry) {
                        break
                      }
                    } else {
                      break
                    }
                  }
                }
              }}
              onEdit={async ({ profile, title, domain, username, secret, chainId, index }) => {
                const [isCreate, ...data] = await showModalWindow('Edit2FaEntry', {
                  value: [profiles, profile, title, domain, username, secret]
                })

                if (isCreate) {
                  for (;;) {
                    setLoading(true)
                    await sleep(100)
                    const encrypted = await encrypt(JSON.stringify(data), password)
                    const isUpdate = await slotsList.updateValue({ chainId, index }, encrypted)
                    setLoading(false)
                    if (!isUpdate) {
                      const [isRetry] = await showModalWindow('TransactionFailed')
                      
                      if (!isRetry) {
                        break
                      }
                    } else {
                      break
                    }
                  }
                }
              }}
              onDelete={async slot => {
                const [isDelete] = await showModalWindow('DeleteEntry')

                if (isDelete) {
                  for (;;) {
                    setLoading(true)
                    await sleep(100)
                    const isDelete = await slotsList.updateValue(slot, '')
                    setLoading(false)
                    if (!isDelete) {
                      const [isRetry] = await showModalWindow('TransactionFailed')
                        
                      if (!isRetry) {
                        break
                      }
                    } else {
                      break
                    }
                  }
                }
              }}
            />
          )
          : (
            <Loader />
          )
      }
      {
        (
          (isLoaded && items.length === 0) || 
          !isConnected
        ) && <Tips />
      }
    </Flex>
  )
}

export default App