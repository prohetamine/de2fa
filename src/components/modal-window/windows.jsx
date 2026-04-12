/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { Scanner } from '@yudiel/react-qr-scanner'
import styled from 'styled-components'
import { Flex, Icon, LineHorizontal, NanoFont700, NormalFont500, NormalFont600 } from '../global'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { generate } from 'otplib'
import * as OTPAuth from 'otpauth'
import { useLocalStorage } from 'usehooks-ts'
import iconUnlock from './../../assets/icon/unlock.svg?react'
import iconScan from './../../assets/icon/scan.svg?react'
import iconOk from './../../assets/icon/ok.svg?react'
import iconArrowDown from './../../assets/icon/arrow-down.svg?react'
import hashPassword from '../../lib/hash-password'

const Controll = styled(motion.div)`
    border: 1px solid var(--interface-dark-background-border);
    background: var(--interface-background-primary);
    border-radius: 8px;
    padding: 16px 12px;
    width: 100%;
    box-sizing: border-box;
`

const Input = styled.input`
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 16px;
    padding: 0px;
    color: var(--text-gray);
    border: none;
    outline: none;
    background: none;
    width: 100%;
    box-sizing: border-box;
    
    &::placeholder {
        color: var(--text-placeholder);
    }
`

const Textarea = styled.textarea`
    font-family: var(--font-family);
    font-weight: 500;
    font-size: 16px;
    color: var(--text-gray);
    border: none;
    outline: none;
    background: none;
    width: 100%;
    box-sizing: border-box;
    resize: none;
    height: 130px;
    
    &::placeholder {
        color: var(--text-placeholder);
    }
`

const Button = styled(motion.div)`
    border: 1px solid var(--interface-background-border);
    border-radius: 8px;
    padding: 12px 16px;
    background: var(--interface-color-second);
    cursor: pointer;
    user-select: none;
`

const CheckboxControll = styled.div`
    background: var(--interface-background-primary);
    border: 1px solid var(--interface-dark-background-border);
    border-radius: 8px;
    font-size: 0px;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const Wrapper = styled.div`
    height: 48px;
    width: 100%;
    position: relative;
    z-index: 99;
    user-select: none;
`

const Select = ({ items, value, onSelect }) => {
    const [isSelectSpread, setSelectSpread] = useState(false)

    return (
        <Wrapper>
            {
                isSelectSpread 
                    ? (
                        <Controll 
                            style={{ 
                                padding: '0px', 
                                overflowY: 'scroll', 
                                maxHeight: isSelectSpread ? '120px' : '48px',
                                position: 'absolute',
                                bottom: '0px'
                            }}
                        >
                            {
                                items.map(({ name, index }, key) => (
                                    <Flex key={key} >
                                        {
                                            items.length - 1 === key && <LineHorizontal style={{ width: `calc(100% - 28px)` }} />
                                        }
                                        <Flex 
                                            onTap={() => {
                                                onSelect(index)
                                                setSelectSpread(false)
                                            }}
                                            key={key} 
                                            padding={'0px 12px'} 
                                            style={{ height: '48px', width: '100%', boxSizing: 'border-box', cursor: 'pointer' }}
                                            direction='row' 
                                            justify='space-between'
                                        >
                                            <NormalFont500 style={{ color: 'var(--text-gray)', width: '100%' }}>{name}</NormalFont500>
                                        </Flex>
                                    </Flex>
                                ))
                            }
                        </Controll>
                    ) 
                    : (
                        <Controll 
                            style={{ 
                                padding: '0px', 
                                overflowY: 'scroll', 
                                cursor: 'pointer'
                            }} 
                            onTap={() => items.length > 1 && setSelectSpread(true)}
                        >
                            <Flex padding={'0px 12px'} style={{ height: '48px' }} direction='row' justify='space-between'>
                                <NormalFont500 style={{ color: 'var(--text-gray)' }}>{items.find(({ index }) => value === index)?.name || 'Based'}</NormalFont500>
                                {items.length > 1 && <Icon src={iconArrowDown} />}
                            </Flex>
                        </Controll>
                    )
            }
        </Wrapper>
    )
}

export const EditProfile = ({ value, onData }) => {
    const [name, setName] = useState(value[0])

    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Rename Profile</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>Update the profile name. This won’t affect linked accounts or data.</NormalFont500>
            </Flex>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NanoFont700 style={{ color: 'var(--text-light)' }}>Title</NanoFont700>
                <Controll>
                    <Input 
                        value={name} 
                        onChange={({ target: { value } }) => {
                            setName(value)
                        }}
                        placeholder='Stas, Prohetamine, etc...' 
                    />
                </Controll>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true, name)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Save</NormalFont600>
                </Button>
                <Button
                    onTap={() => onData(false, name)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const CreateProfile = ({ onData }) => {
    const [name, setName] = useState('')

    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Create Profile</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>Create a new profile to organize your accounts. No changes will be made to existing data.</NormalFont500>
            </Flex>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NanoFont700 style={{ color: 'var(--text-light)' }}>Title</NanoFont700>
                <Controll>
                    <Input 
                        value={name} 
                        onChange={({ target: { value } }) => {
                            setName(value)
                        }}
                        placeholder='Stas, Prohetamine, etc...' 
                    />
                </Controll>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true, name)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Save</NormalFont600>
                </Button>
                <Button
                    onTap={() => onData(false, name)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const TransactionFailed = ({ onData }) => {
    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Transaction Failed</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>The transaction wasn’t confirmed. Data has not been updated. Please try again.</NormalFont500>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Retry</NormalFont600>
                </Button>
                <Button
                    onTap={() => onData(false)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const DeleteEntry = ({ onData }) => {
    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Delete Entry</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>Are you sure you want to delete this 2FA entry? You won’t be able to generate codes for this account anymore.</NormalFont500>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Yes</NormalFont600>
                </Button>
                <Button
                    onTap={() => onData(false)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>No</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const AddEntryPayRequest = ({ onData, value }) => {
    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Upgrade Required</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>You can create up to <b>{value[0]}</b> entries. You’ve reached the limit. Delete an existing one or pay <b>10 $STAS</b> coin to add a new entry.</NormalFont500>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Yes</NormalFont600>
                </Button>
                <Button
                    onTap={() => onData(false)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>No</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const Decrypt = ({ onData }) => {
    const [password, setPassword] = useState('')
        , [isLogoutWithReload, setLogoutWithReload] = useLocalStorage('lwr', true)

    const handleDecrypt = async () => {
        const hashedPassword = await hashPassword(password)
        onData(true, hashedPassword, isLogoutWithReload)
    }

    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Unlock with Password</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>Make this password as long as possible. All encryption and decryption happen on the client side. Encrypted data is stored on the blockchain. The maximum password length is <b>4096</b> characters.</NormalFont500>
            </Flex>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NanoFont700 style={{ color: 'var(--text-light)' }}>Password</NanoFont700>
                <Controll>
                    <Textarea 
                        value={password} 
                        onChange={({ target: { value } }) => {
                            setPassword(value)
                        }}
                        placeholder='Pa$$\/\/0Яd0x00000helloC0ffee!River#Metal7Sky' 
                    />
                </Controll>
            </Flex>
            <Flex gap='12px' direction='row' onTap={() => setLogoutWithReload(s => !s)}>
                <NormalFont500 style={{ color: 'var(--text-gray)' }}>Log out after reloading the page</NormalFont500>
                <CheckboxControll>
                    {
                        isLogoutWithReload && <Icon src={iconOk}></Icon>
                    }
                </CheckboxControll>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={handleDecrypt}
                    whileTap={{ scale: 0.9 }}
                >
                    <Flex direction='row' gap='6px'>
                        <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Decrypt</NormalFont600>
                        <Icon src={iconUnlock} />
                    </Flex>
                </Button>
            </Flex>
        </Flex>
    )
}

export const InvalidPassword = ({ onData }) => {
    return (
        <Flex gap='12px'>
            <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                <NormalFont600 style={{ color: 'var(--text-gray)' }}>Invalid Password</NormalFont600>
                <NormalFont500 style={{ color: 'var(--text-light)' }}>The password you entered is incorrect. Please try again.</NormalFont500>
            </Flex>
            <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                <Button
                    onTap={() => onData(true)}
                    whileTap={{ scale: 0.9 }}
                >
                    <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Retry</NormalFont600>
                </Button>
            </Flex>
        </Flex>
    )
}

export const Create2FaEntry = ({ onData, value }) => {
    const [title, setTitle] = useState('')
        , [domain, setDomain] = useState('')
        , [account, setAccount] = useState('')
        , [secretKey, setSecretKey] = useState('')
        , [profile, setProfile] = useState(0)

    const [secretKeyError, setSecretKeyError] = useState(false)
        , [domainError, setDomainError] = useState(false)

    const [isShowQRCode, setShowQRCode] = useState(false)
        , [isQRCodeDetect, setQRCodeDetect] = useState(false)

    useEffect(() => {
        if (secretKey) {
            const timeId = setTimeout(async () => {
                try {
                    await generate({ secret: secretKey })
                    setSecretKeyError(false)
                } catch (e) {
                    setSecretKeyError(true)
                }
            }, 100)

            return () => clearTimeout(timeId)
        }
    }, [secretKey])

    useEffect(() => {
        if (domain) {
            const timeId = setTimeout(async () => {
                try {
                    new URL(domain)
                    setDomainError(false)
                } catch (e) {
                    setDomainError(true)
                }
            })

            return () => clearTimeout(timeId)
        } else {
            setDomainError(false)
        }
    }, [domain])

    return isShowQRCode 
                ? (
                    <Flex gap='12px'>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NormalFont600 style={{ color: 'var(--text-gray)' }}>QR-Code</NormalFont600>
                            <NormalFont500 style={{ color: 'var(--text-light)' }}>Point the camera at the QR code</NormalFont500>
                        </Flex>
                        <Controll style={{ padding: '0px', overflow: 'hidden', border: isQRCodeDetect ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                            <Scanner
                                onScan={detectedCodes => {
                                    const [data = false] = detectedCodes.map(code => {
                                        try {
                                            const { issuer = '', label = '' } = OTPAuth.URI.parse(`otpauth://totp/Reddit:Adventurous_Dot1008?issuer=Reddit&secret=NH4TZSFEMC3JH7FM6VLJSUO6COATK5KB`)
                                                , url = new URL(code.rawValue)
                                                , secret = url.searchParams.get('secret')
                                            
                                            return {
                                                secret,
                                                issuer, 
                                                label
                                            }
                                        } catch (e) {
                                            return false
                                        }
                                    }).filter(f => f)

                                    if (data) {
                                        const { 
                                            secret,
                                            issuer, 
                                            label
                                        } = data

                                        if (issuer && title.length === 0) {
                                            setTitle(issuer)
                                        }

                                        if (label && account.length === 0) {
                                            setAccount(label)
                                        }

                                        setSecretKey(secret)
                                        setShowQRCode(false)
                                    }
                                }}
                                onError={(error) => console.log(error?.message)}
                                sound={false}
                                components={{
                                    finder: false,
                                    tracker: detectedCodes => {
                                        setQRCodeDetect(detectedCodes.length > 0)
                                    }
                                }}
                            />
                        </Controll>
                        <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                            <Button
                                onTap={() => setShowQRCode(false)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                            </Button>
                        </Flex>
                    </Flex>
                )
                : (
                    <Flex gap='12px'>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NormalFont600 style={{ color: 'var(--text-gray)' }}>Create 2FA Entry</NormalFont600>
                            <NormalFont500 style={{ color: 'var(--text-light)' }}>Add a new authentication profile for your account. This will allow you to generate time-based one-time passwords (TOTP) for secure logins.</NormalFont500>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Title*</NanoFont700>
                            <Controll style={{ border: title.length === 0 ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                <Input 
                                    value={title} 
                                    onChange={({ target: { value } }) => {
                                        setTitle(value)
                                    }}
                                    placeholder='Google, OKX, etc...' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Domain</NanoFont700>
                            <Controll style={{ border: domainError ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                <Input 
                                    value={domain} 
                                    onChange={({ target: { value } }) => {
                                        setDomain(value)
                                    }}
                                    placeholder='https://google.com' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Account</NanoFont700>
                            <Controll>
                                <Input 
                                    value={account} 
                                    onChange={({ target: { value } }) => {
                                        setAccount(value)
                                    }}
                                    placeholder='@prohetamine' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Profile</NanoFont700>
                            <Select 
                                value={profile}
                                onSelect={profile => setProfile(profile)}
                                items={value[0]} 
                            />
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Secret Key</NanoFont700>
                            <Flex direction='row' gap='6px'>
                                <Controll style={{ border: secretKeyError ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                    <Input 
                                        value={secretKey} 
                                        onChange={({ target: { value } }) => {
                                            setSecretKey(value)
                                        }}
                                        placeholder='ABCDEFFHIJKLMNOFQRSTUVWXYZ234567' 
                                    />
                                </Controll>
                                <Button
                                    style={{ height: '48px', boxSizing: 'border-box' }}
                                    onTap={() => setShowQRCode(true)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Flex direction='row' gap='6px'>
                                        <Icon src={iconScan} />
                                    </Flex>
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                            <Button
                                onTap={async () => {
                                    if (title.length === 0) {
                                        return
                                    }

                                    try {
                                        await generate({ secret: secretKey })
                                    } catch (e) {
                                        setSecretKeyError(true)
                                        return
                                    }

                                    if (domainError) {
                                        return
                                    }

                                    const _domain = domainError || domain.length === 0
                                                        ? ''
                                                        : (new URL(domain)).host

                                    onData(true, profile, title, _domain, account, secretKey)
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Save</NormalFont600>
                            </Button>
                            <Button
                                onTap={() => onData(false)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                            </Button>
                        </Flex>
                    </Flex>
                )
}

export const Edit2FaEntry = ({ onData, value }) => {
    const [title, setTitle] = useState(value[2])
        , [domain, setDomain] = useState(value[3] ? `https://${value[3]}` : '')
        , [account, setAccount] = useState(value[4])
        , [secretKey, setSecretKey] = useState(value[5])
        , [profile, setProfile] = useState(value[1])

    const [secretKeyError, setSecretKeyError] = useState(false)
        , [domainError, setDomainError] = useState(false)

    const [isShowQRCode, setShowQRCode] = useState(false)
        , [isQRCodeDetect, setQRCodeDetect] = useState(false)

    useEffect(() => {
        if (secretKey) {
            const timeId = setTimeout(async () => {
                try {
                    await generate({ secret: secretKey })
                    setSecretKeyError(false)
                } catch (e) {
                    setSecretKeyError(true)
                }
            }, 100)

            return () => clearTimeout(timeId)
        }
    }, [secretKey])

    useEffect(() => {
        if (domain) {
            const timeId = setTimeout(async () => {
                try {
                    new URL(domain)
                    setDomainError(false)
                } catch (e) {
                    setDomainError(true)
                }
            })

            return () => clearTimeout(timeId)
        } else {
            setDomainError(false)
        }
    }, [domain])

    return isShowQRCode 
                ? (
                    <Flex gap='12px'>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NormalFont600 style={{ color: 'var(--text-gray)' }}>QR-Code</NormalFont600>
                            <NormalFont500 style={{ color: 'var(--text-light)' }}>Point the camera at the QR code</NormalFont500>
                        </Flex>
                        <Controll style={{ padding: '0px', overflow: 'hidden', border: isQRCodeDetect ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                            <Scanner
                                onScan={detectedCodes => {
                                    const [data = false] = detectedCodes.map(code => {
                                        try {
                                            const { issuer = '', label = '' } = OTPAuth.URI.parse(`otpauth://totp/Reddit:Adventurous_Dot1008?issuer=Reddit&secret=NH4TZSFEMC3JH7FM6VLJSUO6COATK5KB`)
                                                , url = new URL(code.rawValue)
                                                , secret = url.searchParams.get('secret')
                                            
                                            return {
                                                secret,
                                                issuer, 
                                                label
                                            }
                                        } catch (e) {
                                            return false
                                        }
                                    }).filter(f => f)

                                    if (data) {
                                        const { 
                                            secret,
                                            issuer, 
                                            label
                                        } = data

                                        if (issuer && title.length === 0) {
                                            setTitle(issuer)
                                        }

                                        if (label && account.length === 0) {
                                            setAccount(label)
                                        }

                                        setSecretKey(secret)
                                        setShowQRCode(false)
                                    }
                                }}
                                onError={(error) => console.log(error?.message)}
                                sound={false}
                                components={{
                                    finder: false,
                                    tracker: detectedCodes => {
                                        setQRCodeDetect(detectedCodes.length > 0)
                                    }
                                }}
                            />
                        </Controll>
                        <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                            <Button
                                onTap={() => setShowQRCode(false)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                            </Button>
                        </Flex>
                    </Flex>
                )
                : (
                    <Flex gap='12px'>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NormalFont600 style={{ color: 'var(--text-gray)' }}>Edit 2FA Entry</NormalFont600>
                            <NormalFont500 style={{ color: 'var(--text-light)' }}>Update your two-factor authentication profile to continue generating time-based one-time passwords (TOTP) for secure logins.</NormalFont500>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Title*</NanoFont700>
                            <Controll style={{ border: title.length === 0 ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                <Input 
                                    value={title} 
                                    onChange={({ target: { value } }) => {
                                        setTitle(value)
                                    }}
                                    placeholder='Google, OKX, etc...' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Domain</NanoFont700>
                            <Controll style={{ border: domainError ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                <Input 
                                    value={domain} 
                                    onChange={({ target: { value } }) => {
                                        setDomain(value)
                                    }}
                                    placeholder='https://google.com' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Account</NanoFont700>
                            <Controll>
                                <Input 
                                    value={account} 
                                    onChange={({ target: { value } }) => {
                                        setAccount(value)
                                    }}
                                    placeholder='@prohetamine' 
                                />
                            </Controll>
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Account</NanoFont700>
                            <Select 
                                value={profile}
                                onSelect={profile => setProfile(profile)}
                                items={value[0]} 
                            />
                        </Flex>
                        <Flex gap='6px' style={{ alignItems: 'flex-start', width: '100%' }}>
                            <NanoFont700 style={{ color: 'var(--text-light)' }}>Secret Key</NanoFont700>
                            <Flex direction='row' gap='6px'>
                                <Controll style={{ border: secretKeyError ? `1px solid var(--interface-color-primary-alt)` : `1px solid var(--interface-dark-background-border)` }}>
                                    <Input 
                                        value={secretKey} 
                                        onChange={({ target: { value } }) => {
                                            setSecretKey(value)
                                        }}
                                        placeholder='ABCDEFFHIJKLMNOFQRSTUVWXYZ234567' 
                                    />
                                </Controll>
                                <Button
                                    style={{ height: '48px', boxSizing: 'border-box' }}
                                    onTap={() => setShowQRCode(true)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Flex direction='row' gap='6px'>
                                        <Icon src={iconScan} />
                                    </Flex>
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex gap='12px' direction='row' justify='flex-end' style={{ width: '100%' }}>
                            <Button
                                onTap={async () => {
                                    if (title.length === 0) {
                                        return
                                    }

                                    try {
                                        await generate({ secret: secretKey })
                                    } catch (e) {
                                        setSecretKeyError(true)
                                        return
                                    }

                                    if (domainError) {
                                        return
                                    }

                                    const _domain = domainError || domain.length === 0
                                                        ? ''
                                                        : (new URL(domain)).host

                                    onData(true, profile, title, _domain, account, secretKey)
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Save</NormalFont600>
                            </Button>
                            <Button
                                onTap={() => onData(false)}
                                whileTap={{ scale: 0.9 }}
                            >
                                <NormalFont600 style={{ color: 'var(--interface-color-primary)' }}>Cancel</NormalFont600>
                            </Button>
                        </Flex>
                    </Flex>
                )
}