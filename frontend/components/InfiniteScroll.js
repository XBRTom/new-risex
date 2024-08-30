import React, { useRef, useCallback } from 'react';

const InfiniteScroll = ({ loadMore, hasMore, children }) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMore, hasMore]
  );

  return (
    <div className="infinite-scroll">
      {children}
      <div ref={lastElementRef} className="load-more-trigger"></div>
    </div>
  );
};

export default InfiniteScroll;
