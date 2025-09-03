import type { RefObject } from "react";

export const setNewOffset = (
  card: RefObject<HTMLDivElement | null>,
  mouseMoveDir?: { x: 0, y: 0 }
) => {
  const offsetLeft = mouseMoveDir?.x ? card!.current!.offsetLeft - mouseMoveDir.x : card!.current!.offsetLeft;
  const offsetTop = mouseMoveDir?.y ? card!.current!.offsetTop - mouseMoveDir.y : card!.current!.offsetTop;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export const autoGrow = (textAreaRef: { current: any }) => {
  const { current } = textAreaRef;
  current.style.height = "auto"; // Reset the height
  current.style.height = current.scrollHeight + "px"; // Set the new height
};

export const setZIndex = (selectedCard: HTMLDivElement | null) => {
    selectedCard!.style.zIndex = '999';
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
           card!.style.zIndex = `${Number(selectedCard!.style.zIndex) - 1}`;
        }
    });
};

const colors: string[] = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];
export const getRandomColor = (): string => colors[Math.floor(Math.random() * colors.length)];