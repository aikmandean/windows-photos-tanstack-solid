import { fn } from "@hwyblvd/st"
import { createSignal } from "solid-js"
import { DataSetGrid } from "../Grid"
import { BtnColFilter, BtnColGroup, BtnColVis } from "../Grid/GridBtn"
import { useColumnDefs } from "../Grid/useColumnDefs"
import { usePropsNav } from "../Grid/useProps"
import { useRowModel } from "../Grid/useRowModel"
import { apiRoot, fetchJson } from "../Url"

const dataShape = {
    locationRegion: "",
    locationDistrict: "",
    locationName: "",
    fileName: ""
};

const Def = useColumnDefs({ dataShape });
const Props = usePropsNav({ dataShape });

export const LocationModel = fn(() => {

	const [data, setData] = createSignal([]);
	fetchJson(apiRoot + "/large/locations")
		.then(setData);


    const Filter = fn(props => <>
        <div>
            <BtnColFilter col={props.table.getColumn("fileName")} label="File Name" />
            <input onChange={e => props.table.getColumn("fileName").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("locationRegion")} label="Region" />
            <input onChange={e => props.table.getColumn("locationRegion").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("locationDistrict")} label="District" />
            <input onChange={e => props.table.getColumn("locationDistrict").setFilterValue(e.currentTarget.value)} />
        </div>
        <div>
            <BtnColFilter col={props.table.getColumn("locationName")} label="Location" />
            <input onChange={e => props.table.getColumn("locationName").setFilterValue(e.currentTarget.value)} />
        </div>
    </>, Props);

    const Visible = fn(props =>
        <div>
            <BtnColVis col={props.table.getColumn("locationRegion")} label="Hide Region" />
            <BtnColVis col={props.table.getColumn("locationDistrict")} label="Hide District" />
            <BtnColVis col={props.table.getColumn("locationName")} label="Hide Location" />
            <span textContent={" "} />
            <BtnColVis col={props.table.getColumn("fileName")} label="Hide File" />
        </div>
    , Props);

    const Group = fn(props => 
        <div>
            <BtnColGroup col={props.table.getColumn("locationRegion")} label="By Region" />
            <BtnColGroup col={props.table.getColumn("locationDistrict")} label="By District" />
            <BtnColGroup col={props.table.getColumn("locationName")} label="By Location" />
        </div>
    , Props);

    const Columns = fn(() => <>
            <Def header="count"
                accessorFn={() => 1} enableSorting
                aggregationFn="count" />

            <Def accessorKey="locationRegion" filterFn="includesString" enableColumnFilter />
            <Def accessorKey="locationDistrict" filterFn="includesString" enableColumnFilter />
            <Def accessorKey="locationName" filterFn="includesString" enableColumnFilter />
            <Def accessorKey="fileName" filterFn="includesString" enableColumnFilter />
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