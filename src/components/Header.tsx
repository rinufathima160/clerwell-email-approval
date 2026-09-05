type HeaderProps = {
  emailCount: number;
  totalEmails: number;
};

function Header({ emailCount, totalEmails }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10 lg:px-8">
        {/* Brand */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-400/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-violet-400"
              aria-hidden="true"
            >
              <path
                d="M4 7.5L12 13L20 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3.5"
                y="5"
                width="17"
                height="14"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          <span className="text-sm font-semibold tracking-[0.18em] text-zinc-300 uppercase">
            Clerwell
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
          Email Approval
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Human Approval Queue
        </p>

        {/* Email count */}
        <div className="mt-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-400 shadow-sm">
          <span className="font-semibold text-zinc-100">
            {emailCount}
          </span>

          <span className="mx-1.5">of</span>

          <span className="font-semibold text-zinc-100">
            {totalEmails}
          </span>

          <span className="ml-1.5">emails</span>
        </div>
      </div>
    </header>
  );
}

export default Header;