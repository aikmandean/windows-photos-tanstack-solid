import { fn } from "@hwyblvd/st"
import { createSignal } from "solid-js"
import { DataSetGrid } from "../Grid"
import { BtnColFilter, BtnColGroup, BtnColVis } from "../Grid/GridBtn"
import { useColumnDefs } from "../Grid/useColumnDefs"
import { usePropsNav } from "../Grid/useProps"
import { useRowModel } from "../Grid/useRowModel"
import { apiRoot, fetchJson } from "../Url"

const dataShape = {
    tagName: "",
    tagConfidence: 0,
    fileName: ""
};

const Def = useColumnDefs({ dataShape });
const Props = usePropsNav({ dataShape });

export const TagModel = fn(() => {

	const [data, setData] = createSignal([]);
	fetchJson(apiRoot + "/v1/tags")
		.then(setData);


    const Filter = fn(props => <>
        <div>
            <BtnColFilter col={props.table.getColumn("fileName")} label="File Name" />
            <input onChange={e => props.table.getColumn("fileName").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("tagConfidence")} label="Confidence (Min, Max)" />
            <input type="number" onChange={e => props.table.getColumn("tagConfidence").setFilterValue((v: number[]) => [e.currentTarget.valueAsNumber, v?.[1]])} />
            <input type="number" onChange={e => props.table.getColumn("tagConfidence").setFilterValue((v: number[]) => [v?.[0], e.currentTarget.valueAsNumber])} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("tagName")} label="Tag Name" />
            <input onChange={e => props.table.getColumn("tagName").setFilterValue(e.currentTarget.value)} />
        </div>
    </>, Props);

    const Visible = fn(props =>
        <div>
            <BtnColVis col={props.table.getColumn("tagName")} label="Hide Tag" />
            <span textContent={" "} />
            <BtnColVis col={props.table.getColumn("tagConfidence")} label="Hide Confidence" />
            <span textContent={" "} />
            <BtnColVis col={props.table.getColumn("fileName")} label="Hide File" />
        </div>
    , Props);

    const Group = fn(props => 
        <div>
            <BtnColGroup col={props.table.getColumn("fileName")} label="By File" />
            <span textContent={" "} />
            <BtnColGroup col={props.table.getColumn("tagName")} label="By Tag" />
        </div>
    , Props);

    const Columns = fn(() => <>
        <Def header="count"
            accessorFn={() => 1} enableSorting
            aggregationFn="count" />
        <Def accessorKey="tagName" filterFn="includesString" />
        <Def accessorKey="tagConfidence" enableSorting filterFn="inNumberRange" />
        <Def accessorKey="fileName" filterFn="includesString" />
        <Def header="fileImage" cell={r => (
            <img style="object-fit: contain; height: 3em; margin-top: -4px; margin-bottom: -7px;" src={`/i/${r.row.original.fileName}`} />
        )} />
    </>);
    
	return (
		<DataSetGrid
            {...useRowModel({})}
			data={data()}
            group={Group}
            filter={Filter}
            visible={Visible}
			// @ts-ignore
			columns={<Columns />}
		/>
	);
});