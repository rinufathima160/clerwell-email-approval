type HeaderProps = {
  emailCount: number;
  totalEmails: number;
};

function Header({
  emailCount,
  totalEmails,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-7 text-center sm:px-6 sm:py-8 lg:px-8">

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Clerwell Email Approval
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Human Approval Queue
        </p>

        {/* Email count */}
        <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
          <span className="font-semibold text-slate-900">
            {emailCount}
          </span>

          <span className="mx-1">
            of
          </span>

          <span className="font-semibold text-slate-900">
            {totalEmails}
          </span>

          <span className="ml-1">
            emails
          </span>
        </div>

      </div>
    </header>
  );
}

export default Header;