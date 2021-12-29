# rowi-overlay

A overlay web component. This element should not be added or removed from the DOM manually, but using its methods `open()` and `close()`. This element contents will be shown on top of anything in the document, when opened. You can tell if the element is opened by checking the property `_opened`.

## Properties

- `opacity`
    - type: `number`
    - default: `0`.
    - Description: The opacity of the overlay background.
    - Attribute: `data-opacity`.
    - Event: `$opacity`.

- `color`
    - type: `string`
    - default: `0,0,0`.
    - Description: The color of the overlay background. It's a comma-separated string with numbers between 0 and 255 for red, green and blue colors.
    - Attribute: `data-color`.
    - Event: `$color`.

- `transitionTime`
    - type: `number`
    - default: `300`.
    - Description: The time in ms it takes to open and close the overlay.
    - Attribute: `data-transition-time`.
    - Event: `$transitionTime`.

- `persistent`
    - type: `boolean`
    - default: `false`.
    - Description:  Whether the overlay can be closed (if false) or not.
    - Attribute: `data-persistent`.
    - Event: `$persistent`.

- `intangible`
    - type: `boolean`
    - default: `false`.
    - Description:  Whether the overlay can be clicked through (if true) or not.
    - Attribute: `data-intangible`.
    - Event: `$intangible`.
