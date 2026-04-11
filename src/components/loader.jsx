import useWindowSize from '@rooks/use-window-size'
import { Flex } from './global'
import styled from 'styled-components'

const Spinner = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;

        background: conic-gradient(
            var(--interface-color-primary) 0deg,
            var(--interface-dark-color-primary) 1deg,
            var(--interface-dark-color-primary) 99deg,
            var(--interface-color-primary) 100deg,
            var(--interface-color-primary) 360deg
        );

        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
        mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);

        animation: spin 0.9s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`

const Loader = () => {
    const { innerWidth } = useWindowSize()
        , width = innerWidth > 370 ? 370 : innerWidth

    return (
        <Flex 
            gap='12px' 
            align='center' 
            justify='center'
            style={{
                padding: '0px 12px', 
                maxWidth: `${width}px`, 
                width: '100%', 
                height: 'calc(100vh - 74px)',
                boxSizing: 'border-box'
            }}
        >
            <Spinner />
        </Flex>
    )
}

export default Loader