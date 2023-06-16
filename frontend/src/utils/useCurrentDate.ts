import { useEffect, useState } from "react";

export const useCurrentData = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const currentData = new Date();
    const day = String(currentData.getDate()).padStart(2, "0");
    const month = String(currentData.getMonth() + 1).padStart(2, "0");
    setCurrentDate(`${month}/${day}`);
  }, []);

  return currentDate;
};
