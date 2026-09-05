export default /*css*/`
  div[data-utils] {
    position: absolute;
    top: 0.4em;
    right: 0.4em;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0.0em;
    font-family: sans-serif;
  }
  div[data-inner-wrapper]:not(:hover) div[data-utils] {
    display: none;
  }
  div[data-utils] button {
    text-align: center;
    background: rgba(204, 204, 204, 0);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    transition: background-color 0.25s ease 0s;
    padding: 0;
    cursor: pointer;
  }
  div[data-utils] button[hidden] {
    display: none;
  }
  div[data-utils] button:not(:disabled):hover {
    background: rgba(204, 204, 204, 0.3);
  }
  div[data-utils] button:not(:disabled):active {
    background: rgba(204, 204, 204, 0.6);
  }
  div[data-utils] button svg {
    vertical-align: middle;
    fill: #000;
    margin: 0 auto;
  }
`
