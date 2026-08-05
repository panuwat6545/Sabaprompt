'use client';

import React, { createContext, useContext } from "react";

const NotificationContext = createContext<number>(0);

export function NotificationProvider({ children, count }: { children: React.ReactNode; count: number }) {
  return (
    <NotificationContext.Provider value={count}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCount() {
  return useContext(NotificationContext);
}
