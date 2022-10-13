import { fn } from "@hwyblvd/st"
import { createSolidTable, flexRender } from "@tanstack/solid-table"
import { createVirtualizer } from "@tanstack/solid-virtual"
import { createMemo, createRoot, createSignal, For, Match, Show, Switch } from "solid-js"
import { ModelSelect } from "../Features/Selector"
import { BG_SELECTED } from "../Theme"
import { MLift } from "./types"


const Padding = fn(props => (
    <Show when={props.height}>
        <tr>
            <td style={`height: ${props.height}px`}></td>
        </tr>
    </Show>
), { height: 0 })

const Table = fn(props => {

    const paddingTop = () => props.virtualizer().getVirtualItems()?.[0]?.start || 0
    const paddingBottom = () =>
        props.virtualizer().getTotalSize() - (props.virtualizer().getVirtualItems()?.[props.virtualizer().getVirtualItems().length - 1]?.end || 0)
    
    type Option = "filter" | "column" | "group" | false
    const [optView, setOptView] = createSignal("" as Option)

    /** @ts-ignore */
    let nav
    return (
        <div style="height: 100vh; display: grid; grid-template-rows: auto 1fr;">
            <nav ref={nav}>
                <ModelSelect />
				<button onClick={[setOptView, "column"]}>Columns</button>
				<button onClick={[setOptView, "filter"]}>Filters</button>
				<button onClick={[setOptView, "group"]}>Groups</button>
				<Show when={optView()}>
					<button style={BG_SELECTED} onClick={[setOptView, ""]}>Close</button>
				</Show>
				<b>{props.rows.length} rows</b>
				<div hidden={optView() != "column"}>
                    {props.visible}
				</div>
				<div hidden={optView() != "filter"}>
					<hr />
                    {props.filter}
				</div>
				<div hidden={optView() != "group"}>
					{props.group}
				</div>
            </nav>
            <div ref={el => { props.elTable(el); el.style.height = `calc(100vh - ${nav.getBoundingClientRect()})` }} style="height: auto; overflow: auto;">
                <table style="width: 100%">
                    <thead>
                        {props.head}
                    </thead>
                    <tbody>
                        <Padding height={paddingTop()} />
                        {props.body}
                        <Padding height={paddingBottom()} />
                    </tbody>
                </table>
            </div>
        </div>
    )
}, { head: <p/>, body: <p/>, group: <p/>, filter: <p/>, visible: <p/>, rows: [], virtualizer: () => 0 as any, elTable: (el: HTMLElement) => 0 as any })

export const DataSetGrid = fn(props => {
    
    let elTable: any
    const table = createSolidTable(props)
    const rows = createMemo(() => table.getRowModel().rows)
    
    const virtualizer = createMemo(() => 
        createVirtualizer({
            count: rows().length,
            enableSmoothScroll: false,
            getScrollElement: () => elTable,
            estimateSize: () => 32
        })
    ) 

    table.getColumn("fileName").toggleVisibility()

    return (
        <Table
            elTable={el => elTable = el}
            virtualizer={virtualizer}
            filter={<props.filter table={table} rows={rows()} />}
            group={<props.group table={table} rows={rows()} />}
            visible={<props.visible table={table} rows={rows()} />}
            rows={rows()}
            head={
                <For each={table.getHeaderGroups()} children={headerGroup => (
                    <tr>
                        <For each={headerGroup.headers} children={header => 
                            <th colSpan={header.colSpan}>
                                <Show when={!header.isPlaceholder} children={
                                    <div
                                        style={{cursor: `${header.column.getCanSort() ? "pointer" : "auto"}`}}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string]}
                                    </div>
                                } />
                            </th>
                        } />
                    </tr>
                )} />
            }
            body={
                <For each={virtualizer().getVirtualItems()} children={virtual => {
                    const row = rows()[virtual.index]
                    return <tr ref={el => setTimeout(() => virtual.measureElement(el))}>
                        <For each={row.getVisibleCells()} children={cell => 
                            <td style={{ background: 
                                cell.getIsGrouped() 
                                    ? 'rgb(10 56 127 / 75%)' : 
                                cell.getIsAggregated()
                                    ? '#8467332c' : 
                                cell.getIsPlaceholder()
                                    ? '#3a175c42' : 'transparent'
                            }}>
                                <Switch>
                                    <Match when={cell.getIsGrouped()} children={
                                        <button
                                            onClick={row.getToggleExpandedHandler()}
                                            style={{ cursor: row.getCanExpand()
                                                ? 'pointer' : 'normal',
                                            }}
                                        >
                                            {row.getIsExpanded() ? '👇' : '👉'}{' '}
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </button>
                                    } />
                                    <Match when={cell.getIsAggregated()} children={
                                        flexRender(
                                            cell.column.columnDef.aggregatedCell ??
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    } />
                                    <Match when={!cell.getIsPlaceholder()} children={
                                        // For cells with repeated values, render null
                                        // Otherwise, just render the regular cell
                                        flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )
                                    } />
                                    <Match when={cell.getIsPlaceholder()} children={null} />
                                </Switch>
                            </td>   
                        } />
                    </tr>
                }
                } />
            }
        />
    )
}, MLift(createSolidTable<any>))
