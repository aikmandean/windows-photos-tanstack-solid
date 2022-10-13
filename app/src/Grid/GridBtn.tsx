import { fn } from "@hwyblvd/st"
import { Column } from "@tanstack/solid-table"
import { BG_SELECTED } from "../Theme"

const PropsBtn = fn(()=>{}, {
    /** ### Button Text 
     * Optionally, JSX content.
     */
    label: "",
    /** ### TanStack Column
     * 
     */
    col: {} as Column<any>
});

export const BtnColGroup = fn(props => 
	<button
		onClick={() => props.col.toggleGrouping()}
		style={props.col.getIsGrouped() && BG_SELECTED}
        children={props.label}
	/>
, PropsBtn);

export const BtnColVis = fn(props => 
	<button
		onClick={() => props.col.toggleVisibility()}
		style={props.col.getIsVisible() || BG_SELECTED}
        children={props.label}
	/>
, PropsBtn);

export const BtnColFilter = fn(props => 
	<button
		style={props.col.getIsFiltered() && BG_SELECTED}
        children={props.label}
    />
, PropsBtn);
