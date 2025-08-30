import React from "react";

interface AlertProps {
  message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
  const isError = message.includes("Error") || message.includes("Network");

  const styles: React.CSSProperties = {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "4px",
    backgroundColor: isError ? "#f8d7da" : "#d4edda",
    color: isError ? "#721c24" : "#155724",
    border: `1px solid ${isError ? "#f5c6cb" : "#c3e6cb"}`,
  };

  return (
    <div className={`text-center alert ${isError ? "alert-danger" : "alert-success"}`} style={styles}>
      {/* {message} */} Invalid Credentials
    </div>
  );
};

export default Alert;