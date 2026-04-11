/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react'
import { decrypt } from './encrypt-decrypt'
import sleep from 'sleep-promise'

const decodeList = async (list, password) => {
    return Promise.all(
        list.map(async item => ({
            ...item,
            text: await decrypt(item.text, password)
        }))
    )
}

const useDecryptAndLogic = (slotsValue, profilesValue, password, selectProfile, selectTag) => {
    const [decodedProfiles, setDecodedProfiles] = useState([])
        , [decodedSlots, setDecodedSlots] = useState([])
        , [isError, setError] = useState(false)
        , [isDecrypt, setDecrypt] = useState(false)

    const _slots = slotsValue.slice(0, decodedSlots.length + 1)
        , _profiles = profilesValue.slice(0, decodedProfiles.length + 1)

    const hasUpdate = JSON.stringify(_slots) + JSON.stringify(_profiles) /* -________- */
    
    useEffect(() => {
        if (password && !isError) {
            const timeId = setTimeout(async () => {
                setDecrypt(false)
                await sleep(100)
                const [slotsData, profilesData] = await Promise.all([
                    decodeList(_slots, password),
                    decodeList(_profiles, password)
                ])
                setDecrypt(true)

                setDecodedSlots(
                    slotsData
                        .map(slot => {
                            try {
                                const [profile, title, domain, username, secret] = JSON.parse(slot.text) 

                                return ({ 
                                    ...slot, 
                                    profile, 
                                    title, 
                                    domain, 
                                    username, 
                                    secret
                                })
                            } catch (e) {
                                setError(true)
                                return false
                            }
                        })
                        .filter(f => f)
                )

                setDecodedProfiles(
                    profilesData
                )
            }, 100)

            return () => clearTimeout(timeId)
        }
    }, [hasUpdate, password, isError])

    useEffect(() => {
        if (!password) {
            setDecodedProfiles([])
            setDecodedSlots([])
            setError(false)
        }
    }, [password])

    const profiles = useMemo(() => {
        const profiles = decodedProfiles.map(({ index, text, chainId }) => ({
            index,
            name: text,
            chainId
        }))

        return profiles
    }, [decodedProfiles])

    const _items = useMemo(() => {
        const slots = decodedSlots
                        .filter(({ profile }) => selectProfile === -1 || selectProfile === profile)
                        .sort((a, b) => a.profile - b.profile)
                        .reduce((acc, item, index, arr) => {
                            if (index === 0 || item.profile !== arr[index - 1].profile) {
                                const profile = decodedProfiles
                                                    .filter(({ index }) => selectProfile === -1 || selectProfile === index)
                                                    .find(({ index }) => index === item.profile)

                                acc.push({ 
                                    type: 'profile',
                                    index: profile?.index, 
                                    name: profile?.text || 'Loading...',
                                    chainId: profile?.chainId
                                })
                            }

                            acc.push({
                                type: 'item',
                                ...item
                            })

                            return acc
                        }, [])

        return slots
    }, [decodedSlots, decodedProfiles, selectProfile])

    const profilesInItems = Object.keys(
        _items
            .reduce((ctx, { profile }) => {
                if (profile !== undefined) {
                    ctx[profile] = true
                }

                return ctx
            }, {})
    ).map(index => parseInt(index))
    
    const isProfileLabel = profilesInItems.length > 1

    const tagsObject = _items
                            .filter(({ type }) => type === 'item')
                            .map(({ title }) => title?.toLowerCase() || '')
                            .reduce((ctx, title) => {
                                if (ctx[title]) {
                                    ctx[title]++
                                } else {
                                    ctx[title] = 1
                                }
                                return ctx
                            }, {})

    const tags = Object.keys(tagsObject).filter(key => tagsObject[key] > 1)

    const items = _items
                        .filter(({ type, index }) => type === 'profile' ? (isProfileLabel && profilesInItems.find(_index => _index === index) !== undefined) : true)
                        .filter(({ title, type }) => type === 'item' ? (selectProfile !== -1 ? true : selectTag === 'all' || title.toLowerCase() === selectTag) : true)
                        .filter(({ type, index }, i, array) => type === 'profile' ? array.find(({ profile }) => profile === index) !== undefined : true)

    const visibleProfiles = profiles.filter(profile => !!decodedSlots.find(item => item.profile === profile.index))

    return {
        visibleProfiles,
        profiles,
        tags,
        items,
        isError,
        isDecrypt
    }
}

export default useDecryptAndLogic