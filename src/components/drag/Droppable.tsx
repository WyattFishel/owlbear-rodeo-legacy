import React from "react";
import { useDroppable } from "@dnd-kit/core";

type DroppableProps = React.HTMLAttributes<HTMLDivElement> & {
  id: string;
  disabled: boolean;
};

function Droppable({ id, children, disabled = false, ...props }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id, disabled });

  return (
    <div ref={setNodeRef} {...props}>
      {children}
    </div>
  );
}

export default Droppable;
