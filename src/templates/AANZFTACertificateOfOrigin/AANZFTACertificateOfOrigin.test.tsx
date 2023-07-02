import React from 'react';
import { render } from '@testing-library/react';
import { AANZFTACertificateOfOrigin } from './AANZFTACertificateOfOrigin';
import { document } from './sample';

describe('aANZFTA Certificate Of Origin', () => {
  it('should render sample data', async () => {
    const { queryByText } = render(
      <AANZFTACertificateOfOrigin
        document={document as any}
        handleObfuscation={jest.fn()}
      />
    );
    const title = await queryByText(
      'AGREEMENT ESTABLISHING THE ASEAN – AUSTRALIA–NEW ZEALAND FREE TRADE AREA (AANZFTA)'
    );
    const consigneeName = await queryByText(
      document?.credentialSubject.supplyChainConsignment.consignee.name
    );
    const consignorName = await queryByText(
      document?.credentialSubject.supplyChainConsignment.consignor.name
    );

    const tradeDiscription = await queryByText(
      document?.credentialSubject.supplyChainConsignment
        .includedConsignmentItems[0].tradeLineItems[0].tradeProduct.description
    );
    const tradeDiscription2 = await queryByText(
      document?.credentialSubject.supplyChainConsignment
        .includedConsignmentItems[1].tradeLineItems[0].tradeProduct.description
    );

    expect(title).toBeInstanceOf(HTMLElement);
    expect(consigneeName).toBeInstanceOf(HTMLElement);
    expect(consignorName).toBeInstanceOf(HTMLElement);
    expect(tradeDiscription).toBeInstanceOf(HTMLElement);
    expect(tradeDiscription2).toBeInstanceOf(HTMLElement);
  });
});
