import { useRouter } from "@campus/runtime/router";
import { Button } from "@campus/ui/Button";
import { TextInput } from "@campus/ui/TextInput";
import { cn } from "@campus/ui/cn";
import { useState } from "react";
import { useLogin } from "../../data-access/login.hook";

export interface LoginProps {
  className?: string;
}

export const Login = ({ className }: LoginProps) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync } = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({ username, password });
    router.replace("/");
  };

  return (
    <div className={cn(className)}>
      <form onSubmit={handleSubmit} className="gap-6">
        <TextInput
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button variant="cta" type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};
