import { Api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const singupHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(Api.singUp.url, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setLoading(false);
      if (response.data.success) {
        toast.success(response.data.message);
        setInput({ username: "", email: "", password: "" }); // reset the form
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container flex items-center justify-center w-screen h-screen mx-auto ">
      <form
        onSubmit={singupHandler}
        className="flex flex-col gap-5 p-8 shadow-lg"
      >
        <div className="my-4">
          <h1 className="text-2xl font-bold text-center">Logo</h1>
          <p className="text-base text-center">
            SignUp to share and view memories photos & videos
          </p>
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            name="username"
            value={input.username}
            onChange={changeHandler}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            onChange={changeHandler}
            value={input.password}
            className="focus-visible:ring-transparent"
          />
        </div>

        <Button type="submit">Signup</Button>
        <span className="flex gap-2 text-gray-500">
          Already have an account?
          <Link to="/login" className="text-blue-500 link ">
            SignIn
          </Link>
          Click here
        </span>
      </form>
    </div>
  );
};

export default Signup;
