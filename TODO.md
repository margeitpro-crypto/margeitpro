# TODO for Fixing Dropdown Overflow in MergeLogs.tsx

- [x] Import useFloating, FloatingPortal, flip, shift, offset from @floating-ui/react
- [x] Remove dropdownPosition state and related manual positioning logic
- [x] Add refs for button and dropdown elements
- [x] Initialize useFloating hook with offset(5), flip(), shift() middleware
- [x] Update handleDropdownToggle to set reference element
- [x] Wrap dropdown in FloatingPortal and apply floating styles
- [x] Remove old style attributes from dropdown div
