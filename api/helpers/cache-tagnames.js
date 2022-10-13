import { declareProps, fn, MOptional } from "@hwyblvd/st"
import { db } from "./-db.js"
import { MNext, MRequire } from "./-types.js";

const { ForceNonPrimaryTags } = declareProps({
    /** ### Show duplicate tags
     * This option will show all tags, 
     * by default, only primary tags are 
     * shown. The rest are alternative 
     * spellings, usually not needed.
     */
    forceNonPrimaryTags: MOptional(false),

});

const useWhereTagPrimary = fn(props => {
    let where = {};
    if(!props.forceNonPrimaryTags) {
        where = { TagVariant_IsPrimary: { equals: 1 } };
    }
    return where;
}, ForceNonPrimaryTags);

const fetchTagVariants = fn(async props => {
    const tagVariants = await db.tagVariant.findMany({
        select: {
            TagVariant_TagResourceId: true,
            TagVariant_Text: true
        },
        where: useWhereTagPrimary(props)
    });
    return { 
        /** ### Tag Variant[]
         * The text description of a tag, 
         * it's always one word. Cannot directly 
         * SQL `join` onto the `db.items` table, 
         * use TagResourceId first.
         */
        tagVariants 
    };
}, useWhereTagPrimary);

const reduceTagVariants = fn(props => {
    /** @type {Map<number, string>} */
    const variantsById = new Map;
    for (const v of props.tagVariants) {
        variantsById.set(v.TagVariant_TagResourceId || -1, v.TagVariant_Text || "");
    }
    return { 
        /** ### Variant to TagId
         * Use this to lookup 
         * the text content of a tag 
         * using its TagResourceId.
         */
        variantsById 
    };
}, MRequire(fetchTagVariants));

const fetchTagIds = fn(async props => {
    const tagIds = await db.tag.findMany({
        select: { Tag_ResourceId: true, Tag_Id: true },
    });
    return {
        /** ### TagId to TagResourceId 
         * Reduce over these pairs to 
         * directly connect TagId to text 
         * content. Consume TagResourceId 
         * to remove it from the join.
         */
        tagIds
    };
}, useWhereTagPrimary);

const reducePairsOnVariants = fn(props => {
    /** @type {{[tagId: number]: string | undefined}} */
    const cacheTagNames = {};
    for (const t of props.tagIds) {
        cacheTagNames[t.Tag_Id] = props.variantsById.get(t.Tag_ResourceId || -1);
    }
    return { 
        /** ### TagId to TagName
         * This cache needs to be created 
         * at the start of the program. 
         * For its lifetime, use this object-
         * style cache to instantly lookup 
         * a TagName by the TagId.
         */
        cacheTagNames 
    };
}, MRequire(reduceTagVariants), MRequire(fetchTagIds));

const createCacheTagNames = fn(async props => {
    const { tagIds } = await fetchTagIds(props);
    const { tagVariants } = await fetchTagVariants(props);
    MNext(props, () => ({ tagIds, tagVariants }));
    MNext(props, reduceTagVariants);
    MNext(props, reducePairsOnVariants);
    return props;
}, fetchTagIds);

export const { cacheTagNames } = await createCacheTagNames({});