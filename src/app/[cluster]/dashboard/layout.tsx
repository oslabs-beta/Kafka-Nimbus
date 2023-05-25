import React, {Suspense} from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <div>{children}</div>
    </Suspense>
  );
};

export default layout;
