import helper from "./helper";
import Handlebars from "handlebars";
import helper_examples from "./helper_examples";
import * as partials from "./partials";

export class json2md {
    Helper: typeof import("./helper");
    Handlebars: typeof Handlebars;
    data: {
        schema: any;
        argv: any;
        [key: string]: any;
    }

    constructor(options: any) {

        this.Helper = helper();
        this.Handlebars = Handlebars.create();
        this.Handlebars.registerHelper(this.Helper);
        this.Handlebars.registerHelper(helper_examples());
        this.load_partial_dir(partials);
        this.data = {
            schema: undefined,
            argv: options,
        }
        // @ts-expect-error asd
        this.Helper.data = this.data;

        if (typeof options.level !== "undefined") {
            // @ts-expect-error asd
            this.Helper.level_plus = options.level;
        }

        // Load user defined partials
        if (options.partials) {
            if (!Array.isArray(options.partials)) {
                options.partials = [options.partials];
            }
            options.partials.forEach((partials: object) => {
                this.load_partial_dir(partials);
            });
        }
    }

    load_partial_dir(partials: any) {
        for (const file in partials) {
            this.Handlebars.registerPartial(file, partials[file]);
        }
    }

    _generate: HandlebarsTemplateDelegate<any> | null = null;
    generate(context: any, options?: Handlebars.RuntimeOptions) {
        if (!this._generate) {
            this._generate = this.Handlebars.compile("{{> main}}");
        }
        return this._generate(context, options);
    }

    convert(schema: any) {
        delete this.data["$ids"];
        this.data.schema = schema;
        return this.generate(this.data);
    }
}