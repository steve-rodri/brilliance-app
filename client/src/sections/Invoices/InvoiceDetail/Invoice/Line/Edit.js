import React, { useRef } from "react";
import { itemDescription, itemContents, inc } from "./Helpers";
import { ReactComponent as TimesIcon } from "../../../../../icons/Close.svg";
import { useDrop, useDrag } from "react-dnd";
import ItemTypes from "../../../../../helpers/ItemTypes";

export default function Edit(props) {
  const {
    id,
    mobile,
    line,
    index,
    length,
    handleLineChange,
    deleteLine,
    reOrderLine
  } = props;
  const handleFocusSelect = e => {
    e.target.select();
  };
  const c = itemContents(line.item);

  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.LINE,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Time to actually perform the action
      reOrderLine(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.LINE, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <tr key={line.id} className="Line" ref={ref} style={{ opacity }}>
      {/* Add - Delete */}
      <td
        style={(index, length, "delete")}
        className="Invoice--cell Line--add-delete"
        onClick={e => {
          e.stopPropagation();
          deleteLine(line.id);
        }}
      >
        <div>{<TimesIcon width="25" height="25" />}</div>
      </td>

      {/* Quantity */}
      {!mobile ? (
        <td
          style={(index, length, "quantity")}
          className="Invoice--cell Line--quantity"
        >
          <form onSubmit={e => e.preventDefault()} autoComplete="off">
            <input
              autoComplete="off"
              className="Line--input"
              name="quantity"
              type="number"
              value={line.quantity || ""}
              onChange={e => handleLineChange(e, line.id)}
              onFocus={handleFocusSelect}
            />
          </form>
        </td>
      ) : null}

      {/* Item */}
      <td style={(index, length)} className="Invoice--cell Line--item">
        <div className="Line--item-description">
          <p>{itemDescription(line.item)}</p>
        </div>
        {c ? <div className="Line--item-contents">{c}</div> : null}
      </td>

      {/* Inc */}
      {!mobile ? (
        <td
          style={(index, length)}
          className="Invoice--cell Line--inc"
          onClick={e => {
            e.stopPropagation();
            handleLineChange(e, line.id, "inc");
          }}
        >
          <div>{inc(line)}</div>
        </td>
      ) : null}

      {/* Price */}
      {!mobile ? (
        <td
          style={(index, length, "price")}
          className="Invoice--cell Line--price"
        >
          {!line.inc ? (
            <form onSubmit={e => e.preventDefault()} autoComplete="off">
              <h2>$</h2>
              <input
                className="Line--input"
                style={{ width: "100%" }}
                name="price"
                type="number"
                value={line.price || ""}
                onChange={e => handleLineChange(e, line.id)}
                onFocus={handleFocusSelect}
              />
            </form>
          ) : null}
        </td>
      ) : null}
    </tr>
  );
}
