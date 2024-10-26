import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import HomePage from "@/components/HomePage";

// This is a functional component that does not accept any props, meaning it operates independently without needing any external data or inputs.
const Page: React.FC = () => {
  return (
    <main>
      <HomePage />
    </main>
  );
};

export default Page;