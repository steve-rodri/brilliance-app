import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./index.css";

const InfiniteScroll = ({
  loading,
  loadMore,
  hasMore,
  parentNode,
  threshold = 0.8,
  children
}) => {
  const container = useRef();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  useEffect(() => {
    const handleScroll = ({
      target: { scrollTop, scrollHeight, offsetHeight }
    }) => {
      const trueScrollHeight = scrollHeight - offsetHeight;
      const scrollingDown = scrollTop > lastScrollTop;
      const thresholdBroken = scrollTop / trueScrollHeight >= threshold;
      setLastScrollTop(scrollTop);

      if (scrollingDown && thresholdBroken && hasMore && !loading) {
        loadMore();
      }
    };
    const node = parentNode.current;
    node.addEventListener("scroll", handleScroll);
    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  });
  return (
    <div className="InfiniteScroll" ref={container}>
      {children}
    </div>
  );
};

InfiniteScroll.propTypes = {
  loadMore: PropTypes.func,
  hasMore: PropTypes.bool,
  threshold: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  scrollParent: PropTypes.string
};

export default InfiniteScroll;
