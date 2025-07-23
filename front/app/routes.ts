import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  layout("./routes/layout.tsx", [
    route("sign-in", "./routes/sign-in.tsx"),
    route("user", "./routes/user.tsx"),
  ]),
] satisfies RouteConfig;
