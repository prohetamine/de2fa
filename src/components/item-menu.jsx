import styled from 'styled-components'
import { Flex, Icon } from './global'
import { motion } from 'framer-motion'

import iconEdit from './../assets/icon/edit.svg?react'
import iconDelete from './../assets/icon/delete.svg?react'

const IconButton = styled(motion.div)`
    font-size: 0px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid var(--interface-background-border);
    background: var(--interface-color-second);
    border-radius: 100px;
    padding: 16px;
    width: 56px;
    height: 56px;
`

const ItemMenu = ({ onEdit, onDelete }) => (
    <Flex gap='12px' direction='row' style={{ position: 'absolute', right: '0px', top: '22px' }}>
        <IconButton
            onTap={onEdit}
            whileTap={{ scale: 0.9 }}
        >
            <Icon src={iconEdit} />
        </IconButton>
        <IconButton
            onTap={onDelete}
            whileTap={{ scale: 0.9 }} 
            style={{
                border: '1px solid var(--interface-background-border-alt)',
                background: 'var(--interface-color-second-alt)'
            }}
        >
            <Icon src={iconDelete} />
        </IconButton>
    </Flex>
)

export default ItemMenu