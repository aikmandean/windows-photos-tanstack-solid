import { fn } from "@hwyblvd/st"
import { createSignal } from "solid-js"
import { DataSetGrid } from "../Grid"
import { BtnColFilter, BtnColGroup, BtnColVis } from "../Grid/GridBtn"
import { useColumnDefs } from "../Grid/useColumnDefs"
import { usePropsNav } from "../Grid/useProps"
import { useRowModel } from "../Grid/useRowModel"
import { apiRoot, fetchJson } from "../Url"

const dataShape = {
    cameraManufacturer: "",
    cameraModel: "",
    imageWidth: 0,
    fileName: ""
};

const Def = useColumnDefs({ dataShape });
const Props = usePropsNav({ dataShape });

export const CameraModel = fn(() => {

	const [data, setData] = createSignal([]);
	fetchJson(apiRoot + "/large/cameras")
		.then(setData);


    const Filter = fn(props => <>
        <div>
            <BtnColFilter col={props.table.getColumn("fileName")} label="File Name" />
            <input onChange={e => props.table.getColumn("fileName").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("cameraManufacturer")} label="Region" />
            <input onChange={e => props.table.getColumn("cameraManufacturer").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("cameraModel")} label="District" />
            <input onChange={e => props.table.getColumn("cameraModel").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("imageWidth")} label="Confidence (Min, Max)" />
            <input type="number" onChange={e => props.table.getColumn("imageWidth").setFilterValue((v: number[]) => [e.currentTarget.valueAsNumber, v?.[1]])} />
            <input type="number" onChange={e => props.table.getColumn("imageWidth").setFilterValue((v: number[]) => [v?.[0], e.currentTarget.valueAsNumber])} />	
        </div>
    </>, Props);

    const Visible = fn(props =>
        <div>
            <BtnColVis col={props.table.getColumn("cameraManufacturer")} label="Hide Manufacturer" />
            <BtnColVis col={props.table.getColumn("cameraModel")} label="Hide Model" />
            <span textContent={" "} />
            <BtnColVis col={props.table.getColumn("imageWidth")} label="Hide Width" />
            <span textContent={" "} />
            <BtnColVis col={props.table.getColumn("fileName")} label="Hide File" />
        </div>
    , Props);

    const Group = fn(props => 
        <div>
            <BtnColGroup col={props.table.getColumn("cameraManufacturer")} label="By Manufacturer" />
            <BtnColGroup col={props.table.getColumn("cameraModel")} label="By Model" />
            <BtnColGroup col={props.table.getColumn("imageWidth")} label="By Width" />
        </div>
    , Props);

    const Columns = fn(() => <>
        <Def header="count"
            accessorFn={() => 1} enableSorting
            aggregationFn="count" />

        <Def accessorKey="cameraManufacturer" filterFn="includesString" enableColumnFilter />
        <Def accessorKey="cameraModel" filterFn="includesString" enableColumnFilter />
        <Def accessorKey="imageWidth" filterFn="includesString" enableColumnFilter />
        <Def accessorKey="fileName" filterFn="inNumberRange" enableColumnFilter />

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