import { document } from './sample';

import React from 'react';
import { AANZFTACertificateOfOrigin } from './AANZFTACertificateOfOrigin';

export default {
  title: 'templates/AANZFTA Certificate of Origin',
  component: AANZFTACertificateOfOrigin
};

export const AANZFTACertificateofOrigin = (): JSX.Element => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <AANZFTACertificateOfOrigin
        document={document as any}
        handleObfuscation={() => null}
      />
    </div>
  );
};
