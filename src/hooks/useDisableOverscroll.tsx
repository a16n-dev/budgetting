import { useEffect } from 'react';

/**
 * Disables overscroll behaviour on the body and html elements.
 */
const useDisableOverscroll = () => {
  useEffect(() => {
    // add the overscroll behaviour style to body and html
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    return () => {
      // remove the overscroll behaviour style from body and html
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, []);
};

export default useDisableOverscroll;
