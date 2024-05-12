import React, { useState } from "react"
import { SideBarMenuItem } from "../types/SideBarMenu"
import { classNames } from "../classes/SideBarMenu"
import { VscMenu } from "react-icons/vsc"
import SideBarMenuItemView from "./SideBarMenuItemView"
import "../styles/SideBarMenu.scss"

/**
 * Props for the SideBarMenu component
 * @param items
 * @param user
 */
type SideBarMenuProps = {
	items: SideBarMenuItem[]
	user: User
}

/**
 * Display the sidebar menu
 * @param items
 * @param user
 */
const SideBarMenu: React.FC<SideBarMenuProps> = ({ items, user }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	function handleClick() {
		setIsOpen(!isOpen)
	}
	return (
		<div className={classNames("SideBarMenu", isOpen ? "expanded" : "collapsed")}>
			<div className="menuButton">
				<button className="hamburgerIcon" onClick={handleClick}>
					<VscMenu />
				</button>
			</div>
			{items.map(item => (item.privilegeNeeded <= user.admin ? <SideBarMenuItemView key={item.id} item={item} isOpen={isOpen} /> : <></>))}
		</div>
	)
}

export default SideBarMenu
