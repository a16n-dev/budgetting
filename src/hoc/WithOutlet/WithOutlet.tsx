import { ReactNode } from 'react';
import { useOutlet } from 'react-router-dom';

const WithOutlet = <T extends JSX.IntrinsicAttributes>(
  Component: (props: T) => ReactNode,
) => {
  return (props: T) => {
    const outlet = useOutlet();

    if (outlet) {
      return outlet;
    }

    return <Component {...props} />;
  };
};

export default WithOutlet;
