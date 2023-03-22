import { declareProps, MCast, MOptional } from "@hwyblvd/st"

export const {
    StartsWith,
    TagId,
    Skip,
    LocationId,
    PersonId,
    TagStatePrimaryOnly,
    FaceId,
    NoName,
    Chain
} = declareProps({
    startsWith: MCast(MOptional(""), { type: "string" }),
    tagId: MCast(0, { type: "number" }),
    skip: MCast(MOptional(0), { type: "number" }),
    locationId: MCast(0, { type: "number" }),
    personId: MCast(0, { type: "number" }),
    tagStatePrimaryOnly: MCast(MOptional(true), { type: "boolean" }),
    faceId: MCast(0, { type: "number" }),
    noName: MCast(MOptional(false), { type: "boolean" }),
    /** @type {{type: string, choice: string, value: string}[]} */
    chain: MCast([], { type: "array", items: { type: "object" } })
})