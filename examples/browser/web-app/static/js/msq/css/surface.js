export default /*css*/`
  div[data-inner-wrapper] {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    width: max-content;
    height: max-content;
    padding: 0;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    background: var(--surface-bg);
  }
  div[data-scroll] {
    border-radius: var(--border-radius);
    overflow: auto;
    scrollbar-width: none;
  }
  div[data-scroll]::-webkit-scrollbar {
    display: none;
  }
`
