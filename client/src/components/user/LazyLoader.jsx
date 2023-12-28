import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";

const LazyLoader = ({ children }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return <div ref={containerRef}>{isVisible ? children : null}</div>;
};

LazyLoader.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LazyLoader;
