export default function helper_examples() {
    const exports: any = {};
    const examples_get = function (examples: any) {
        if (!Array.isArray(examples) || !examples.length) {
            return undefined;
        }
        return examples[0];
        /*
        // pick example randomly:
        if (examples.length == 1) {
            return examples[0];
        }
        return examples[Math.floor(Math.random()*examples.length)];
        */
    };


    const merge_examples = function (item: any): any {
        if (Array.isArray(item.examples) && item.examples.length) {
            return examples_get(item.examples);
        }
        if (typeof item.default !== "undefined") {
            return item.default;
        }

        if (item.type === "object") {
            return merge_examples_object(item.properties);
        }
        if (item.type === "array") {
            if (Array.isArray(item.items)) {
                const e: any[] = [];
                item.items.forEach(function (itemelement: any, i: any) {
                    const e_i = merge_examples(itemelement);
                    if (e_i !== undefined)
                        e[i] = e_i;
                });
                if (e.length) return e;
            } else if (typeof item.items === "object" &&
                item.items !== null) {
                const e = merge_examples(item.items);
                if (e !== undefined) return [e];
            }
        }
        return undefined;
    };
    const merge_examples_object = function (properties: any) {
        const e: any = {};
        for (const name in properties) {
            const property = properties[name];
            const v = merge_examples(property);
            if (typeof v !== "undefined") {
                e[name] = v;
            }
        }
        return e;
    };

    exports.get_example = function (item: any) {
        return merge_examples(item);
    };

    exports.get_examples = function (item: any) {
        if (Array.isArray(item.examples) && item.examples.length) {
            return item.examples;
        }
        if (typeof item.default !== "undefined") {
            return [item.default];
        }
        const m = merge_examples(item);
        if (m) return [m];
        return undefined;
    };
    return exports;
}