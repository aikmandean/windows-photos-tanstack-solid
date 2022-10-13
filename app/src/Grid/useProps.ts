import { Column, Row, Table } from "@tanstack/solid-table";
import { MLift } from "./types";

export { usePropsNav };

const usePropsNav = MLift(PropsNav);

function PropsNav<T>(props: { dataShape: T }) {
    return {
        /** ### TanStack Table Object
         * 
         */
        table: {} as Table<T> & { getColumn: (columnId: keyof T) => Column<T, unknown> },
        /** ### TanStack Row[] 
         * 
         */
        rows: [] as Row<T>[]
    };
}