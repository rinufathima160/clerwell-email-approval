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
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Clerwell Email Approval
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Human Approval Queue
        </p>

        <div className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {emailCount} of {totalEmails} emails
        </div>
      </div>
    </header>
  );
}

export default Header;