
import React from 'react';
import { cn } from '@/lib/utils';

type FooterLinkSectionProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
  className?: string;
};

const FooterLinkSection = ({ title, links, className }: FooterLinkSectionProps) => (
  <div className={cn("space-y-4", className)}>
    <h3 className="font-semibold text-base">{title}</h3>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href} 
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Templates", href: "#templates" },
    { label: "Integrations", href: "#integrations" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "Blog", href: "#blog" },
    { label: "Press", href: "#press" },
  ];

  const resourceLinks = [
    { label: "Help Center", href: "#help" },
    { label: "API Documentation", href: "#api" },
    { label: "Community", href: "#community" },
    { label: "Status", href: "#status" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookie Policy", href: "#cookies" },
    { label: "GDPR", href: "#gdpr" },
  ];

  return (
    <footer className="bg-gray-50 py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Noterra
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Capture your thoughts with elegant simplicity. Noterra helps you organize your ideas, projects, and tasks with a clean, distraction-free interface.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "Facebook", "Instagram"].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social}
                >
                  <span>{social.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          <FooterLinkSection title="Product" links={productLinks} />
          <FooterLinkSection title="Company" links={companyLinks} />
          <FooterLinkSection title="Resources" links={resourceLinks} />
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Noterra. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
