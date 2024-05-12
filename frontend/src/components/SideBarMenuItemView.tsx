import React from "react"
import { SideBarMenuItem } from "../types/SideBarMenu"
import { classNames } from "../classes/SideBarMenu"
import "../styles/SideBarMenuItemView.scss"

/**
 * Props for SideBarMenuItemView
 * @param item
 * @param isOpen
 */
interface SideBarMenuItemProps {
	item: SideBarMenuItem
	isOpen: boolean
}

/**
 * Display a menu item
 * @param item
 * @param isOpen
 */
export default function SideBarMenuItemView({ item, isOpen }: SideBarMenuItemProps) {
	return (
		<div className="SideBarMenuItem">
			<a href={item.url}>
				<div className={classNames("ItemContent", isOpen ? "" : "collapsed")}>
					<div className="icon">
						<item.icon size="32" />
					</div>
					<span className="label">{item.label}</span>
				</div>
			</a>
			{!isOpen ? <div className="tooltip">{item.label}</div> : ""}
		</div>
	)
}
