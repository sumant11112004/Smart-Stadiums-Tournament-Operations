import React from 'react';

const Card = ({ title, icon: Icon, value, status, description, children, onClick }) => {
  const isClickable = !!onClick;
  
  const cardContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sports-muted">{title}</span>
          {Icon && (
            <div className="rounded-lg p-2 bg-slate-50 text-sports-navy border border-slate-100">
              <Icon className="text-sm" />
            </div>
          )}
        </div>
        {value !== undefined && (
          <div className="text-2xl font-extrabold text-sports-navy tracking-tight mt-1">
            {value}
          </div>
        )}
        {description && (
          <p className="text-[11px] text-sports-muted leading-relaxed font-light mt-1">
            {description}
          </p>
        )}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : 'region'}
      tabIndex={isClickable ? 0 : -1}
      aria-label={title}
      className={`rounded-2xl p-5 bg-white border border-slate-100 shadow-premium transition-all ${
        isClickable 
          ? 'cursor-pointer hover:shadow-premiumHover hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-sports-blueLight' 
          : ''
      }`}
    >
      {cardContent}
    </div>
  );
};

export default React.memo(Card);
