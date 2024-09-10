import { Api } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignIn = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const singInHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(Api.singIn.url, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setInput({ username: "", email: "", password: "" }); // reset the form
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container flex items-center justify-center h-screen mx-auto max-w-screen-2xl min-w-screen-sm">
      <form
        onSubmit={singInHandler}
        className="flex flex-col gap-5 p-8 shadow-lg"
      >
        <div className="my-4">
          <h1 className="text-2xl font-bold text-center">Logo</h1>
          <p className="text-base text-center">
            SignUp to share and view memories photos & videos
          </p>
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            className="focus-visible:ring-transparent"
            onChange={changeHandler}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            className="focus-visible:ring-transparent"
            onChange={changeHandler}
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span className="flex gap-2 text-gray-500">
          Create a new account?
          <Link to="/register" className="text-blue-500 link ">
            SignUp
          </Link>
          Click here
        </span>
      </form>
    </div>
  );
};

export default SignIn;
