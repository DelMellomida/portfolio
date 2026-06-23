import React from 'react';

function Timeline({ items, renderItem, getImage, onItemClick, getItemLabel }) {
    const getLabel = getItemLabel || ((item) => item.company || item.title);

    return (
        <>
            <div className="block md:hidden mt-20 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/30 hover:border-blue-500/50"
                            onClick={() => onItemClick?.(item)}
                        >
                            <div className="flex items-start gap-4">
                                {getImage?.(item) && (
                                    <img
                                        src={getImage(item)}
                                        alt={getLabel(item)}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg flex-shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    {renderItem(item)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden md:block mt-8 px-6">
                <div className="max-w-6xl mx-auto relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 transform -translate-x-1/2"></div>

                    <div className="space-y-24">
                        {items.map((item, idx) => {
                            const isLeft = idx % 2 === 0;
                            const image = getImage?.(item);

                            return (
                                <div key={idx} className="relative">
                                    <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-blue-500 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg animate-pulse hover:scale-110 transition-transform duration-300"></div>

                                    <div className="grid grid-cols-2 gap-16 items-center">
                                        <div className="flex justify-end">
                                            {isLeft && (
                                                <div
                                                    className="inline-block cursor-pointer group ml-4"
                                                    onClick={() => onItemClick?.(item)}
                                                >
                                                    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 max-w-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-blue-500/30 group-hover:border-blue-500/50 flex items-center gap-4">
                                                        {image && (
                                                            <img
                                                                src={image}
                                                                alt={getLabel(item)}
                                                                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg flex-shrink-0"
                                                            />
                                                        )}
                                                        {renderItem(item)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-start">
                                            {!isLeft && (
                                                <div
                                                    className="inline-block cursor-pointer group mr-4"
                                                    onClick={() => onItemClick?.(item)}
                                                >
                                                    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 max-w-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-blue-500/30 group-hover:border-blue-500/50 flex items-center gap-4">
                                                        {renderItem(item)}
                                                        {image && (
                                                            <img
                                                                src={image}
                                                                alt={getLabel(item)}
                                                                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg flex-shrink-0"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Timeline;
