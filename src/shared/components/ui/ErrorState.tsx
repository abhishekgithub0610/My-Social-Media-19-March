type Props = {
  message?: string;
};

export default function ErrorState({
  message = "Something went wrong",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-semibold mb-2">⚠️ Oops!</h2>
      <p className="text-gray-500 mb-4">{message}</p>

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  );
}
