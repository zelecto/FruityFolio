import React from "react";

const SkeletonTiendaInfo = () => {
  return (
    <div className="w-96 h-[420px] bg-gray-200 p-4 rounded-lg shadow-md my-10">
      <div className="animate-pulse">
        <h2 className="font-bold text-center">Reporte del dia</h2>
        <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto my-5"></div>
        <p className="text-xl font-bold text-center mb-2 bg-gray-300 h-8 rounded"></p>
        <p className="font-bold text-center mb-2 bg-gray-300 h-6 rounded"></p>
        <p className="font-bold text-center mb-2 bg-gray-300 h-6 rounded"></p>
        <p className="font-bold text-center mb-2 bg-gray-300 h-6 rounded"></p>
      </div>
    </div>
  );
};

const SkeletonPedidosSection = () => {
  const numRows = 3;

  return (
    <div className="mx-4 animate-pulse">
      <div className="w-2/3">
        {[...Array(numRows)].map((_, rowIndex) => (
          <div
            key={`row_${rowIndex}`}
            className="flex justify-between p-5 mb-4 bg-gray-200 rounded-lg shadow-md"
          >
            <div className="w-1/2">
              {[...Array(4)].map((_, colIndex) => (
                <p
                  key={`col_${rowIndex}_${colIndex}`}
                  className="font-bold text-center mb-2 bg-gray-300 h-6 rounded"
                ></p>
              ))}
            </div>
            <div className="w-1/5 flex flex-col justify-between">
              {[...Array(2)].map((_, colIndex) => (
                <p
                  key={`col_${rowIndex}_${colIndex}`}
                  className="font-bold text-center mb-[5px] bg-gray-300 h-8 rounded-full"
                ></p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonPedidosSection;

export { SkeletonTiendaInfo, SkeletonPedidosSection };
