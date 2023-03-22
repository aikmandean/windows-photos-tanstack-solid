import { fn } from "@hwyblvd/st"
import { db } from "./helpers/-db.js";
import { Chain, Skip } from "./helpers/-props.js";
import { cacheTagNames } from "./helpers/cache-tagnames.js";

const whereNotOpaque = {
    Item_FileName: { not: { endsWith: "heic" } }
};

export const tags = fn(async props => {
    const items = await db.itemTags.findMany({
        select: { 
            ItemTags_TagId: true,
            ItemTags_Confidence: true,
            Item: { select: { 
                Item_FileName: true
            } }
        },
        where: {
            Item: { 
                ...whereNotOpaque
            },
            ItemTags_Confidence: { gte: .4 }
        }
    });

    return items.map(it => {
        return {
            fileName: it.Item.Item_FileName,
            tagConfidence: it.ItemTags_Confidence,
            tagName: cacheTagNames[it.ItemTags_TagId]
        };
    });
});

export const locations = fn(async props => {
    const items = await db.item.findMany({
        select: {
            Item_FileName: true,
            Location_Item_Item_LocationIdToLocation: { select: { 
                Location_Name: true, 
                LocationRegion: { select: {
                    LocationRegion_Name: true
                } },
                LocationDistrict: { select: {
                    LocationDistrict_Name: true
                } }
            } }
        },
        where: {
            ...whereNotOpaque
        }
    });
    
    return items.map(it => {
        return {
            fileName: it.Item_FileName,
            locationDistrict: it.Location_Item_Item_LocationIdToLocation?.LocationDistrict?.LocationDistrict_Name,
            locationRegion: it.Location_Item_Item_LocationIdToLocation?.LocationRegion?.LocationRegion_Name,
            locationName: it.Location_Item_Item_LocationIdToLocation?.Location_Name
        };
    });
});

export const cameras = fn(async props => {
    const items = await db.item.findMany({
        select: {
            Item_FileName: true,
            CameraModel: { select: { 
                CameraModel_Text: true
            } },
            CameraManufacturer: { select: {
                CameraManufacturer_Text: true
            } },
            Item_Width: true,
        },
        where: {
            ...whereNotOpaque
        }
    });

    return items.map(it => {
        return {
            cameraManufacturer: it.CameraManufacturer?.CameraManufacturer_Text,
            cameraModel: it.CameraModel?.CameraModel_Text,
            fileName: it.Item_FileName,
            imageWidth: it.Item_Width
        }
    });
});

const unit = (promise, property) => 
    promise.then(array => array.map(item => item[property]));

const CHOICE = {
    Date: {
        Season: ["Spring", "Summer", "Fall", "Winter"],
        Year: () => unit(db.itemDateTaken.findMany({
            select: { ItemDateTaken_Year: true },
            distinct: ["ItemDateTaken_Year"]
        }), "ItemDateTaken_Year"),
        Month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "Time of Day": ["Dawn", "Morning", "Noon", "Afternoon", "Evening", "Night"]
    },
    Location: {
        Country: () => unit(db.locationCountry.findMany({
            select: { LocationCountry_Name: true },
            distinct: ["LocationCountry_Name"]
        }), "LocationCountry_Name"),
        State: () => unit(db.locationRegion.findMany({
            select: { LocationRegion_Name: true },
            distinct: ["LocationRegion_Name"]
        }), "LocationRegion_Name"),
        City: () => unit(db.locationDistrict.findMany({
            select: { LocationDistrict_Name: true },
            distinct: ["LocationDistrict_Name"]
        }), "LocationDistrict_Name"),
    }
};

export const getIncrementValues = fn(async props => {
    /** @ts-ignore @type {typeof Chain["chain"][number]} */
    const recent = props.chain.pop(); // @ts-ignore
    const options = CHOICE[recent.type][recent.choice];
    
    if(typeof options == "function")
        return options();
    else if(!options)
        throw new Error(`Type '${recent.type}' does not contain '${recent.value}'.`);
    else
        return options;
}, Chain);
