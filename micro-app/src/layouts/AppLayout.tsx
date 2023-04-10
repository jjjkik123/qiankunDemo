import { MicroApp } from '@umijs/max';
import React from 'react';

const AppLayout = () => {
  return (
    <>
      <div>AppLayout</div>
      <MicroApp name="app1" base="/app1/project" />
    </>
  );
};

export default AppLayout;
