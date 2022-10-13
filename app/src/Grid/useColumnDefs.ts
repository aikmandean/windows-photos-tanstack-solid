import { ColumnDef } from "@tanstack/solid-table";
import { JSXElement } from "solid-js";
import { MLift } from "./types";

export { useColumnDefs };

const useColumnDefs = MLift(ColumnDefs);

function ColumnDefs<T>(props: { dataShape: T }) {
    function Def(props: ColumnDef<T> & { accessorKey?: keyof T }) {
        return {
            enableColumnFilter: false,
            enableGrouping: false,
            enableSorting: false,
            aggregationFn: () => null,
            ...props
        } as any as JSXElement;
    };
    return Def;
}