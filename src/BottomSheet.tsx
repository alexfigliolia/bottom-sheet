import type {
  ForwardedRef,
  MouseEvent,
  PropsWithChildren,
  UIEvent,
} from "react";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClassNames } from "@figliolia/classnames";
import type {
  DragDetector,
  IDragDetectorOptions,
} from "@figliolia/drag-detector";
import { useDragDetector } from "@figliolia/drag-detector";
import { useTimeout, useWindowSize } from "@figliolia/react-hooks";
import "./styles.scss";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

export const BottomSheet = memo(
  forwardRef(function BottomSheet(
    {
      open,
      close,
      children,
      onScroll,
      className,
      dim = false,
      notch = false,
      clickOutside = true,
    }: IBottomSheetProps,
    forwardRef: ForwardedRef<ISheetController>,
  ) {
    const timeout = useTimeout();
    const { width } = useWindowSize();
    const container = useRef<HTMLDivElement>(null);
    const scrollView = useRef<HTMLDivElement>(null);
    const [translate, setTranslate] = useState(0);
    const [dragging, setDragging] = useState(false);
    const threshold = useMemo(() => (width >= 670 ? 0 : 50), [width]);
    const DDOptions: IDragDetectorOptions<HTMLDivElement> = useMemo(
      () => ({
        yThreshold: threshold,
        callback: ({ y, yDelta, yDistance, exit, rect }) => {
          if (exit) {
            setTranslate(0);
            timeout.execute(() => setDragging(false));
            if ((y >= 100 && yDelta > 0) || yDelta > 15 || yDistance > 60) {
              close();
            }
          } else {
            setDragging(true);
            setTranslate(t => Math.max(0, Math.min(t + yDelta, rect.height)));
          }
        },
      }),
      [close, timeout, threshold],
    );

    const dragDetector = useDragDetector<HTMLDivElement>(DDOptions);

    const onClickOutside = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (
          open &&
          clickOutside &&
          !dragging &&
          e.target === container.current
        ) {
          close();
        }
      },
      [dragging, close, open, clickOutside],
    );

    useEffect(() => {
      if (open && scrollView.current) {
        scrollView.current.scrollTop = 0;
        scrollView.current.focus();
      }
    }, [open]);

    const states = useMemo(
      () => ({
        dim,
        open,
        notch,
      }),
      [dim, open, notch],
    );

    const classes = useClassNames("bottom-sheet", className, states);

    const { ref, ...events } = dragDetector.bindings;

    useImperativeHandle(
      forwardRef,
      () => ({
        dim,
        notch,
        scrollView,
        dragDetector,
        classNames: classes,
      }),
      [dragDetector, dim, notch, classes],
    );

    return (
      <div
        role="dialog"
        ref={container}
        aria-modal={true}
        aria-hidden={!open}
        className={classes}
        onClick={onClickOutside}>
        <div
          ref={ref}
          tabIndex={0}
          className="sheet"
          style={{
            transform: `translateY(${translate}px)`,
            transition: `transform ${translate === 0 && !dragDetector.active ? "0.5s" : "0s"}, translate 0.5s, opacity 0.5s, scale 0.5s`,
          }}>
          <div
            ref={scrollView}
            onScroll={onScroll}
            className="sheet-scroll-view">
            <div {...events} className="pull-down" />
            <div className="sheet-content">{children}</div>
          </div>
        </div>
      </div>
    );
  }),
);

export type IBottomSheetProps = PropsWithChildren<{
  open: boolean;
  dim?: boolean;
  notch?: boolean;
  className?: string;
  clickOutside?: boolean;
  close: () => void;
  onScroll?: (e: UIEvent<HTMLElement>) => void;
}>;

export interface ISheetController {
  dim: boolean;
  notch: boolean;
  classNames: string;
  scrollView: React.RefObject<HTMLDivElement>;
  dragDetector: DragDetector<HTMLDivElement>;
}
