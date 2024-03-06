![Demo](images/demo.gif)

# Radix Studio

Radix Studio is an open-source WYSIWYG web design editor with real-time interaction and code generation.

The main goal is to destroy the barrier between design and development by eliminating the time and effort to convert the design to code.

[Radix Themes](https://www.radix-ui.com/) is the primary component library for the editor as you can see in the name. But any other component library or even custom components including the native DOM elements can be used.

Try the demo at [radix-ui.studio](https://radix-ui.studio/) and see how it works. You can't save or load your work yet.

> **Note**: It is still in development and not ready for production.

## Dev

```sh
bun install
bun run dev
```

## Roadmap

- [ ] Declare drawer item with node then clone node when drag and drop to easel
- [ ] Re-write UI guides in Vanilla
- [ ] Routing
  - [ ] Connect to other pages
- [x] Focus on the page on creation
- [ ] Handle ground overscroll
- [x] Keyboard shortcuts
- [x] Improve design mode
- [x] Multiple pages
  - [x] Render multiple pages inside a single ground
- [ ] Click drawer item to add node to easel
- [ ] Stop unnecessary css animations of components
- [x] Tree view
- [ ] Lock/unlock nodes
- [ ] Improve text-based nodes controlling experience
- [x] Seamless panning from inside iframe to outside iframe
- [ ] View (Template)
  - [ ] Labeling
  - [ ] Detached
  - [ ] Synced
- [ ] Conditional rendering
- [ ] Repetitive rendering
- [x] Subscription-based global node atoms list update instead of registering/deleting logic inside each function
- [x] Use iframe for easel
  - [x] Sync drag and drop
    - [x] Sync events
      - [x] Sync mouse events
      - [x] Sync keyboard events
  - [x] Sync atoms
- [x] Drag and drop nodes
  - [x] From drawer to easel
    - [x] Add to container
    - [x] Add to index of container
  - [x] Generalize implementation -> easel and easel -> easel (currently duplicate implementation)
  - [x] Move inside easel
    - [x] Move to another container
      - [x] Prevent moving outer container to inner container (tree violation)
        - [x] Improve logic. Check contains -> Just ignore pointer events on the dragging elements
    - [x] Move to another index of container
- [ ] Multi selection, dragging, editing
  - [x] Multi selection
  - [ ] Drag and drop multiple nodes
  - [x] Delete multiple nodes
  - [x] Multiple node editing
- [x] Context menu
- [ ] Copy and paste nodes
  - [ ] Copy nodes
  - [ ] Paste nodes
  - [ ] Paste nodes to another container
  - [ ] Paste nodes to another index of container
- [ ] Generate tsx code
  - [ ] Download file
    - [x] Download single file
    - [ ] zip multiple files
  - [x] Props
  - [x] Self closing tag when there is no children
  - [x] Generate part of code
- [ ] Type meta data
  - [ ] Record components version
- [x] Separate node properties to props key
- ~~Use `map` or `deepMap` for node atoms~~
- [ ] Declarative application generation
  - [ ] Generate Studio code itself from component language server
  - [ ] Generate type guard functions
- [ ] Solution for handling components version up
- [x] Improve rendering performance on bulk node update
  - For example, when inserting multiple nodes, it should not re-render the easel for each node insertion.
  - This is not a problem for now. But it will be a problem when we have a lot of nodes.
- [x] Flexible easel positioning
  - [x] Zoom in/out
  - [x] Pan
- [ ] Undo/Redo
  - [x] Action-based instead of state-based
  - [x] Bundle multiple actions into a single action bundle
  - [x] Insert
  - [x] Remove
  - [x] Move nodes (Insert)
  - [ ] Properties
  - [ ] Slots
  - [x] Wrap (Insert)
  - [x] Unwrap (Insert + Remove)
  - [x] Resize pages
  - [ ] Move pages (translate)
- [x] Composition components are not containable nodes
- [x] Don't add custom style or class to components. Instead use `data-*` attributes for custom styling.
- ~~Pass shared data from top window to iframe through postMessage instead of window injecting.~~
- [x] Wrap common node props to a single object. (instead of rest props)
- ~~Inject node attributes to the outermost element of components.~~
- [ ] State management

## License

Radix Studio is licensed under the [MIT License](LICENSE).
