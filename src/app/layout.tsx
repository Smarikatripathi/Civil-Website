import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Link from "next/link";

const Navbar = dynamic(() => import("../components/Navbar"), { ssr: true });

export const metadata = {
  title: "Civil Engineering Tools",
  description: "Professional construction calculation tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-blue-50 text-gray-800 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow ">{children}</main> {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">CivilPro</h3>
              <p className="text-sm">
                Your comprehensive platform for civil engineering calculations
                and designs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                {/* Add more social icons as needed */}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/miscellaneous/contactus"
                    className="hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/miscellaneous/feedback"
                    className="hover:text-white"
                  >
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Pokhara, Nepal</li>
                <li>Email: paveengineeringofficial@gmail.com</li>
                <li>Phone: +977-1-XXXXXXX</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto py-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm">
                © {new Date().getFullYear()} CivilPro. All rights reserved.
                Powered by{" "}
                <a
                  href="https://paveengineering.com"
                  className="text-blue-400 hover:text-blue-300"
                >
                  PAVE Engineering Consultancy Pvt. Ltd.
                </a>
              </div>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6 text-sm">
                  <li>
                    <Link
                      href="/miscellaneous/privacypolicy"
                      className="hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/miscellaneous/termsofservices"
                      className="hover:text-white"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/miscellaneous/cookiespolicy"
                      className="hover:text-white"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
