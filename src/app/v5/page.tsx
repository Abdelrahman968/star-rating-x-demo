import Link from "next/link";

export default function V5Page() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center gap-6">
      <h1 className="font-bold text-2xl text-gray-700">
        Done & docs in README.md
      </h1>
      <p>
        <Link
          className="text-blue-500 hover:underline"
          href="https://github.com/abdelrahman968/star-rating-x"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check the repo
        </Link>
      </p>
    </div>
  );
}
