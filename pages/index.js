import Image from 'next/image';
import HeroImage from '../public/hero.webp';
import { Logo } from '../components/Logo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative ">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-6 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure, nulla
          quisquam facere voluptatem ratione id minima aliquam voluptates
          praesentium ipsam!
        </p>
        <Link href="/post/new" className="btn ">
          Begin
        </Link>
      </div>
    </div>
  );
}
