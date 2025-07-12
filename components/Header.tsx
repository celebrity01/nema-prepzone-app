import React from "react";

const NemaLogo: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="logo-container flex items-center">
      <span className="logo-nema text-lg md:text-xl font-black tracking-wide">
        NEMA
      </span>
      <span className="logo-prepzone text-lg md:text-xl font-black tracking-wide">
        PrepZone
      </span>
    </div>
    <div className="hidden md:flex items-center gap-2 ml-4">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-green-400 text-sm font-medium">
        AI-Powered Safety Training
      </span>
    </div>
  </div>
);

const PartnershipBadge: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="hidden sm:flex flex-col items-end">
      <span className="text-gray-400 text-xs uppercase tracking-wider">
        Powered by
      </span>
      <span className="font-bold text-teal-400 text-sm md:text-base">
        3MTT Partnership
      </span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">3M</span>
      </div>
      <div className="sm:hidden">
        <span className="font-bold text-teal-400 text-sm">3MTT</span>
      </div>
    </div>
  </div>
);

export const Header: React.FC = () => {
  return (
    <header className="glass-header w-full sticky top-0 z-50 border-b border-gray-700">
      <div className="max-width-container container-padding">
        <div className="flex justify-between items-center py-2">
          <NemaLogo />
          <PartnershipBadge />
        </div>
      </div>
    </header>
  );
};
