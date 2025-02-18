export const array = `{{#if (isdefined items)~}}
{{#if (equal (gettype items) "array")}}
{{#each items}}

**Item {{plus @key 1}}{{#if title}}: {{title}}{{/if}}**

{{#if (or description deprecated)}}

{{#if deprecated}}(DEPRECATED) {{/if}}{{{description}}}

{{/if~}}

{{> type . path=(pathjoin path @key .) prefix_text=(plus "Item " (plus (plus @key 1) " "))}}

{{/each~}}
{{else~}}
**Items{{#if items.title}}: {{items.title}}{{/if}}**

{{#if (or items.description items.deprecated)}}

{{#if items.deprecated}}(DEPRECATED) {{/if}}{{{items.description}}}

{{/if~}}

{{> type items path=(pathjoin path "" .) prefix_text="Item "~}}
{{/if~}}


{{~#if (isdefined minItems)}}
**Minimum Items:** {{escape minItems}}{{br}}
{{/if~}}
{{#if (isdefined maxItems)}}
**Maximum Items:** {{escape maxItems}}{{br}}
{{/if~}}
{{#if (isdefined uniqueItems)}}
**Unique Items:** {{#if uniqueItems}}yes{{else}}no{{/if}}{{br}}
{{/if~}}

{{/if~}}

{{#if (isdefined contains)~}}
**Contains Items{{#if contains.title}}: {{contains.title}}{{/if}}**

{{#if (or contains.description contains.deprecated)}}

{{#if contains.deprecated}}(DEPRECATED) {{/if}}{{{contains.description}}}

{{/if~}}

{{> type contains path=(pathjoin path "" .) prefix_text="Contains Item "~}}

{{#if (isdefined minContains)}}
**Minimum Contains:** {{escape minContains}}{{br}}
{{/if~}}
{{~#if (isdefined maxContains)}}
**Maximum Contains:** {{escape maxContains}}{{br}}
{{/if~}}

{{/if~}}
`;
export const element_part = `{{#if (or description deprecated)}}

{{#if deprecated}}(DEPRECATED) {{/if}}{{{description}}}

{{/if}}

{{> type . ~}}
{{#each (get_examples .) ~}}
{{> example ~}}
{{/each ~}}
`;
export const type = `{{#if (noproperties .)}}
{{#if required}}
**Required Properties:**

{{#each required}}
  * {{this}}
{{/each}}
{{else}}
**No properties.**

{{/if}}
{{/if}}
{{#if (is_type type "object") ~}}
{{> object . ~}}
{{~else~}}
{{#if (is_type type "array") ~}}
{{> array . ~}}
{{~else~}}
{{> simple ~}}
{{/if ~}}
{{/if ~}}

{{#each oneOf}}
 {{br}}
**Option {{plus @key 1}} (alternative):** {{> element_part . type=(or type ../type) path=(pathjoin path (plus "Option " (plus (plus @key 1) ": ")))}}
{{/each}}
{{#each anyOf}}
 {{br}}
**Option {{plus @key 1}} (optional):** {{> element_part . type=(or type ../type) path=(pathjoin path (plus "Option " (plus (plus @key 1) "]: ")))}}
{{/each}}
{{#each allOf}}
 {{br}}
{{> element_part . type=(or type ../type) path=(pathjoin path @key)}}
{{/each}}
{{#each not}}
 {{br}}
**Not [{{plus @key 1}}]:** {{> element_part . type=(or type ../type) path=(pathjoin path (plus "not[" (plus (plus @key 1) "]: ")))}}
{{/each}}
{{#if if}}
 {{br}}
{{explain if type}}

{{#if (isdefined then)~}}
**THEN**

{{#if then}}
{{> element_part then type=(or then.type type) path=(pathjoin path "then")}}
{{else}}
never valid.
{{/if}}

{{/if}}
{{#if (isdefined else)~}}
**OTHERWISE**

{{#if else}}
{{> element_part else type=(or then.type type) path=(pathjoin path "else")}}
{{else}}
never valid.
{{/if}}

{{/if}}
{{/if}}
`;
export const simple = `{{~#if (isdefined type)}}
**{{prefix_text}}Type:** {{code type}}{{br}}
{{/if}}
{{> extra .}}
`;
export const object = `{{#if (length properties) ~}}
**{{prefix_text}}Properties**

{{> object_property_header}}
{{#each properties ~}}
{{> object_property (jsmk_property . path=(pathjoinobj ../path @key .) parent=.. name=@key)}}
{{/each}}

{{/if}}
{{#if (length patternProperties) ~}}
**{{prefix_text}}Properties (Pattern)**

{{> object_property_header}}
{{#each patternProperties ~}}
{{> object_property (jsmk_property . path=(pathjoinobj ../path @key .) parent=.. name=@key)}}
{{/each}}

{{/if}}
{{#if (isdefined additionalProperties)}}
{{#if (equal (gettype additionalProperties) "boolean")}}
**{{prefix_text}}Additional Properties:** {{#unless additionalProperties}}not {{/unless}}allowed{{br}}
{{else}}
**{{prefix_text}}Additional Properties**

{{> object_property_header}}
{{#each properties ~}}
{{> object_property (jsmk_property . path=(pathjoinobj ../path @key .) parent=.. name=@key)}}
{{/each}}

{{/if}}
{{/if~}}

{{#if (isdefined minProperties)}}
**{{prefix_text}}Minimal Properties:** {{escape minProperties}}{{br}}
{{/if~}}
{{#if (isdefined maxProperties)}}
**{{prefix_text}}Maximal Properties:** {{escape maxProperties}}{{br}}
{{/if~}}
{{#if (and (isdefined propertyNames) (isdefined propertyNames.pattern))}}
**{{prefix_text}}Property Name Pattern:** {{code (escapeRegexp propertyNames.pattern)}}{{br}}
{{/if~}}
{{#if (isdefined dependentRequired)}}
{{#each dependentRequired}}
**{{prefix_text}}If property *{{@key}}* is defined**, property/ies {{#each this}}*{{this}}*{{#unless @last}}, {{/unless}}{{/each}} is/are required.{{br}}
{{/each}}
{{/if~}}
{{#if (isdefined dependentSchemas)}}
{{#each dependentSchemas}}
**{{prefix_text}}If property *{{@key}}* is defined**:

{{> element_part this type=(or type ../type) path=(pathjoin path (plus "dependentSchemas " @key))}}

{{/each}}
{{/if~}}
`;
export const object_property = `|
	{{~#mylink .}}**{{escape name}}**{{/mylink ~}}
	{{#if (and title (title_isnot_name .))}}<br/>({{escape title}}){{/if ~}}
|
	{{~code display_type ~}}
|
	{{~#if deprecated}}(DEPRECATED)<br/>{{/if}}
	{{~#if description ~}}
	{{firstline description .}}<br/>{{/if ~}}
	{{>extra_inline . ~}}
|
	{{~#if (isdefined required)}}{{#if required}}yes{{else}}no{{/if}}{{/if~}}
|
`;
export const object_property_header = `|Name|Type|Description|Required|
|----|----|-----------|--------|
`;
export const main = `{{> element schema path=""}}
`;
export const extra = `{{~#if (isdefined enum)~}}
**{{prefix_text}}Enum:** {{jsoninline enum}}{{br}}
{{/if}}
{{~#if (isdefined const)~}}
**{{prefix_text}}Constant Value:** {{jsoninline const}}{{br}}
{{/if}}
{{~#if (is_type type "string") ~}}
	{{~#if (isdefined contentMediaType)~}}
**{{prefix_text}}Content Media Type:** {{jsoninline contentMediaType}}{{br}}
{{/if}}
	{{~#if (isdefined contentEncoding)~}}
**{{prefix_text}}Content Encoding:** {{jsoninline contentEncoding}}{{br}}
{{/if}}
	{{~#if (isdefined minLength)~}}
**{{prefix_text}}Minimal Length:** {{jsoninline minLength}}{{br}}
{{/if}}
	{{~#if (isdefined maxLength)~}}
**{{prefix_text}}Maximal Length:** {{jsoninline maxLength}}{{br}}
{{/if}}
	{{~#if (isdefined format)~}}
**{{prefix_text}}Format:** {{jsoninline format}}{{br}}
{{/if}}
	{{~#if (isdefined pattern)~}}
**{{prefix_text}}Pattern:** {{code (escapeRegexp pattern)}}{{br}}
{{/if}}
{{~/if}}
{{~#if (or (is_type type "number") (is_type type "integer"))~}}
	{{~#if (isdefined exclusiveMinimum)~}}
**{{prefix_text}}Minimum (exclusive):** {{jsoninline exclusiveMinimum}}{{br}}
{{/if}}
	{{~#if (isdefined minimum)~}}
**{{prefix_text}}Minimum:** {{jsoninline minimum}}{{br}}
{{/if}}
	{{~#if (isdefined exclusiveMaximum)~}}
**{{prefix_text}}Maximum (exclusive):** {{jsoninline exclusiveMaximum}}{{br}}
{{/if}}
	{{~#if (isdefined maximum)~}}
**{{prefix_text}}Maximum:** {{jsoninline maximum}}{{br}}
{{/if}}
	{{~#if (isdefined multipleOf)~}}
**{{prefix_text}}Multiple of:** {{jsoninline multipleOf}}{{br}}
{{/if}}
{{~/if~}}
`;
export const extra_inline = `{{~#if (isdefined default)}}{{prefix_text}}Default: {{jsoninline default}}<br/>{{~/if}}
{{~#if (isdefined enum)}}{{prefix_text}}Enum: {{jsoninline enum}}<br/>{{~/if}}
{{~#if (isdefined const)}}{{prefix_text}}Constant Value: {{jsoninline const}}<br/>{{~/if}}
{{~#if (isdefined contentMediaType)}}{{prefix_text}}Content Media Type: {{jsoninline contentMediaType}}<br/>{{~/if}}
{{~#if (isdefined contentEncoding)}}{{prefix_text}}Content Encoding: {{jsoninline contentEncoding}}<br/>{{~/if}}
{{~#if (isdefined minLength)}}{{prefix_text}}Minimal Length: {{jsoninline minLength}}<br/>{{~/if}}
{{~#if (isdefined maxLength)}}{{prefix_text}}Maximal Length: {{jsoninline maxLength}}<br/>{{~/if}}
{{~#if (isdefined format)}}{{prefix_text}}Format: {{jsoninline format}}<br/>{{~/if}}
{{~#if (isdefined pattern)}}{{prefix_text}}Pattern: {{code (escapeRegexp pattern)}}<br/>{{~/if~}}
{{~#if (isdefined exclusiveMinimum)}}{{prefix_text}}Minimum (exclusive): {{jsoninline exclusiveMinimum}}<br/>{{~/if}}
{{~#if (isdefined minimum)}}{{prefix_text}}Minimum: {{jsoninline minimum}}<br/>{{~/if}}
{{~#if (isdefined exclusiveMaximum)}}{{prefix_text}}Maximum (exclusive): {{jsoninline exclusiveMaximum}}<br/>{{~/if}}
{{~#if (isdefined maximum)}}{{prefix_text}}Maximum: {{jsoninline maximum}}<br/>{{~/if}}
{{~#if (isdefined multipleOf)}}{{prefix_text}}Multiple of: {{jsoninline multipleOf}}<br/>{{~/if~}}
`;
export const example = `{{#if (length .) ~}}
**Example**

{{{json .}}}

{{/if~}}
`;
export const element = `{{#if path~}}
<a name="{{{tolink (or path 'root')}}}"></a>
{{/if~}}
{{{mdlevel path}}}{{#if path}} {{escape path}}:{{/if}} {{escape (or title (or type 'any'))}}
{{#if (or description deprecated)}}

{{#if deprecated}}(DEPRECATED) {{/if}}{{{description}}}

{{/if}}

{{> type . ~}}
{{#each (get_examples .) ~}}
{{> example ~}}
{{/each ~}}
{{#each (get_ref_items) ~}}
{{>element . ~}}
{{/each ~}}
`;