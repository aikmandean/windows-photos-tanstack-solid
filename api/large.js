import { fn } from "@hwyblvd/st"
import { db } from "./helpers/-db.js";
import { cacheTagNames } from "./helpers/cache-tagnames.js";

const whereNotOpaque = {
    Item: {
        Item_FileName: { not: { endsWith: "heic" } }
    }
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
            ...whereNotOpaque,
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
        where: whereNotOpaque
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
        where: whereNotOpaque
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