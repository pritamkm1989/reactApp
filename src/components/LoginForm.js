import React, { useState } from "react";
import { Modal, Button, Input } from './ui';

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged in with username: ${username}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          Sign In
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
