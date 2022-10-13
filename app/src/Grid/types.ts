import X, { declareProps } from "@hwyblvd/st";

export function MLift<F>(func: F): F & X.Metadata.New<typeof X.Declare.SFuncname, "Lifted Func"> {
    return func as any
}