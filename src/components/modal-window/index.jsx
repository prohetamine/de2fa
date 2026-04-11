/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'
import { Flex, WhiteContainer } from '../global'
import styled from 'styled-components'
import { AddEntryPayRequest, Create2FaEntry, CreateProfile, Decrypt, DeleteEntry, Edit2FaEntry, EditProfile, InvalidPassword, TransactionFailed } from './windows'

export const ModalWindowContext = createContext(null)

const ShadowBody = styled(Flex)`
  padding: 0px 12px; 
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: fixed;
  z-index: 99999;
  justify-content: center;
  background: rgba(56, 56, 56, 0.47); 
`

const WINDOWS = {
  'EditProfile': EditProfile,
  'CreateProfile': CreateProfile,
  'TransactionFailed': TransactionFailed,
  'DeleteEntry': DeleteEntry,
  'AddEntryPayRequest': AddEntryPayRequest,
  'Decrypt': Decrypt,
  'InvalidPassword': InvalidPassword,
  'Create2FaEntry': Create2FaEntry,
  'Edit2FaEntry': Edit2FaEntry
}

export const ModalWindowProvider = ({ children }) => {
  const [_window, setWindow] = useState(null)
  
  const showModalWindow = (type, { value = [] } = { value: [] }) => {
    return new Promise(resolve => {
      setWindow({
        type,
        value,
        onData: (response, ...args) => {
          resolve([response, ...args])  
          setWindow(null)
        }
      })
    })
  }

  const Component = WINDOWS[_window?.type]

  return (
    <ModalWindowContext.Provider value={showModalWindow}> 
      {
        _window && (
          <ShadowBody>
            <WhiteContainer style={{ padding: '28px', maxWidth: '334px', width: '100%', boxSizing: 'border-box' }}>
              {
                <Component 
                  onData={_window.onData} 
                  value={_window.value} 
                />
              }
            </WhiteContainer>   
          </ShadowBody> 
        )
      }
      {children}
    </ModalWindowContext.Provider>
  )
}