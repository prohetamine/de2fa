import styled from 'styled-components';
import { ExtraBigFont700 } from './global';
import { useEffect, useState } from 'react';

const WrapperSymbol = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-radius: 8px;
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    position: relative;
    box-sizing: border-box;
    background: var(--interface-color-second);
    border: 1px solid var(--interface-background-border);
`

const IconSymbol = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0px;
    width: 32px;
    height: 32px;
`

const WrapperFavicon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    width: 56px;
    height: 56px;
    min-width: 56px;
    min-height: 56px;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
`

const GrayLayer = styled.div`
    width: 56px;
    height: 56px;
    position: absolute;
    border-radius: 8px;
    background: #eee;
    z-index: 1;
`

const BorderLayer = styled.div`
    background-size: 10000%;
    background-position: 75% 75%;
    width: 56px;
    height: 56px;
    position: absolute;
    border-radius: 9px;
    filter: brightness(0.8);
    opacity: 0.2;
    z-index: 2;
`

const WhiteLayer = styled.div`
    background: var(--interface-background-primary);
    width: 54px;
    height: 54px;
    background-size: 10000%;
    background-position: 75% 75%;
    border-radius: 8px;
    position: absolute;
    z-index: 3;
`

const BackgroundLayer = styled.div`
    width: 54px;
    height: 54px;
    background-size: 10000%;
    background-position: 75% 75%;
    opacity: 0.1;
    filter: brightness(0.5);
    border-radius: 8px;
    position: absolute;
    z-index: 4;
`

const IconLayer = styled.div`
    width: 32px;
    height: 32px;
    background-size: cover;
    background-position: center center;
    position: absolute;
    border-radius: 6px;
    z-index: 5;
`

const DomainIcon = ({ domain, symbol }) => {
    const url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`

    const [isSymbol, setSymbol] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(async () => {
            const image = new Image()
            image.src = url
            image.onload = () => setSymbol(image.width === 16)
        }, 100)

        return () => clearTimeout(timeId)
    }, [url, domain])

    return domain && !isSymbol
            ? (
                <WrapperFavicon>
                    <GrayLayer />
                    <BorderLayer style={{ backgroundImage: `url('${url}')` }} />
                    <WhiteLayer />
                    <BackgroundLayer style={{ backgroundImage: `url('${url}')` }} />
                    <IconLayer style={{ backgroundImage: `url('${url}')` }} />
                </WrapperFavicon>
            )
            : (
                <WrapperSymbol>
                    <IconSymbol>
                        <ExtraBigFont700 style={{ color: 'var(--interface-color-primary)' }}>{symbol}</ExtraBigFont700>
                    </IconSymbol>
                </WrapperSymbol>
            )
}

export default DomainIcon