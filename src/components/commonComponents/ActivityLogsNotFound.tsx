import React from 'react';

interface NotFoundProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  ctaText?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = 'Nothing to see here',
  description = "It looks like you haven't defined any roles and permission yet. Once Added, they'll appear here for you to manage.",
  imageSrc = '/not-found.png',
}) => {
  return (
    <div className="flex flex-col rounded-[14px] items-center gap-[20px] justify-center py-[40px] lg:py-[150px]">
      <img src={imageSrc} alt={title} />
      <div className="font-semibold text-center">{title}</div>
      <div className="text-center text-sm text-[#010101] max-w-[250px] lg:max-w-[340px]">{description}</div>
    </div>
  );
};

export default NotFound;
