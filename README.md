# Bottom Sheet
A responsive bottom sheet for react applications. This bottom sheet will morph into a more standard modal appearance when the screen size is above that of a typical mobile device

<video title="Mobile Demo" src="https://github.com/user-attachments/assets/282a6ad0-103d-43a8-9ecb-7ae80eb9e941" height="auto" width="auto"></video>
<video title="Desktop Demo" src="https://github.com/user-attachments/assets/7e5a6b0a-4a98-47fb-b9ca-70282e9e4880" height="auto" width="auto"></video>

## Installation
```bash
npm i @figliolia/bottom-sheet
# or
yarn add @figliolia/bottom-sheet
```

## Basic Usage
To create a bottom sheet, wrap your content in `<BottomSheet/>` tags and specify your options:
```tsx
import { BottomSheet } from "@figliolia/bottom-sheet";

export const BottomSheetForm = ({ open, closeFN }: {
  open: boolean;
  closeFN: () => void;
}) => {
  return (
    <BottomSheet 
      dim 
      notch 
      open={open}
      close={closeFN}
      className="my-bottom-sheet">
      <form>
        <input type="text" placeholder="Enter a value:"/>
        <input type="submit">Submit</button>
      </form>
    </BottomSheet>
  );
}
```
You've now created a bottom sheet that'll morph into a modal on larger devices!

## Options
 
| Option  | Default Value | Description |
| ------------- | ------------- | ------------- |
| `dim`  | `false`  | Whether to dim the background when the bottom sheet is open |
| `notch`  | `false`  | Whether to display an `iOS` like swipe indicator on the top of the bottom sheet when viewing on mobile devices |
| `clickOutside`  | `true`  | Whether clicking outside the bottom sheet will cause it to close |
| `open`  | `false`  | A trigger to open/close the bottom sheet |
| `close`  | `undefined`  | A callback to run when the bottom sheet is closed |
| `className`  | `undefined`  | An optional css class to apply to your bottom sheet |
| `children`  | `undefined`  | Content elements you wish to render inside your bottom sheet |

## Browser Support
This package relies on CSS variables and nesting in order to function. For more detailed information on specific browser version support, please reference the [CSS Variables](https://caniuse.com/css-variables) and [CSS Nesting](https://caniuse.com/?search=css%20nesting) support tables.
