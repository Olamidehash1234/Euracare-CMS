export default function NotificationSkeleton() {
  return (
    <div className="max-h-[560px] overflow-auto">
      <table className="w-full table-auto">
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-[#F1F3F5] bg-[#FBFDFF]">
              {/* Checkbox skeleton */}
              <td className="w-12 py-4 pl-4 pr-2 lg:w-[80px]">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
              </td>

              {/* Main content skeleton */}
              <td className="py-4 pr-4 align-middle">
                <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-start gap-2">
                  <div className="flex items-center gap-3 w-full">
                    {/* Title skeleton */}
                    <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
                    
                    {/* Badge skeleton */}
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse hidden lg:block" />
                  </div>

                  {/* Message skeleton */}
                  <div className="w-full lg:w-[700px]">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              </td>

              {/* Time skeleton */}
              <td className="py-4 pr-6 align-middle">
                <div className="h-4 bg-gray-200 rounded w-20 ml-auto animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
