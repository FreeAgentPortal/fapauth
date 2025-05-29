// components/Logo.tsx
import React from 'react';
import Image from 'next/image';
import logo from '../../public/images/fap icon.png'; // adjust path as needed

const Logo = () => {
  return (
    <Image
      src={logo}
      alt="Free Agent Portal Logo"
      priority
      width={160}
      height={160}
    />
  );
};

export default Logo;
