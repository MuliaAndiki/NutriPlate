interface DataNotFoundProps {
  message?: string;
}

const DataNotFound = ({ message = "Data tidak ditemukan" }: DataNotFoundProps) => {
  return (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      <div className="text-center space-y-1">
        <h1 className="text-base font-semibold">Oops</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default DataNotFound;
