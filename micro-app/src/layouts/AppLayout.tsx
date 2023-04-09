import { Outlet, MicroApp } from '@umijs/max';
import React from 'react';

const AppLayout = () => {
  console.log('1', Outlet);

  return (
    <>
      <div>AppLayout</div>
      <MicroApp name='app1' base='/app1/project' />
    </>
  );
};

export default AppLayout;
