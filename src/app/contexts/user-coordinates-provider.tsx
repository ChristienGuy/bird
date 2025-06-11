"use client";

import React, { createContext, useContext, useState } from "react";

type Coords = {
  latitude: number;
  longitude: number;
};

type UserCoordinates = {
  userCoordinates: Coords;
  setUserCoordinates: React.Dispatch<React.SetStateAction<Coords>>;
};

type UserCoordinatesProviderProps = { children: React.ReactNode };

const defaultCoordinates: Coords = { latitude: 0, longitude: 0 };

const UserCoordinatesContext = createContext<UserCoordinates | undefined>(
  undefined,
);

function UserCoordinatesProvider({ children }: UserCoordinatesProviderProps) {
  const [userCoordinates, setUserCoordinates] =
    useState<Coords>(defaultCoordinates);

  return (
    <UserCoordinatesContext.Provider
      value={{ userCoordinates, setUserCoordinates }}
    >
      {children}
    </UserCoordinatesContext.Provider>
  );
}

function useCoordinates() {
  const context = useContext(UserCoordinatesContext);

  if (!context) {
    throw new Error(
      "useCoordinates must be used within a UserCoordinatesProvider",
    );
  }
  return context;
}

export { UserCoordinatesProvider, useCoordinates };
