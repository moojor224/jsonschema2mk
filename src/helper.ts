import Handlebars from "handlebars";
// @ts-expect-error asd
import { explain as explain_json_schema } from "explain-json-schema";

export default function test() {
    const exports: {
        [key: string]: any
    } | any = {
        data: undefined,
    };
    exports.data = undefined;
    exports.setData = function (d: any) {
        exports.data = d;
    }

    exports.br = function () {
        //return new Handlebars.SafeString("<br/>");
        return new Handlebars.SafeString("  ");
    };

    exports.or = function (a: any, b: any) {
        return a || b;
    };

    exports.and = function (a: any, b: any) {
        return a && b;
    };

    exports.gettype = function (value: any) {
        if (Array.isArray(value)) return "array";
        return typeof value;
    };

    exports.isdefined = function (value: any) {
        if (typeof value === "undefined" || value === null)
            return false;
        return true;
    };

    exports.escape = function (text: { toString: () => string; } | null) {
        if (typeof text === "undefined" || text === null) return "";
        const result = text.toString()
            .replace(/([\|\\`*_{}\[\]()#+.!-])/g, '\\$1');
        return new Handlebars.SafeString(result);
    };

    exports.escapeRegexp = function (text: { toString: () => string; } | null) {
        if (typeof text === "undefined" || text === null) return "";
        const result = text.toString().replace(/(\|)/g, "\\$1");
        return new Handlebars.SafeString(result);
    }

    exports.json = function (string: any) {
        const result = "```json\n" +
            JSON.stringify(string, undefined, "    ") + "\n" +
            "```";
        return new Handlebars.SafeString(result);
    };

    exports.code = function (string: any[]) {
        if (typeof string === "undefined") return "";
        if (!Array.isArray(string))
            string = [string];
        const result = string.map(function (s: { toString: () => string; }) {
            return "`" +
                s.toString().replace(/(`)/g, "\\$1") +
                "`";
        }).join(", ");
        return new Handlebars.SafeString(result);
    };

    exports.jsoninline = function (string: any[]) {
        if (typeof string === "undefined") return "";
        if (Array.isArray(string)) {
            const result = string.map(function (elem) {
                return exports.jsoninline(elem);
            }).join(", ");
            return new Handlebars.SafeString(result);
        }
        const result = "`" +
            JSON.stringify(string).replace(/(`)/g, "\\$1") +
            "`";
        return new Handlebars.SafeString(result);
    };

    exports.equal = function (a: any, b: any) {
        return a === b;
    };

    exports.repeat = function (string: { toString: () => string; }, times: any) {
        return string.toString().repeat(times);
    };

    exports.regexp = function (text: { toString: () => string; }, regexp: string | RegExp, new_str: any) {
        const r = new RegExp(regexp);
        return text.toString().replace(r, new_str);
    };
    exports.regexpTest = function (text: { toString: () => string; } | null, regexp: string | RegExp) {
        if (typeof text === "undefined" || text === null) return false;
        const r = new RegExp(regexp);
        return r.test(text.toString());
    };

    exports.level_plus = 0;
    exports.mdlevel = function (path: string, options: { hash: { plus: number; }; }) {
        let level = 1;
        if (path && path !== "root") {
            level = path.split(/\./).length + 1;
        }
        if (options.hash.plus) {
            level += options.hash.plus;
        }
        return new Handlebars.SafeString(
            "#".repeat(level + exports.level_plus)
        );
    };

    exports.pathjoinobj = function (path: string, property_name: string, object: { type: any; }) {
        if (property_name === "") {
            path = (path ? path : "item");
        } else {
            path = (path ? path + "." : "") + property_name;
        }
        path = path + (exports.is_type(object.type, "array") ? "[]" : "");
        // dont increment level on oneOf, anyOf, allOf, not:
        return path.replace(/: \./, ": ");
    }
    exports.pathjoin = function (path: string, property_name: string) {
        if (property_name === "") {
            path = (path ? path : "item");
        } else {
            path = (path ? path + "." : "") + property_name;
        }
        // dont increment level on oneOf, anyOf, allOf, not:
        return path.replace(/: \./, ": ");
    };

    exports.jsmk_property = function (property: any, options: { hash: any; }) {
        property = exports.getref(property);
        const o = {
            ...property,
            ...options.hash,
        };
        if (!Array.isArray(o.examples) || !o.examples.length) {
            if (typeof o.default !== "undefined") {
                o.examples = [o.default];
            }
        }
        o.display_type = o.type;
        if (exports.is_type(o.type, "array")) {
            o.display_type = "array";
            if (typeof o.items === "object" && o.items !== null &&
                typeof o.items.type === "string") {
                o.display_type = o.items.type + "[]";
            }
        }

        if (exports.is_type(o.type, "object") ||
            exports.is_type(o.type, "array")) {
            exports.push_ref_item(o);
            o.link = "#" + o.path;
        }

        if (typeof o.required === "undefined" &&
            typeof o.parent === "object" && o.parent !== null &&
            Array.isArray(o.parent.required)) {
            o.required = o.parent.required.includes(o.name);
        }

        return o;
    };

    let ref_items: any[] = [];

    exports.get_ref_items = function () {
        const r = ref_items;
        ref_items = [];
        return r;
    };

    exports.push_ref_item = function (item: { path: any; }) {
        if (ref_items.filter(function (ri: any) {
            return ri.path === item.path;
        }).length) {
            return;
        }
        ref_items.push(item);
        return "";
    };

    exports.mylink = function (object: string, options: { fn: (arg0: any) => string; }) {
        if (object.link) {
            const link = exports.tolink(object.link);
            return new Handlebars.SafeString(
                "[" + options.fn(object) + "](" + link + ")");
        }
        return options.fn(object);
    };
    exports.tolink = function (link: string) {
        link = link.toLowerCase().replace(/[^a-zA-Z0-9#_-]/g, "");
        return link;
    }

    exports.plus = function (a: any, b: any) {
        return a + b;
    };

    exports.length = function (object: string | any[] | null) {
        if (Array.isArray(object)) {
            return object.length;
        }
        if (typeof object === "object" && object !== null) {
            return Object.keys(object).length;
        }
        if (typeof object !== "undefined") {
            return true;
        }
        return false;
    };

    exports.getid_objects = function (object: { [x: string]: any; hasOwnProperty: (arg0: string) => any; } | null, id_objects: { [x: string]: any; } | null) {
        // go through all objects and search for $id objects
        if (typeof id_objects !== "object" || id_objects === null) {
            id_objects = {};
        }
        if (typeof object !== "object" || object === null) {
            return id_objects;
        }
        if (typeof object['$id'] === "string") {
            id_objects[object['$id']] = object;
        }
        if (typeof object['$anchor'] === "string") {
            id_objects["#" + object['$anchor']] = object;
        }
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                exports.getid_objects(object[key], id_objects);
            }
        }
        return id_objects;
    };

    exports.getref = function (object: { [x: string]: string; }) {
        if (typeof object['$ref'] === "string") {
            let o = exports.data.schema;
            if (!exports.data["$ids"]) {
                exports.data["$ids"] = exports.getid_objects(o);
            }
            // check ids
            if (exports.data["$ids"].hasOwnProperty(object["$ref"])) {
                const o = exports.data["$ids"][object["$ref"]];
                o.path = object["$ref"];
                return o;
            }

            // local refs:
            if (object['$ref'].match(/^#\//)) {
                const path = object['$ref'].replace(/^#\//, '');
                path.split(/\//).forEach(function (p) {
                    if (o.hasOwnProperty(p) &&
                        typeof o[p] === "object" &&
                        o[p] !== null) {
                        o = o[p];
                    } else {
                        throw new Error("ref not found.");
                    }
                });
                o.path = path;
                return o;
            }

            // remote refs:
            if (object['$ref'].match(/^https?:\/\//)) {
                throw new Error("Remote refs not implemented");
            }

            // file refs:
            throw new Error("File sytem refs not implemented");

        }
        return object;
    };

    exports.noproperties = function (object: { type: any; properties: any; patternProperties: any; additionalProperties: boolean; items: any; contains: any; oneOf: any; anyOf: any; allOf: any; }) {
        if (!exports.is_type(object.type, "object") &&
            !exports.is_type(object.type, "array"))
            return false;
        if (exports.length(object.properties) ||
            exports.length(object.patternProperties) ||
            (exports.length(object.additionalProperties) &&
                object.additionalProperties !== false) ||
            object.additionalProperties === true ||
            exports.length(object.items) ||
            exports.length(object.contains) ||
            exports.length(object.oneOf) ||
            exports.length(object.anyOf) ||
            exports.length(object.allOf)) {
            return false;
        }
        return true;
    };

    exports.title_isnot_name = function (object: { title: string; name: any; }) {
        if (typeof object.title !== "string") return true;
        if (typeof object.name !== "string") return true;
        const name = object.name;
        const title = object.title.replace(/[^a-zA-Z]/g, '_').toLowerCase();
        const title_camelcase = object.title.replace(/[^a-zA-Z]/, '');
        const title_camelcase_lower = title_camelcase.charAt(0).toLowerCase() +
            title_camelcase.slice(1)
        const title_camelcase_upper = title_camelcase.charAt(0).toUpperCase() +
            title_camelcase.slice(1)

        if (name === title) return false;
        if (name === title_camelcase_lower) return false;
        if (name === title_camelcase_upper) return false;
        return true;
    };

    exports.firstline = function (string: { toString: () => string; }, object: any) {
        if (object.link) {
            const result = string.toString()
                .replace(/(?:\n|<br\/>)(?:.|\n)*$/, "")
                .replace(/([\|])/g, '\\$1');
            return new Handlebars.SafeString(result);
        }
        const result = string.toString().replace(/\n/g, "<br/>")
            .replace(/([\|])/g, '\\$1');
        return new Handlebars.SafeString(result);
    };

    exports.is_type = function (type: string | any[], pattern: any) {
        if (Array.isArray(type))
            return type.includes(pattern);
        return type === pattern;
    };

    exports.explain = function (object: any, type: any) {
        const valid = explain_json_schema(object, 0);
        if (valid === null) {
            return "**Always**\n";
        } else if (valid === "never") {
            return "**Never**\n";
        } else {
            return new Handlebars.SafeString(
                "**IF** " + (type || "it") + "\n" + valid
            );
        }
    };
    return exports;
}