"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Coords = {
  latitude: number;
  longitude: number;
};

type UserCoordinates = {
  userCoordinates: Coords;
  setUserCoordinates: React.Dispatch<React.SetStateAction<Coords>>;
};

type UserCoordinatesProviderProps = {
  children: React.ReactNode;
  initialCoordinates?: Coords;
};

const defaultCoordinates: Coords = { latitude: 0, longitude: 0 };
const COOKIE_NAME = "userCoordinates";

const UserCoordinatesContext = createContext<UserCoordinates | undefined>(
  undefined,
);

/*
 ** COOKIE UTILITY FUNCTIONS
 */
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

function UserCoordinatesProvider({
  children,
  initialCoordinates,
}: UserCoordinatesProviderProps) {
  const [userCoordinates, setUserCoordinates] = useState<Coords>(
    initialCoordinates || defaultCoordinates,
  );

  // RETRIEVES USER COORDINATES FROM COOKIES
  useEffect(() => {
    if (!initialCoordinates) {
      const savedCoordinates = getCookie(COOKIE_NAME);
      if (savedCoordinates) {
        try {
          const parsed = JSON.parse(savedCoordinates);
          setUserCoordinates(parsed);
          console.log(
            "Location coordinates from cookies successfully retrieved:",
            parsed,
          );
        } catch (error) {
          console.log("Failed to parse saved coordinates:", error);
        }
      }
    }
  }, [initialCoordinates]);

  // SAVES USER COORDINATES TO COOKIES
  useEffect(() => {
    if (userCoordinates.latitude !== 0 || userCoordinates.longitude !== 0) {
      setCookie(COOKIE_NAME, JSON.stringify(userCoordinates));
      console.log(
        "Location coordinates saved to cookies successfully:",
        userCoordinates,
      );
    }
  }, [userCoordinates]);

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
