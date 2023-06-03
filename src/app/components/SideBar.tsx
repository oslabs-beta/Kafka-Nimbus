"use client";
import Link from 'next/link';

const SideBar = () => {

  return (
<div className="drawer absolute flex">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
  </div> 
  <div className="drawer-side">
    <label htmlFor="my-drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
      <div className="divider"></div> 
      <li><Link href="/broker-dashboard" className="btn btn-outline btn-primary">Brokers</Link></li>
      <div className="divider"></div> 
      <li><Link href="/topic-dashboard" className="btn btn-outline btn-primary">Topics</Link></li>
      <div className="divider"></div> 
      <li><Link href="/consumer-dashboard" className="btn btn-outline btn-primary">Consumers</Link></li>
    </ul>
  </div>
</div>
  );
};

export default SideBar;
