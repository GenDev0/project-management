"use client";
import { Inter } from "@next/font/google";
import { Alert } from "flowbite-react";
import { Dropdown } from "flowbite-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <h1 className='text-3xl font-bold underline m-2 p-3'>Hello WAT!</h1>
      <div className='m-2 p-3'>
        <Alert color='info'>Alert!</Alert>
      </div>
      <div className='m-2 p-3'>
        <Dropdown label='Dropdown button'>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </main>
  );
}
