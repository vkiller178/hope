export interface MenuProps {
    menus: ItemProps[]
}

export interface ItemProps {
    title: string
    action: Function
}