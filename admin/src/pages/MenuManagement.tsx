import React from "react";
import MenuForm from "../components/MenuForm";

const MenuManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🍽 Menu Management</h1>
      <MenuForm />
    </div>
  );
};

export default MenuManagement;
