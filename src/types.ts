import type { PropsWithChildren, UIEvent } from "react";
import type { DragDetector } from "@figliolia/drag-detector";

export type IBottomSheetProps = PropsWithChildren<{
  open: boolean;
  dim?: boolean;
  notch?: boolean;
  className?: string;
  close: () => void;
  clickOutside?: boolean;
  "aria-modal"?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-description"?: string;
  focusableContainer?: boolean;
  role?: "dialog" | "alertdialog";
  onScroll?: (e: UIEvent<HTMLElement>) => void;
}>;

export interface ISheetController {
  dim: boolean;
  notch: boolean;
  classNames: string;
  scrollView: React.RefObject<HTMLDivElement>;
  dragDetector: DragDetector<HTMLDivElement>;
}
