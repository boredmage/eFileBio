import { Divider } from "@nextui-org/react";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="relative bg-black py-12 text-white sm:py-20">
      <div className="mx-auto w-[98%] max-w-7xl space-y-8">
        <ul className="mx-auto grid w-[95%] grid-cols-2 gap-8 sm:flex sm:items-center">
          {["Our traning courses", "Financing", "Our Services", "Blog"].map(
            (item, index) => {
              return (
                <li key={index}>
                  <Link href="/">{item}</Link>
                </li>
              );
            },
          )}
        </ul>
        <div className="relative mx-auto w-[95%]">
          <Divider className="my-4 bg-[#ffffff45]" />
          <div className="absolute inset-0 -right-4 -top-0 m-auto h-fit w-[98%] max-w-7xl">
            <div className="ml-auto flex w-fit items-center gap-3 rounded-full bg-[#FBBF24] p-2 px-4">
              <a href="#" target="_blank" rel="">
                <Facebook fill="white" stroke="transparent" />
              </a>
              <a href="#" target="_blank" rel="">
                <Twitter fill="white" stroke="transparent" />
              </a>
              <a href="#" target="_blank" rel="">
                <Linkedin fill="white" stroke="transparent" />
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto grid w-[95%] grid-cols-2 gap-5 text-small sm:flex sm:items-center sm:space-x-20">
          <QuickInfo title="Location" description="New York, US" />
          <QuickInfo title="Phone" description="+92 000090999" />
          <QuickInfo title="Email" description="Example@gmail.com" />
        </div>
      </div>
    </div>
  );
};

const QuickInfo = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-1">
    <h4 className="text-base font-medium">{title}</h4>
    <p className="text-sm text-default-400">{description}</p>
  </div>
);

export default Footer;
