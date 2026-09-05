/**
 * The SVG sits alone inside the surface, so it carries the full radius.
 * Used by msq-svg.
 */
export const svgWithFullRadius = /*css*/`
  div[data-inner-wrapper] svg {
    border-radius: var(--border-radius);
    display: block;
  }
`

/**
 * Something follows the SVG inside the surface (the midi player, the errors
 * panel), so only its top corners are rounded.
 * Used by msq-svg-midi and msq-editor.
 */
export const svgWithTopRadius = /*css*/`
  div[data-svg-container] svg {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    display: block;
  }
`
