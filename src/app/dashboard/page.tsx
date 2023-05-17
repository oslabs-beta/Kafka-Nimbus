'use client'
import React, { useState } from 'react'
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<Array<{
    brokerID: string;
    brokerAddress: string;
    brokerSize: string;
    brokerLeader: string;
    topicid: string;
    topicEndpoint: string;
    topicCount: number;
    consumerid: string;
    consumerEndpoint: string;
    consumerCount: number;
  }>>([]);

  return (
    <>
    <div><Link href="/dashboard/broker-dashboard">Brokers</Link></div>
    <div><Link href="/dashboard/consumer-dashboard">Consumers</Link></div>
    <div><Link href="/dashboard/topic-dashboard">Topics</Link></div>
  </>
  )
}