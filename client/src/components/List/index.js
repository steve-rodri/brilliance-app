import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "../InfiniteScroll";
import { Item } from "../ListItem";
import Loader from "../Loader";
import "./index.css";

// collectionType
// collection.list properties
// setScrollPosition
// loadMore
// refresh

const List = ({ data, scrollPosition, setScrollPosition, ...rest }) => {
  const listContainer = useRef();
  const mobile = useSelector((state) => state.view.mobile);
  const listStyles = () => {
    let style = {};
    if (!mobile && data && data.length) {
      style = {
        boxShadow: "var(--box-shadow)",
        zIndex: 2,
      };
    }
    return style;
  };
  useEffect(() => {
    const listRef = listContainer.current;
    if (listRef) listRef.scrollTop = scrollPosition;
    return () => {
      const position = listRef.scrollTop;
      if (typeof setScrollPosition === "function") setScrollPosition(position);
    };
  }, [scrollPosition, setScrollPosition]);

  const props = { data, ...rest };
  return (
    <div className="List" ref={listContainer} style={listStyles()}>
      <ColumnHeaders {...props} />
      <Items containerRef={listContainer} data={data} {...rest} />
    </div>
  );
};

const ColumnHeaders = ({
  columnHeaders,
  columnHeaderStyles,
  loading,
  data,
}) => {
  if (!columnHeaders) return null;
  if (data && !data.length) return null;
  if (loading) return null;
  return (
    <div className="Headers" style={columnHeaderStyles()}>
      {columnHeaders().map((header, i) => (
        <h5 key={header} style={!i ? { justifySelf: "start" } : {}}>
          {header}
        </h5>
      ))}
    </div>
  );
};

const Items = ({ data, loading, containerRef, ...rest }) => {
  if (loading && !data.length) {
    return (
      <div className="List--Loader">
        <Loader />
      </div>
    );
  } else
    return (
      <InfiniteScroll {...rest} parentNode={containerRef}>
        {data.map((item) => (
          <Item
            item={item}
            key={item && item.id}
            total={data.length}
            {...rest}
          />
        ))}
        <EndMessage data={data} loading={loading} {...rest} />
      </InfiniteScroll>
    );
};

const EndMessage = ({ data, loading, collectionType }) => {
  if (data.length && loading)
    return (
      <div className="List--Loader">
        <Loader />
      </div>
    );
  if (!data.length && !loading) {
    return (
      <div className="List--None-Found">
        <h3
          style={{ fontWeight: "bold" }}
        >{`No ${collectionType.toLowerCase()} have been found.`}</h3>
      </div>
    );
  }
  return null;
};

export default List;
