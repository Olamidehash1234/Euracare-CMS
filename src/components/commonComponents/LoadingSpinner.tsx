
interface LoadingSpinnerProps {
  heightClass?: string;
}

const LoadingSpinner = ({ heightClass = 'h-screen' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center w-full ${heightClass}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C2141]"></div>
    </div>
  );
};

export default LoadingSpinner;