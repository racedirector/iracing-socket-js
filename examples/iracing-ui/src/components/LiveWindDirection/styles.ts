import React from "react";

export const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  windDirection: {
    borderRadius: "50%",
    height: 300,
    width: 300,
    backgroundColor: "aqua",
    alignItems: "center",
    justifyContent: "center",
  },
  needle: {
    backgroundColor: "black",
    width: 1,
    height: "100%",
    alignSelf: "center",
  },
};

export default styles;
