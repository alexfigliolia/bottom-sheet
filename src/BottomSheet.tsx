import type { ForwardedRef, MouseEvent } from "react";
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
import type { IBottomSheetProps, ISheetController } from "types";
import { useClassNames } from "@figliolia/classnames";
import type { IDragDetectorOptions } from "@figliolia/drag-detector";
import { useDragDetector } from "@figliolia/drag-detector";
import { useTimeout, useWindowSize } from "@figliolia/react-hooks";
import "./styles.scss";
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */

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
      role = "dialog",
      clickOutside = true,
      focusableContainer = true,
      "aria-modal": ariaModal = true,
      ...aria
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
        dragging,
      }),
      [dim, open, notch, dragging],
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
        role={role}
        ref={container}
        aria-hidden={!open}
        className={classes}
        aria-modal={ariaModal}
        onClick={onClickOutside}
        {...aria}>
        <div
          ref={ref}
          className="sheet"
          style={{
            transform: `translateY(${translate}px)`,
            transition: `transform ${translate === 0 && !dragDetector.active ? "0.5s" : "0s"}, translate 0.5s, opacity 0.5s, scale 0.5s`,
          }}>
          <div
            ref={scrollView}
            onScroll={onScroll}
            className="sheet-scroll-view"
            tabIndex={focusableContainer ? 0 : undefined}>
            <div {...events} className="pull-down" />
            <div className="sheet-content">{children}</div>
          </div>
        </div>
      </div>
    );
  }),
);
