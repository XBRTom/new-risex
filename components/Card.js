import React from 'react';

const Card = ({ title, sections = [] }) => {
  return (
    <div className="bg-black rounded-lg shadow-lg card-container">
      <h3 className="text-lg font-light text-white mb-4">{title}</h3>
      {sections.map((section, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-md font-light text-white mb-2">{section.title}</h4>
          {section.data.length > 0 ? (
            section.data.map((item, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-sm text-white">
                  <strong>{item.label}:</strong> {item.value}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-white">No data available</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Card;
