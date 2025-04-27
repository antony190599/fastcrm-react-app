import React from 'react';
import InteractionHistory from '../history/InteractionHistory';

const ContactLogsPage = () => {
  return (
    <div className="mx-auto px-4 py-8">
      <InteractionHistory showTitle={false} />
    </div>
  );
};

export default ContactLogsPage;
