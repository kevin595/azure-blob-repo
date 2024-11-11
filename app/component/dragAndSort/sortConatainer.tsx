import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { arrayMove, findItemIndexAtPosition } from "./helper";

export interface ISortContainerProps {
  children: ReactNode;
  /** Called when the user finishes a sorting gesture. */
  onSortEnd: (oldIndex: number, newIndex: number) => void;
}

export interface IPoint {
  x: number;
  y: number;
}

export type OnStartArgs = { point: IPoint; pointInWindow: IPoint };
export type OnMoveArgs = { point: IPoint; pointInWindow: IPoint };

type Context = {
  registerItem: (item: HTMLElement) => void;
  removeItem: (item: HTMLElement) => void;
  // registerKnob: (item: HTMLElement) => void
  // removeKnob: (item: HTMLElement) => void
};

export const SortableListContext = createContext<Context | undefined>(
  undefined
);

const SortContainer: FC<ISortContainerProps> = ({ children, onSortEnd }) => {
  // contains the container element
  const containerRef = useRef<HTMLDivElement>(null); // this array contains the elements than can be sorted (wrapped inside SortableItem)
  const itemsRef = useRef<HTMLElement[]>([]);
  // this array contains the coordinates of each sortable element (only computed on dragStart and used in dragMove for perf reason)
  const itemsRect = useRef<DOMRect[]>([]);
  const containerPositionRef = useRef<IPoint>({ x: 0, y: 0 });

  // contains the target element (copy of the source element)
  const targetRef = useRef<HTMLElement | null>(null);
  // contains the index in the itemsRef array of the element being dragged
  const sourceIndexRef = useRef<number | undefined>(undefined);
  // contains the index in the itemsRef of the element to be exchanged with the source item
  const lastTargetIndexRef = useRef<number | undefined>(undefined);
  // contains the offset point where the initial drag occurred to be used when dragging the item
  const offsetPointRef = useRef<IPoint>({ x: 0, y: 0 });
  const isFirstMoveRef = useRef(false);

  const registerItem = useCallback((item: HTMLElement) => {
    itemsRef.current.push(item);
  }, []);

  const removeItem = useCallback((item: HTMLElement) => {
    const index = itemsRef.current.indexOf(item);
    if (index !== -1) {
      itemsRef.current.splice(index, 1);
    }
  }, []);

  const getMousePoint = (e: MouseEvent | React.MouseEvent): IPoint => ({
    x: Number(e.clientX),
    y: Number(e.clientY),
  });

  const getPointInContainer = (
    point: IPoint,
    containerTopLeft: IPoint
  ): IPoint => {
    return {
      x: point.x - containerTopLeft.x,
      y: point.y - containerTopLeft.y,
    };
  };

  const saveContainerPosition = useCallback(() => {
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      containerPositionRef.current = { x: bounds.left, y: bounds.top };
    }
  }, [containerRef]);

  const copyItem = useCallback(
    (sourceIndex: number) => {
      if (!containerRef.current) {
        return;
      }

      const source = itemsRef.current[sourceIndex];
      const sourceRect = itemsRect.current[sourceIndex];

      const copy = source.cloneNode(true) as HTMLElement;

      // added the "dragged" class name
      //   if (draggedItemClassName) {
      //     draggedItemClassName.split(' ').forEach((c) => copy.classList.add(c))
      //   }

      // we ensure the copy has the same size than the source element
      copy.style.width = `${sourceRect.width}px`;
      copy.style.height = `${sourceRect.height}px`;
      // we place the target starting position to the top left of the window
      // it will then be moved relatively using `transform: translate3d()`
      copy.style.position = "fixed";
      copy.style.margin = "0";
      copy.style.top = "0";
      copy.style.left = "0";

      //   const sourceCanvases = source.querySelectorAll('canvas')
      //   copy.querySelectorAll('canvas').forEach((canvas, index) => {
      //     canvas.getContext('2d')?.drawImage(sourceCanvases[index], 0, 0)
      //   })

      const holder = document.body;
      //   const holder = customHolderRef?.current || document.body
      holder.appendChild(copy);

      targetRef.current = copy;
    },
    []
    // [customHolderRef, draggedItemClassName]
  );

  const updateTargetPosition = (position: IPoint) => {
    if (targetRef.current && sourceIndexRef.current !== undefined) {
      const offset = offsetPointRef.current;
      //   const sourceRect = itemsRect.current[sourceIndexRef.current]
      const newX = position.x - offset.x;
      const newY = position.y - offset.y;
      //   const newX = lockAxis === 'y' ? sourceRect.left : position.x - offset.x
      //   const newY = lockAxis === 'x' ? sourceRect.top : position.y - offset.y

      // we use `translate3d` to force using the GPU if available
      targetRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0px)`;
    }
  };

  const onStart = useCallback(
    ({ pointInWindow }: OnStartArgs) => {
      if (!containerRef.current) {
        return;
      }

      itemsRect.current = itemsRef.current.map((item) =>
        item.getBoundingClientRect()
      );
      console.log("itemsRect", itemsRect);

      const sourceIndex = findItemIndexAtPosition(
        pointInWindow,
        itemsRect.current
      );
      // if we are not starting the drag gesture on a SortableItem, we exit early
      if (sourceIndex === -1) {
        return;
      }

      // saving the index of the item being dragged
      sourceIndexRef.current = sourceIndex;

      // the item being dragged is copied to the document body and will be used as the target
      copyItem(sourceIndex);

      // hide source during the drag gesture
      const source = itemsRef.current[sourceIndex];
      source.style.opacity = "0";
      source.style.visibility = "hidden";

      // get the offset between the source item's window position relative to the point in window
      const sourceRect = source.getBoundingClientRect();
      offsetPointRef.current = {
        x: pointInWindow.x - sourceRect.left,
        y: pointInWindow.y - sourceRect.top,
      };

      updateTargetPosition(pointInWindow);
      // dropTargetLogic.show?.(sourceRect);

      // Adds a nice little physical feedback
      // if (window.navigator.vibrate) {
      //   window.navigator.vibrate(100);
      // }
    },
    [copyItem]
  );

  const onMove = useCallback(({ pointInWindow }: OnMoveArgs) => {
    updateTargetPosition(pointInWindow); // move dragged item to pointer

    const sourceIndex = sourceIndexRef.current;
    // if there is no source, we exit early (happened when drag gesture was started outside a SortableItem)
    if (sourceIndex === undefined || sourceIndexRef.current === undefined) {
      return;
    }

    //   const sourceRect = itemsRect.current[sourceIndexRef.current]
    //   const targetPoint: IPoint = {
    //     x: lockAxis === 'y' ? sourceRect.left : pointInWindow.x,
    //     y: lockAxis === 'x' ? sourceRect.top : pointInWindow.y,
    //   }
    const targetPoint: IPoint = {
      x: pointInWindow.x,
      y: pointInWindow.y,
    };

    const targetIndex = findItemIndexAtPosition(
      targetPoint,
      itemsRect.current,
      {
        fallbackToClosest: true,
      }
    );
    // if not target detected, we don't need to update other items' position
    if (targetIndex === -1) {
      return;
    }
    // we keep track of the last target index (to be passed to the onSortEnd callback)
    lastTargetIndexRef.current = targetIndex;

    const isMovingRight = sourceIndex < targetIndex;

    // in this loop, we go over each sortable item and see if we need to update their position
    for (let index = 0; index < itemsRef.current.length; index += 1) {
      const currentItem = itemsRef.current[index];
      const currentItemRect = itemsRect.current[index];
      // if current index is between sourceIndex and targetIndex, we need to translate them
      if (
        (isMovingRight && index >= sourceIndex && index <= targetIndex) ||
        (!isMovingRight && index >= targetIndex && index <= sourceIndex)
      ) {
        // we need to move the item to the previous or next item position
        const nextItemRects =
          itemsRect.current[isMovingRight ? index - 1 : index + 1];
        if (nextItemRects) {
          const translateX = nextItemRects.left - currentItemRect.left;
          const translateY = nextItemRects.top - currentItemRect.top;
          // we use `translate3d` to force using the GPU if available
          currentItem.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;
        }
      }
      // otherwise, the item should be at its original position
      else {
        currentItem.style.transform = "translate3d(0,0,0)";
      }
      // we want the translation to be animated
      currentItem.style.transitionDuration = "300ms";
    }

    //   dropTargetLogic.setPosition?.(lastTargetIndexRef.current, itemsRect.current, lockAxis)
  }, []);

  const onEnd = useCallback(() => {
    // we reset all items translations (the parent is expected to sort the items in the onSortEnd callback)
    for (let index = 0; index < itemsRef.current.length; index += 1) {
      const currentItem = itemsRef.current[index];
      currentItem.style.transform = "";
      currentItem.style.transitionDuration = "";
    }

    const sourceIndex = sourceIndexRef.current;
    if (sourceIndex !== undefined) {
      // show the source item again
      const source = itemsRef.current[sourceIndex];
      if (source) {
        source.style.opacity = "1";
        source.style.visibility = "";
      }

      const targetIndex = lastTargetIndexRef.current;
      if (targetIndex !== undefined) {
        if (sourceIndex !== targetIndex) {
          // sort our internal items array

          itemsRef.current = arrayMove(
            itemsRef.current,
            sourceIndex,
            targetIndex
          );
          // let the parent know
          onSortEnd(sourceIndex, targetIndex);
        }
      }
    }
    sourceIndexRef.current = undefined;
    lastTargetIndexRef.current = undefined;
    //   dropTargetLogic.hide?.()

    // cleanup the target element from the DOM
    if (targetRef.current) {
      const holder = document.body;
      holder.removeChild(targetRef.current);
      targetRef.current = null;
    }
  }, [onSortEnd]);

  const onDrag = useCallback(
    (pointInWindow: IPoint) => {
      const point = getPointInContainer(
        pointInWindow,
        containerPositionRef.current
      );
      //   if (callbacksRef.current.onMove) {
      //     callbacksRef.current.onMove({ pointInWindow, point })
      //   }
      onMove({ pointInWindow, point });
    },
    [onMove]
  );
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      // if this is the first move, we trigger the onStart logic
      if (isFirstMoveRef.current) {
        isFirstMoveRef.current = false;
        const pointInWindow = getMousePoint(e);
        console.log("pointInWindow", pointInWindow);
        const point = getPointInContainer(
          pointInWindow,
          containerPositionRef.current
        );
        //   if (callbacksRef.current.onStart) {
        //     callbacksRef.current.onStart({ point, pointInWindow })
        //   }
        onStart({ point, pointInWindow });
      }
      // otherwise, we do the normal move logic
      else {
        onDrag(getMousePoint(e));
      }
    },
    [onDrag, onStart]
  );

  const onMouseUp = useCallback(() => {
    isFirstMoveRef.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    // if (callbacksRef.current.onEnd) {
    //   callbacksRef.current.onEnd()
    // }
    onEnd();
  }, [onEnd, onMouseMove]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      console.log(e.button, "button");
      console.log(e.type, "button");
      console.info(itemsRef);
      if (e.button !== 0) {
        return;
      }

      //   if (knobs?.length && !knobs.find((knob) => knob.contains(e.target as Node))) {
      //     return
      //   }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);

      saveContainerPosition();

      // mark the next move as being the first one
      isFirstMoveRef.current = true;
    },
    [onMouseUp, onMouseMove, saveContainerPosition]
    // [onMouseMove, onMouseUp, saveContainerPosition, knobs]
  );

  const context = useMemo(
    () => ({ registerItem, removeItem }),
    [registerItem, removeItem]
  );

  return (
    <div onMouseDown={onMouseDown} ref={containerRef}>
      <SortableListContext.Provider value={context}>
        {children}
      </SortableListContext.Provider>
    </div>
  );
};

export default SortContainer;
