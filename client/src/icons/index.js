import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle,
  faCheckCircle,
  faTimesCircle,
  faMinusCircle,
  faPlusCircle,
  faQuestion,
  faTimes,
  faPencilAlt,
  faCheck,
  faTrash,
  faSquare as fasSquare,
  faPlus,
  faMinus,
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare as farSquare } from "@fortawesome/free-regular-svg-icons";

library.add(
  faPencilAlt,
  faCheck,
  faTrash,
  faCircle,
  faCheckCircle,
  faTimesCircle,
  faMinusCircle,
  faPlusCircle,
  faQuestion,
  faTimes,
  farSquare,
  fasSquare,
  faPlus,
  faMinus,
  faSearch,
  faSearchPlus,
  faChevronRight,
  faChevronLeft,
  faUserCircle
);

export function statusIcon(str, size) {
  switch (str) {
    case "needsAction":
      return <FontAwesomeIcon className="Icon" icon="question" size={size} />;
    case "Unconfirmed":
      return <FontAwesomeIcon className="Icon" icon="question" size={size} />;
    case "accepted":
      return <FontAwesomeIcon className="Icon" icon="check" size={size} />;
    case "Confirmed":
      return <FontAwesomeIcon className="Icon" icon="check" size={size} />;
    case "tentative":
      return <FontAwesomeIcon className="Icon" icon="minus" size={size} />;
    case "declined":
      return <FontAwesomeIcon className="Icon" icon="times" size={size} />;
    default:
  }
}

export const userCircleIcon = (size, style) => (
  <FontAwesomeIcon
    className={`Icon`}
    icon="user-circle"
    size={size}
    style={style}
  />
);

export const chevronRightIcon = (size, className) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="chevron-right"
    size={size}
  />
);

export const chevronLeftIcon = (size, className) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="chevron-left"
    size={size}
  />
);

export const searchIcon = (size, className) => (
  <FontAwesomeIcon className={`Icon ${className}`} icon="search" size={size} />
);

export const searchPlusIcon = (size, className) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="search-plus"
    size={size}
  />
);

export const plusIcon = (size, className, styles) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="plus"
    size={size}
    style={styles}
  />
);

export const minusIcon = (size, className) => (
  <FontAwesomeIcon className={`Icon ${className}`} icon="minus" size={size} />
);

export const addIcon = (size) => (
  <FontAwesomeIcon className="Icon" icon="plus-circle" size={size} />
);

export const deleteIcon = (size) => (
  <FontAwesomeIcon className="Icon" icon="minus-circle" size={size} />
);

export const timesIcon = (size, color, className) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    color={color}
    icon="times"
    size={size}
  />
);

export const pencilIcon = (size, className, color) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="pencil-alt"
    color={color ? color : null}
    size={size}
  />
);

export const trashIcon = (size, className, color) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="trash"
    color={color ? color : null}
    size={size}
  />
);

export const checkIcon = (size, className, color) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon="check"
    color={color ? color : null}
    size={size ? size : "1x"}
  />
);

export const squareIcon = (style, size, className, color) => (
  <FontAwesomeIcon
    className={`Icon ${className}`}
    icon={style}
    color={color ? color : null}
    size={size ? size : "1x"}
  />
);
