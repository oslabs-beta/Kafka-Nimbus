
import React from 'react';
import Page from './page';

const layout = ({ children, params }: { children: React.ReactNode }) => {
  
  return (
    <div>
      <Page params={params} />
    </div>
  );
};

export default layout;
