/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    //If the error pop up of the loader of webpack then here in array you can mention those server library that next js trying to do load into the browser which is wrong so with array we can tell that don't load the server library into the browser.
    serverComponentsExternalPackages: ['bcrypt'],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
