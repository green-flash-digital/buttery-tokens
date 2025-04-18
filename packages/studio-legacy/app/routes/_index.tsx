import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Buttery Tokens Studio" },
    { name: "description", content: "Welcome to the Buttery Tokens Studio!" },
  ];
};

export default function Index() {
  return (
    <div>
      <h2>Welcome to Buttery Tokens</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus vel
        beatae ratione doloribus! Animi, molestias molestiae nisi exercitationem
        unde, repudiandae asperiores ab consequatur pariatur ex alias quod,
        laudantium dolores debitis.
      </p>
      <div>
        <Link to="/config">Configure a new token set</Link>
      </div>
      <div>
        <Link to="/config">Edit an existing one (requires sign-in)</Link>
      </div>
    </div>
  );
}
