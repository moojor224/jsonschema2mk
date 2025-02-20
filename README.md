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
    * $ref is same file, $id, $anchor
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
  * if, then, else
  * multiple types (`type: ["string", "null"]`)
  * object: dependencies (Properties and Schema)


### Missing JSON schema features

  * $ref remotely or in other files


## Install & Usage

```sh
npm i @moojor224/jsonschema2mk
```


<table>
  <thead>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>--schema schema.json</code></td>
    <td>Specify a JSON Schema file to convert.<br/>Default: <code>schema.json</code></td>
  </tr>
  <tr>
    <td><code>--partials dir</code></td>
    <td>Overwrite partials from dir. You can overwrite every partial (see directory partials/) or define own ones. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td><code>--extension ext</code></td>
    <td>Load feature extension. See <a href="#internal-feature-extensions-option-extension">section</a>. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td><code>--plugin p</code></td>
    <td>Load plugin. See <a href="#load-external-plugins-option-plugin">section</a>. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td><code>--level number</code></td>
    <td>Initial Markdown heading level. Default is Zero.</td>
  </tr>
  </tbody>
</table>


### Load External Plugins (Option plugin)

In the plugin, you can load your own partials. It has the same API as extensions.

The Arguments Vector is available via `data.argv`.

Example:

```js
module.exports = function(data, jsonschema2mk) {
	jsonschema2mk.load_partial_dir(__dirname + "/partials");
};
```



## Usage as Libray

You can integration this code as Library.

```js
const jsonschema2mk = require("jsonschema2mk");

const schema = {
	"type": "number"
};

const jsm = new jsonschema2mk({
	level: 0
});
const output = jsm.convert(schema);
```

Options

<table>
  <thead>
  <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>partials</td>
    <td><code>string</code></td>
    <td>Overwrite partials. Define dir, where to load partioals from. You can overwrite every partial (see directory partials/) or define own ones. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td>extension</td>
    <td><code>string</code></td>
    <td>Load feature extension. See <a href="#internal-feature-extensions-option-extension">section</a>. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td>plugin</td>
    <td><code>string</code></td>
    <td>Load plugin. See <a href="#load-external-plugins-option-plugin">section</a>. This option can be used multiple times.</td>
  </tr>
  <tr>
    <td>level</td>
    <td><code>number</code></td>
    <td>Initial Markdown heading level. Default is Zero.</td>
  </tr>
  </tbody>
</table>

## Examples

The README.md files of all applications of the [osiota project](https://github.com/osiota/) are generated with the help of this program. See the adaption script in the [osiota-dev repository](https://github.com/osiota/osiota-dev/blob/master/doc-jsonschema) as well.

Examples:

  * [osiota-app-modbus](https://github.com/osiota/osiota-app-modbus)
  * [osiota-app-onewire](https://github.com/osiota/osiota-app-onewire)


## License

This software is released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
