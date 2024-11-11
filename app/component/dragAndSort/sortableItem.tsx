import { FC, ReactNode, useContext, useEffect, useRef } from "react";
import { SortableListContext } from "./sortConatainer";

export interface ISortableItemProps {
  children: ReactNode;
}

const SortableItem: FC<ISortableItemProps> = ({ children }) => {
  const context = useContext(SortableListContext);
  if (!context) {
    throw new Error("SortableItem must be a child of SortableList");
  }
  const { registerItem, removeItem } = context;
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentItem = elementRef.current;
    if (currentItem) {
      registerItem(currentItem);
    }

    return () => {
      if (currentItem) {
        removeItem(currentItem);
      }
    };
    // if the children changes, we want to re-register the DOM node
  }, [registerItem, removeItem, children]);

  //   return React.cloneElement(children, { ref: elementRef })
  return <div ref={elementRef}>{children}</div>;
};

export default SortableItem;
