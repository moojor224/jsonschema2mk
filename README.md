# JSON schema to markdown generator (jsonschema2mk)

This project allows to generate documentation from [JSON Schema](https://json-schema.org) spezifications.

Examples:

  * [Configuration osiota ArtNet app](test/010-example-artnet.md) ([see project](https://github.com/osiota/osiota-app-artnet/blob/master/README.md))
  * [Configuration osiota Modbus app](test/011-example-modbus.md) ([see project](https://github.com/osiota/osiota-app-modbus/blob/master/README.md))

### Supported JSON schema features

  * Basic attributes:
    * title, description, default, examples
    * enum, const
    * deprecated
    * $ref locally
  * number, integer
    * minimum, maximum, exclusiveMinimum, exclusiveMaximum
    * multipleOf
  * string
    * minLength, maxLength
    * format
    * pattern
    * contentMediaType
    * contentEncoding
  * boolean
  * null
  * object
    * properties
    * additionalProperties (as boolean and as object)
    * patternProperties
    * required
    * minProperties, maxProperties
    * propertyNames.pattern
  * array
    * items (schema)
    * items (array of schemas)
    * minItems, maxItems
    * uniqueItems
    * contains
    * minContains, maxContains
  * allOf, oneOf, anyOf, not (not for object properties)
  * multiple types (`type: ["string", "null"]`)


### Missing JSON schema features

  * if, then, else
  * object: dependencies (Properties and Schema)


## Install & Usage

```sh
npm install jsonschema2mk
```

Generate DOC.md:

```sh
npx jsonschema2mk --schema schema.json >DOC.md
```

Overwrite some partials with own partials:

```sh
npx jsonschema2mk --schema schema.json --partials dir/ >DOC.md
```

## Add to your project

Add to package.json:

```json
{
	"scripts": {
		"doc": "jsonschema2mk --schema schema.json >DOC.md"
	}
}
```

and run `npm run doc`.

## Plugins

If partial overwriting is not enogh (see above), you can load plugins.

In the plugin, you can load your own partials:

```js
const fs = require("fs");

module.exports = function(data, jsonschema2mk) {
	jsonschema2mk.load_partial_dir(__dirname + "/partials");
};
```

## Usage as Libray

You can integration this code as Library. See `cli.js` for an example.

## Examples

The README.md files of all applications of the [osiota project](https://github.com/osiota/) are generated with the help of this program. See the adaption script in the [osiota-dev repository](https://github.com/osiota/osiota-dev/blob/master/doc-jsonschema) as well.

Examples:

  * [osiota-app-modbus](https://github.com/osiota/osiota-app-modbus)
  * [osiota-app-onewire](https://github.com/osiota/osiota-app-onewire)


## License

This software is released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
