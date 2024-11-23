import { Menu } from 'antd'
import React from 'react'

interface TopActionBarProps {
    // TODO : Add type safety
    children: React.ReactNode
    [key: string]: any
}

const TopActionBar: React.FC<TopActionBarProps> = ({ children, ...menuProps }) => {
    return (
        <Menu {...menuProps}>
            {children}
        </Menu>
    )
}

export default TopActionBar
