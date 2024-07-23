import React from "react";

function Login() {
  return (
    <div>
      <div class="flex min-h-screen items-center justify-center ">
        <div
          class="rounded-lg border bg-card text-card-foreground bg-gray-100 shadow-xl  w-full max-w-md"
          data-v0-t="card"
        >
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="whitespace-nowrap tracking-tight text-3xl font-bold">
              Welcome Back
            </h3>
            <p class="text-sm text-muted-foreground">
              Enter your email and password to access your account.
            </p>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="email"
              >
                Email
              </label>
              <input
                class="flex h-10 w-full bg-white rounded-md border  px-3 py-2 text-sm      "
                id="email"
                placeholder="m@example.com"
                required=""
                type="email"
              />
            </div>
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="password"
              >
                Password
              </label>
              <input
                class="flex h-10 w-full bg-white rounded-md border  px-3 py-2 text-sm      "
                id="password"
                required=""
                type="password"
              />
            </div>
          </div>
          <div class="flex items-center p-6">
            <button class="inline-flex items-center justify-center whitespace-nowrap bg-black text-lg text-white rounded-md  font-medium  h-10 px-4 py-2 w-full">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
